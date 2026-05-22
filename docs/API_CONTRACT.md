# API Contract

## Current State (frontend)

**Source of truth:** [`CURRENT_STATE.md`](CURRENT_STATE.md).

| Method | Path | Frontend |
|--------|------|----------|
| POST | `/api/auth/google` | ✅ Wired |
| POST | `/api/auth/login`, `/signup`, `/refresh`, `/logout`, GET `/me` | ✅ Wired (if backend responds) |
| GET | `/api/leagues` | ✅ Wired |
| GET | `/api/favorite-clubs` | ⏳ Planned — mocks on UI |
| PUT | `/api/players/me/preferences` | ⏳ Planned — `fp_preferences` local |
| GET | `/api/matches/week` | ⏳ Planned — mocks |
| POST/GET | `/api/predictions` | ⏳ Planned — localStorage |

**Mocks** (`src/shared/mocks/`): clubs, matches — until backend ready.

**Draft / future endpoints:** `BACKEND_BRIEF.md`, sections below.

Entity shapes (mocks): `MOCK_DATA.md`.

---

## Conventions (live)

| Item | Rule |
|------|------|
| Base URL | `VITE_API_BASE_URL` (no trailing `/api`) |
| Auth | `Authorization: Bearer <accessToken>`; public routes: `auth: false` in `httpRequest` |
| Format | JSON |
| Errors | `{ "code"?: string, "message": string \| string[] }` → `ApiError` |
| Ngrok | Header `ngrok-skip-browser-warning: true` when host contains `ngrok-free.dev` |

---

## Future API Draft

### Auth (onboarding)

#### `POST /api/auth/google`

**Purpose:** Exchange Google ID token for session JWT.

**Body:** `{ "idToken": string }`

**Response:** `{ "accessToken": string, "player": Player }`

---

#### `POST /api/auth/register`

**Purpose:** Manual account (planned after Google-only launch).

**Body:** `{ "email": string, "password": string, "displayName": string }`

**Response:** same as Google login.

---

#### `POST /api/auth/login`

**Purpose:** Email/password sign-in (planned).

**Body:** `{ "email": string, "password": string }`

---

### Player preferences (fast onboarding)

#### `GET /api/leagues`

**Purpose:** List leagues for onboarding (active + coming soon).

**Query:** `search?`, `countryId?` (optional; frontend filters client-side today)

**Response `200` (backend snake_case):**

```json
{
  "leagues": [
    {
      "league_id": "302",
      "league_name": "La Liga",
      "country_id": "6",
      "country_name": "Spain",
      "league_logo": "https://...",
      "country_logo": "https://...",
      "league_season": "2025/2026",
      "display_order": 3,
      "is_active": true
    }
  ]
}
```

**Frontend domain `League`:** `id` ← `league_id`, `name` ← `league_name`, `countryName` ← `country_name`, `countryCode` ← `country_id`, `isActive` ← `is_active`, `crestUrl` ← `league_logo` || `country_logo`, `season` ← `league_season`. Sorted by `display_order`.

---

#### `GET /api/favorite-clubs`

**Purpose:** Favorite clubs picker (onboarding). **Not** game squad clubs.

**Query:** `leagueIds` (required, array), `search?`

**Response:** `{ "clubs": FavoriteClub[] }` — `id`, `name`, `shortName`, `leagueId`, `crestUrl?`

---

#### `PUT /api/players/me/preferences`

**Purpose:** Save favorite leagues + clubs after onboarding.

**Body:**

```json
{
  "favoriteLeagueIds": ["league_la_liga"],
  "favoriteClubIds": ["club_real_madrid"]
}
```

---

### Matches

#### `GET /api/matches/week`

**Purpose:** Weekly match feed for player's favorite leagues.

**Query:** `leagueIds` (array, required), `week?`, `from?`, `to?`

**Response (draft):**

```json
{
  "week": 12,
  "matches": [
    {
      "id": "m_1",
      "homeTeam": "Madrid Crown",
      "awayTeam": "Sevilla Reds",
      "kickoffAt": "2026-05-25T18:00:00Z",
      "status": "open",
      "competition": "La Liga"
    }
  ]
}
```

---

#### `GET /api/matches/:id`

**Purpose:** Single match for prediction screen.

**Response (draft):** match + lock state + user prediction if any.

---

### Predictions

#### `POST /api/predictions`

**Purpose:** Create prediction (Exact Score + style + energy split).

**Body (draft):**

```json
{
  "matchId": "m_1",
  "homeScore": 2,
  "awayScore": 1
}
```

**Block A:** scores only. **Later:** `style`, `energyDistribution`.

**Response:** `{ "id", "matchId", "homeScore", "awayScore", "savedAt" }`

---

#### `GET /api/predictions/me`

**Purpose:** List current Player predictions (official + shadow flags).

---

#### `PATCH /api/predictions/:id`

**Purpose:** Update before deadline (4h rule). Rejected if locked.

---

### Official Picks

#### `POST /api/league-picks`

**Purpose:** Mark predictions as **Official Predictions** for the round.

**Body (draft):**

```json
{
  "predictionIds": ["p_1", "p_2"],
  "order": [1, 2]
}
```

**Response:** confirmed official list, shadow remainder.

---

### Players

#### `GET /api/players/me`

**Purpose:** Current Player profile, **Official Rating**, form, stats.

---

#### `GET /api/players/:id`

**Purpose:** Public Player card (club, rating, form).

---

### Clubs (game — NOT Block A)

#### `GET /api/clubs`

**Purpose:** List joinable game clubs (starter + bot). Distinct from `GET /api/favorite-clubs`.

---

#### `GET /api/clubs/:id`

**Purpose:** Club detail — squad, next **Virtual Match**, division.

---

#### `POST /api/clubs/:id/apply`

**Purpose:** Apply to join club. **Bot Club** may auto-accept.

**Body:** `{ "message"?: string }`

---

### Virtual Matches

#### `GET /api/virtual-matches/current`

**Purpose:** Active virtual fixture for Player's club — lineup deadline, Team Energy, opponent.

---

### Divisions

#### `GET /api/divisions/:id/table`

**Purpose:** League table — clubs, points, played, virtual W/D/L.

**Response (draft):**

```json
{
  "divisionId": "d_1",
  "season": "2025-26",
  "rows": [
    { "clubId": "c_1", "played": 5, "won": 3, "drawn": 1, "lost": 1, "points": 10 }
  ]
}
```

---

## Not in MVP API

- Real-money wallet
- Bookmaker odds feed
- Internal transfer chat (see `DECISION_LOG.md` Decision 006)
