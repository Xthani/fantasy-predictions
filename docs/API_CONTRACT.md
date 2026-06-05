# API Contract — Phase 1 (live)

**Обновлено:** 2026-06-05  
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
| POST | `/api/predictions/preview` | `features/quick-prediction/api/predictions.ts` |
| POST | `/api/predictions` | `features/quick-prediction/api/predictions.ts` |
| PATCH | `/api/predictions/:id/official` | `features/quick-prediction/api/predictions.ts` |
| GET | `/api/predictions/me` | `features/quick-prediction/api/predictions.ts` |
| GET | `/api/users/search` | `features/friends/api/friends.ts` |
| GET | `/api/users/:id` | `pages/user-profile/` |
| GET | `/api/friends` | `pages/friends/` |
| GET | `/api/friends/:id/duels` | `pages/user-profile/` |
| DELETE | `/api/friends/:id` | ✅ |
| GET | `/api/friend-requests` | ✅ |
| POST | `/api/friend-requests` | ✅ |
| POST | `/api/friend-requests/:id/accept` | ✅ |
| DELETE | `/api/friend-requests/:id` | ✅ |

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

### Predictions

`POST /api/predictions` и `GET /api/predictions/me` возвращают прогноз с вложенным `match` (тот же shape, что `GET /api/matches`):

```json
{
  "id": "pred_1",
  "matchId": "m_1",
  "homeScore": 2,
  "awayScore": 1,
  "style": "balanced",
  "energyByComponent": { "exactScore": 10, "matchOutcome": 10 },
  "components": {
    "matchOutcome": "home",
    "doubleChance": "1X",
    "totalGoals": "over25",
    "btts": "yes",
    "homeIndividualTotal": 2,
    "awayIndividualTotal": 1,
    "goalDifference": 1,
    "exactTotalGoals": 3,
    "teamGoals": { "home": 2, "away": 1 },
    "exactScore": { "home": 2, "away": 1 }
  },
  "isOfficial": false,
  "totalPoints": null,
  "componentResults": null,
  "gradedAt": null,
  "savedAt": "2026-05-27T12:00:00Z",
  "match": {
    "id": "m_1",
    "homeTeam": "Arsenal",
    "awayTeam": "Chelsea",
    "kickoffAt": "2026-05-28T15:00:00Z",
    "competition": "Premier League",
    "status": "open",
    "homeResultScore": null,
    "awayResultScore": null
  }
}
```

Для `status: "finished"` бэкенд заполняет `totalPoints` и `componentResults`; `homeResultScore` / `awayResultScore` — **счёт основного времени (90 мин)**.

**POST body (расширенный):** `{ matchId, homeScore, awayScore, style?, energyByComponent?, isOfficial? }` — без `style` → `balanced`.

**Official:** до 10 на тур лиги; смена за 4 ч до kickoff. Ошибки: `OFFICIAL_LIMIT_REACHED`, `OFFICIAL_DEADLINE_PASSED`, `INVALID_ENERGY`.

Доп. поля матча:

| Field | Значение |
|-------|----------|
| `scoringPeriod` | всегда `"regularTime"` в Phase 1 |
| `mayHaveExtraTime` | `true` на плей-офф/финалах, где возможны доп. время и пенальти |
| `resultDuration` | `regular` \| `extraTime` \| `penaltyShootout` — как реально завершился матч (инфо; зачёт всё равно по 90 мин) |

---

## Out of scope (Phase 1+)

Google OAuth, refresh token, Official Rating aggregation, game clubs, virtual matches.

Новые ручки — сначала в `fantasy-predictions-back`, затем обновить этот файл.

---

## Friends

| Method | Path | Body / query |
|--------|------|----------------|
| GET | `/api/users/search` | `query` — поиск по логину/имени |
| GET | `/api/users/:id` | публичный профиль игрока |
| GET | `/api/friends` | — |
| DELETE | `/api/friends/:id` | удалить друга |
| GET | `/api/friend-requests` | — |
| POST | `/api/friend-requests` | `{ userId }` |
| POST | `/api/friend-requests/:id/accept` | — |
| DELETE | `/api/friend-requests/:id` | отклонить (входящая) / отменить (исходящая) |

### Response shapes

- `GET /api/users/search` → `{ users: Array<{ id, login, displayName? }> }`
- `GET /api/users/:id` → `{ user, friendshipStatus, stats: { predictionsCount, favoriteLeaguesCount, favoriteClubsCount } }`
- `GET /api/friends` → `{ friends: Array<{ id, login, displayName? }> }`
- `GET /api/friends/:id/duels` → только для `friendshipStatus === friend`. Общие матчи, где оба сделали прогноз: `{ friend, summary, duels[] }`. `duels[].outcome`: `win` \| `loss` \| `draw` \| `pending` (относительно текущего пользователя). Сравнение по `totalPoints` после 90 мин. Ошибка `NOT_FRIENDS` (403).
- `DELETE /api/friends/:id` → `204 No Content`
- `GET /api/friend-requests` → `{ incoming: FriendRequest[], outgoing: FriendRequest[] }`
- `FriendRequest` → `{ id, fromUser, toUser, status, createdAt? }`
