# Backend Brief — Block A (handoff)

**Status:** Living handoff doc (2026-05-22)

**Audience:** Backend team or AI agent building the API for Fantasy Predictions.

**Frontend reality (not the full brief scope):** see [`CURRENT_STATE.md`](CURRENT_STATE.md). **Already integrated on frontend:** `POST /api/auth/google` (and email auth routes), `GET /api/leagues`. **UI still on mocks:** favorite-clubs, matches, predictions until those endpoints exist.

**Goal of this file:** spec for **future** backend work — implement endpoints below; frontend wires each when ready.

**Product:** Mobile-first football prediction game (NOT betting). Block A = **fast onboarding** + **first Exact Score** only. No energy, official picks, or game club yet.

---

## 1. What the frontend needs (user journey)

```text
1. Login with Google → receive JWT + player id
2. GET leagues → pick 1..N favorite leagues (search optional)
3. GET favorite clubs filtered by leagueIds → pick 1..N clubs (search optional)
4. PUT player preferences → persist favoriteLeagueIds + favoriteClubIds
5. GET matches for selected leagues → weekly/upcoming list
6. POST prediction → save Exact Score (homeScore, awayScore) per match
7. GET my predictions → show saved scores on match cards
```

**UI language:** Russian labels; API field names in English camelCase JSON.

---

## 2. Global conventions

| Item | Rule |
|------|------|
| Base path | `/api` prefix |
| Auth | `Authorization: Bearer <accessToken>` on all routes except auth login/register/google |
| Content-Type | `application/json` |
| Dates | ISO 8601 UTC (`kickoffAt`, `savedAt`) |
| Errors | `{ "code": string, "message": string, "details"?: unknown }` |
| HTTP codes | `400` validation, `401` unauthorized, `403` forbidden, `404` not found, `409` conflict (e.g. locked match), `422` business rule |

**IDs:** Stable string ids (e.g. `league_la_liga`, `club_real_madrid`, `m_1`). Frontend mocks use the same pattern.

---

## 3. Endpoints (Block A — implement these)

### 3.1 Auth

#### `POST /api/auth/google` — **P0**

Exchange Google ID token for app session.

**Request:**

```json
{
  "idToken": "string"
}
```

**Response `200`:**

```json
{
  "accessToken": "jwt",
  "player": {
    "id": "player_abc",
    "displayName": "string"
  }
}
```

**Why frontend needs it:** Replaces mock button on `/login`. Store `accessToken` client-side (later httpOnly cookie is fine if you prefer).

**Later (UI reserved, not Block A):** `POST /api/auth/register`, `POST /api/auth/login` — same response shape.

---

### 3.2 Leagues (onboarding)

#### `GET /api/leagues` — **P0**

List competitions for onboarding picker.

**Query:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `search` | string | no | Filter by league name or country name (case-insensitive) |
| `countryId` | string | no | Reserved for future country step |

**Response `200`:**

```json
{
  "leagues": [
    {
      "id": "league_la_liga",
      "name": "Ла Лига",
      "countryName": "Испания",
      "countryCode": "ES",
      "isActive": true,
      "crestUrl": "https://..."
    }
  ]
}
```

**Rules:**

- `isActive: false` → frontend shows disabled row (“Скоро”), not selectable.
- Return both active and inactive if you want “coming soon” UX.

**Mock reference:** `src/shared/mocks/leagues.ts`

---

### 3.3 Favorite clubs (onboarding — NOT game squad clubs)

#### `GET /api/favorite-clubs` — **P0**

Clubs for “favorite team” picker, scoped by selected leagues.

**Query:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `leagueIds` | string[] | yes | Repeat param or comma-separated — all selected league ids |
| `search` | string | no | Filter by club name or short name |

**Response `200`:**

```json
{
  "clubs": [
    {
      "id": "club_real_madrid",
      "name": "Real Madrid",
      "shortName": "RMA",
      "leagueId": "league_la_liga",
      "crestUrl": "https://..."
    }
  ]
}
```

**Why separate from `/api/clubs`:** Game **Club** (squad, bot club, virtual match) is a different domain (Sprint 7+). Do not merge onboarding favorites with joinable game clubs in one endpoint.

**Mock reference:** `src/shared/mocks/favoriteClubs.ts`

---

### 3.4 Player preferences

#### `GET /api/players/me/preferences` — **P1**

Load saved onboarding choices (for return visits).

**Response `200`:**

```json
{
  "favoriteLeagueIds": ["league_la_liga", "league_premier"],
  "favoriteClubIds": ["club_real_madrid", "club_arsenal"]
}
```

#### `PUT /api/players/me/preferences` — **P0**

Save after onboarding steps (can be called after leagues only, or after clubs).

**Request:**

```json
{
  "favoriteLeagueIds": ["league_la_liga"],
  "favoriteClubIds": ["club_real_madrid", "club_barcelona"]
}
```

**Response `200`:** same body as GET.

**Validation:**

- Every `favoriteClubId` must belong to a league in `favoriteLeagueIds`.
- At least one `favoriteLeagueId` if clubs are sent.

**Frontend today:** `localStorage` key `fp_preferences`.

---

### 3.5 Matches

#### `GET /api/matches/week` — **P0**

Upcoming matches for the player’s favorite leagues.

**Query:**

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `leagueIds` | string[] | yes | From player preferences (frontend sends explicit list) |
| `week` | number | no | Round/week number; default = current |
| `from` | ISO date | no | Optional window start |
| `to` | ISO date | no | Optional window end |

**Response `200`:**

```json
{
  "week": 34,
  "matches": [
    {
      "id": "m_1",
      "homeTeam": "Real Madrid",
      "awayTeam": "Barcelona",
      "homeClubId": "club_real_madrid",
      "awayClubId": "club_barcelona",
      "kickoffAt": "2026-05-25T18:00:00Z",
      "status": "open",
      "competition": "Ла Лига",
      "leagueId": "league_la_liga",
      "week": 34
    }
  ]
}
```

**`status` enum:** `open` | `locked` | `finished`

- Block A UI only allows predictions when `open`.
- `locked` / `finished` → frontend will disable edit (full rules in `GAME_RULES.md` later).

**Sorting:** ascending by `kickoffAt`.

**Mock reference:** `src/shared/mocks/matches.ts`

#### `GET /api/matches/:id` — **P2** (Block A optional)

Single match + user prediction if exists. Needed when you add a dedicated match page; quick sheet can use list + predictions list for now.

---

### 3.6 Predictions (Block A = Exact Score only)

#### `POST /api/predictions` — **P0**

Create or replace quick prediction for a match.

**Request (Block A minimum):**

```json
{
  "matchId": "m_1",
  "homeScore": 2,
  "awayScore": 1
}
```

**Validation:**

- Match exists and `status === "open"`.
- Scores integers 0–9 (frontend enforces same).
- One prediction per player per match (upsert semantics OK).

**Response `201`:**

```json
{
  "id": "pred_1",
  "matchId": "m_1",
  "homeScore": 2,
  "awayScore": 1,
  "savedAt": "2026-05-22T12:00:00Z"
}
```

**Deferred fields (do NOT require in Block A):** `style`, `energyDistribution`, `isOfficial` — coming in Sprint 4–5.

#### `GET /api/predictions/me` — **P0**

List current player’s predictions for displaying badges/scores on cards.

**Query:** `matchIds` (optional filter)

**Response `200`:**

```json
{
  "predictions": [
    {
      "id": "pred_1",
      "matchId": "m_1",
      "homeScore": 2,
      "awayScore": 1,
      "savedAt": "2026-05-22T12:00:00Z"
    }
  ]
}
```

#### `PATCH /api/predictions/:id` — **P2**

Update before lock. Block A can use POST upsert only.

---

## 4. Priority summary

| Priority | Endpoint | Blocks frontend |
|----------|----------|-----------------|
| **P0** | `POST /api/auth/google` | Real login |
| **P0** | `GET /api/leagues` | Leagues screen |
| **P0** | `GET /api/favorite-clubs` | Clubs screen |
| **P0** | `PUT /api/players/me/preferences` | Persist choices |
| **P0** | `GET /api/matches/week` | Match feed |
| **P0** | `POST /api/predictions` | Save score |
| **P0** | `GET /api/predictions/me` | Show scores on cards |
| **P1** | `GET /api/players/me/preferences` | Return visit |
| **P2** | `GET /api/matches/:id`, `PATCH /api/predictions/:id` | Nice to have |

---

## 5. Entity reference (align with frontend mocks)

See `MOCK_DATA.md` and `src/shared/mocks/`.

| Entity | Key fields |
|--------|------------|
| League | `id`, `name`, `countryName`, `countryCode`, `isActive`, `crestUrl?` |
| FavoriteClub | `id`, `name`, `shortName`, `leagueId`, `crestUrl?` |
| Match | `id`, `homeTeam`, `awayTeam`, `homeClubId`, `awayClubId`, `kickoffAt`, `status`, `competition`, `leagueId`, `week` |
| QuickPrediction | `id`, `matchId`, `homeScore`, `awayScore`, `savedAt` |
| Player | `id`, `displayName` |

---

## 6. Out of scope for Block A backend

Do **not** implement yet (frontend will not call):

- Bookmaker odds, wallets, deposits
- `style` / `energyDistribution` on predictions
- Official vs shadow picks (`POST /api/league-picks`)
- Game club join, virtual match, divisions, bots
- Player Official Rating / form

Reference: `GAME_RULES.md`, `PROJECT_ROADMAP.md` Sprint 4–9.

---

## 7. Suggested implementation order

1. Auth + `GET /api/players/me` stub if needed  
2. Leagues + favorite-clubs catalogs (seed DB from mock ids)  
3. Preferences PUT/GET  
4. Matches week feed (static or imported fixture provider)  
5. Predictions POST + GET me  

---

## 8. Frontend integration notes (after API exists)

- Add `shared/api/httpClient.ts` (Bearer from session).
- Feature APIs: `features/auth/api`, `features/onboarding/api`, `features/quick-prediction/api`.
- Remove reads from `localStorage` for the same keys gradually.
- Keep mocks behind `import.meta.env.DEV` flag if useful for offline dev.

---

## 9. Acceptance criteria (Block A done on backend)

- [ ] New user can auth with Google and receive JWT.
- [ ] Leagues list returns active + inactive; search works.
- [ ] Clubs list filtered by `leagueIds`; search works.
- [ ] Preferences persist across sessions.
- [ ] Matches returned only for given `leagueIds`, sorted by kickoff.
- [ ] Player can POST score 0–9 for `open` match; GET shows it on feed.
- [ ] POST rejected for `locked`/`finished` matches with clear error code.

---

## 10. Copy-paste task for backend (short)

```text
Implement Block A API for Fantasy Predictions:
JWT auth via POST /api/auth/google;
GET /api/leagues (?search);
GET /api/favorite-clubs (?leagueIds required, ?search);
PUT+GET /api/players/me/preferences { favoriteLeagueIds, favoriteClubIds };
GET /api/matches/week (?leagueIds, optional week);
POST /api/predictions { matchId, homeScore, awayScore } with open-match validation;
GET /api/predictions/me.
JSON errors { code, message }. See docs/BACKEND_BRIEF.md and src/shared/mocks for shapes.
Out of scope: energy, official picks, game clubs, virtual match.
```
