# API Contract

## Current State (frontend)

**Source of truth:** [`CURRENT_STATE.md`](CURRENT_STATE.md).

**Обновлено:** 2026-05-24. **Статус:** ждём бэкенд на шагах 3–6.

| Method | Path | Frontend |
|--------|------|----------|
| POST | `/api/auth/google` | ✅ Wired |
| POST | `/api/auth/login`, `/signup`, `/refresh`, `/logout` | ✅ Wired (if backend responds) |
| GET | `/api/auth/me` | ✅ Wired — restore session |
| GET | `/api/leagues` | ✅ Wired |
| GET | `/api/profiles/me` | ✅ Wired — hydrate selection |
| PATCH | `/api/profiles/me` | ✅ Wired — save `favoriteLeagueIds` on leagues step |
| GET | `/api/teams?leagueIds=&name=` | ✅ Wired — clubs onboarding |
| GET | `/api/matches` | ⏳ Waiting — match feed |
| POST/GET | `/api/predictions` | ⏳ Waiting |

**Mocks removed.** No localStorage for onboarding or predictions.

---

## Conventions (live)

| Item | Rule |
|------|------|
| Base URL | `VITE_API_BASE_URL` (no trailing `/api`) |
| Auth tokens | Cookies `fp_access_token`, `fp_refresh_token` |
| API requests | `credentials: 'include'` + `Authorization: Bearer` from cookie |
| Format | JSON |
| Errors | `{ "code"?: string, "message": string \| string[] }` → `ApiError` |
| Ngrok | Header `ngrok-skip-browser-warning: true` when host contains `ngrok-free.dev` |

---

## Live endpoints

### Auth

#### `POST /api/auth/google`

**Body:** `{ "idToken": string }`

**Response:** `{ "accessToken": string, "refreshToken": string, "user": AuthUser }`

Tokens saved to cookies on frontend. User kept in React state.

---

#### `GET /api/auth/me`

**Purpose:** Restore user on page reload when cookies present.

---

### Leagues

#### `GET /api/leagues`

**Query:** `search?` (optional; frontend also filters client-side today)

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

**Frontend domain `League`:** `id` ← `league_id`, `name` ← `league_name`, `countryName` ← `country_name`, `countryCode` ← `country_id`, `isActive` ← `is_active`, `crestUrl` ← `league_logo` || `country_logo`.

**Expected from backend:** 5 featured active leagues without search; full catalog via `search`.

---

## Waiting for backend

### Profile

#### `GET /api/profiles/me`

**Response (camelCase):**

```json
{
  "displayName": "Ivan",
  "countryCode": "KG",
  "avatarAssetId": "uuid-or-null",
  "favoriteLeagueIds": ["302", "152"],
  "favoriteClubIds": []
}
```

Frontend also accepts snake_case variants (`favorite_league_ids`, etc.).

#### `PATCH /api/profiles/me`

Partial update. **Wired on leagues step:**

```json
{
  "favoriteLeagueIds": ["302", "152"]
}
```

**Planned on clubs step:**

```json
{
  "favoriteClubIds": ["76", "80"]
}
```

Other fields: `displayName`, `countryCode`, `avatarAssetId` — reserved for profile screen later.

---

### Teams (onboarding)

#### `GET /api/teams`

**Wired on clubs step.**

| Param | Used | Notes |
|-------|------|-------|
| `leagueIds` | ✅ | Id выбранных лиг; league mode → 2 команды на лигу |
| `name` | ✅ | Поиск по имени (debounce 300ms) |
| `ids` | ❌ | Id **команд**, не лиг — для нашего флоу не нужен |
| `limit`, `offset` | ❌ | Только без league mode |
| `allTeams` | ❌ | По умолчанию `false` → 2 на лигу |

**Response:** `{ "teams": [{ "team_key", "team_name", "team_badge", ... }] }`

Frontend maps: `id` ← `team_key`, `crestUrl` ← `team_badge`, `leagueId` из запроса (по одному `leagueIds` на запрос).

---

### Matches

#### `GET /api/matches?leagueIds=...&clubIds=...&limit=10`

**Rules:** Only matches of selected clubs in selected leagues; sorted by `kickoffAt ASC`; max 10.

---

### Predictions

#### `POST /api/predictions`

**Body:** `{ "matchId": string, "homeScore": number, "awayScore": number }`

#### `GET /api/predictions/me`

List current player predictions for match cards.

---

## Future API Draft

See `BACKEND_BRIEF.md` for full game MVP endpoints (official picks, game clubs, virtual match, etc.).

---

## Not in MVP API

- Real-money wallet
- Bookmaker odds feed
