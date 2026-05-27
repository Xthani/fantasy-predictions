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

### Auth body

- **Register:** `{ login, password, displayName? }` — без email
- **Login:** `{ login, password }`
- **Response:** `{ accessToken, user: { id, login, displayName } }`

### Profile PATCH

- `{ favoriteLeagueIds }` после шага лиг
- `{ favoriteClubIds }` после шага клубов

### Query arrays

`leagueIds`, `clubIds`, `matchIds` — повторяющиеся query-параметры: `?leagueIds=a&leagueIds=b`

---

## Out of scope (Phase 1)

Google OAuth, refresh token, energy, official picks, game clubs, virtual matches.

Новые ручки — сначала в `fantasy-predictions-back`, затем обновить этот файл.
