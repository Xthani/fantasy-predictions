# API Contract — Phase 1 (live)

**Обновлено:** 2026-05-27  
**Детали:** [`INTEGRATION.md`](INTEGRATION.md) → `fantasy-predictions-back/FRONTEND_INTEGRATION.md`

---

## Endpoints

| Method | Path | Фронт |
|--------|------|-------|
| POST | `/api/auth/register` | `features/auth/api/auth.ts` |
| POST | `/api/auth/login` | ✅ |
| GET | `/api/auth/me` | ✅ |
| GET | `/api/profiles/me` | `features/profile/api/profile.ts` |
| PATCH | `/api/profiles/me` | ✅ |
| GET | `/api/leagues` | `features/onboarding/api/leagues.ts` |
| GET | `/api/clubs` | `features/onboarding/api/clubs.ts` |
| GET | `/api/matches` | `features/match-feed/api/matches.ts` |
| POST | `/api/predictions` | `features/quick-prediction/api/predictions.ts` |
| GET | `/api/predictions/me` | ✅ |

---

## Conventions

| Item | Значение |
|------|----------|
| Base URL | `VITE_API_BASE_URL` (без суффикса `/api`) |
| Auth | `Bearer` + `localStorage` ключ `fp_accessToken` |
| JSON | camelCase |
| Errors | `{ code, message }` |

### Pagination (catalog)

List endpoints support `offset`/`limit` and return `pagination: { offset, limit, total, hasMore }`:

- `GET /api/leagues`
- `GET /api/clubs`
- `GET /api/matches`

Frontend uses:

- `/matches`: append next page with `offset += limit`
- `/onboarding/clubs`: per-league loading by sending a single `leagueIds=<id>` per section
- `/onboarding/leagues`: pagination primarily for search results

### Auth body

- **Register:** `{ login, password, displayName? }` — без email
- **Login:** `{ login, password }`
- **Response:** `{ accessToken, user: { id, login, displayName } }`

### Profile PATCH

- `{ favoriteLeagueIds }` после шага лиг
- `{ favoriteClubIds }` после шага клубов

Frontend behavior: onboarding is **local-first**. Selected ids are stored immediately in localStorage and PATCH is used to sync backend profile. This keeps step navigation responsive; backend profile remains the recovery source on reload/login.

Local keys:

- `fp_favoriteLeagues`
- `fp_favoriteClubIds`
- `fp_hasAnyPrediction`

These keys are cleared when the frontend enters unauthenticated state, so local onboarding progress is not shared between users on the same device.

### Query arrays

`leagueIds`, `clubIds`, `matchIds` — повторяющиеся query-параметры: `?leagueIds=a&leagueIds=b`

---

## Out of scope (Phase 1)

Google OAuth, refresh token, energy, official picks, game clubs, virtual matches.

Новые ручки — сначала в `fantasy-predictions-back`, затем обновить этот файл.
