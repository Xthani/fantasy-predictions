# Current State (frontend)

**Обновлено:** 2026-06-05

---

## Статус: Phase 1 — live API + social + profile predictions

Бэкенд: **`fantasy-predictions-back`** → `http://localhost:8000`  
Интеграция: [`INTEGRATION.md`](INTEGRATION.md)

| Шаг | Экран | API |
|-----|--------|-----|
| 0 | `/login` | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| 1 | `/onboarding/leagues` | `GET /api/leagues`, `PATCH /api/profiles/me` |
| 2 | `/onboarding/clubs` | `GET /api/clubs`, `PATCH /api/profiles/me` |
| 3 | `/matches` | `GET /api/matches`, `POST /api/predictions`, `GET /api/predictions/me` |
| 4 | `/profile` | `GET /api/profiles/me`, `GET /api/predictions/me`, catalog lookups, `GET /api/friend-requests` |
| 5 | `/friends` | `GET /api/users/search`, `GET/DELETE /api/friends`, friend-request endpoints |
| 6 | `/users/:userId` | `GET /api/users/:id`, `POST /api/friend-requests`, `DELETE /api/friends/:id` |

**Сессия:** `localStorage` → `fp_accessToken`, заголовок `Authorization: Bearer …`.

**Онбординг:** local-first. Выбор лиг/клубов и факт первого прогноза сразу пишутся в `localStorage`; PATCH профиля синхронизирует бэкенд в фоне. Guard `RequireOnboarding` с `allowWhenComplete` — после онбординга доступны `/friends` и `/users/:id` без редиректа на `/profile`.

**Пагинация:** `/api/leagues`, `/api/clubs`, `/api/matches` — `offset/limit` + `pagination.hasMore`.

---

## Профиль и прогнозы

- `GET /api/predictions/me` — каждый прогноз с вложенным `match` (команды, лига, kickoff, результат).
- Сравнение прогноза с результатом: **только основное время (90 мин)** — см. `GAME_RULES.md` §1.1.
- UI: «Точный счёт» / «Не угадал» / «Ожидаем результат»; для плей-офф — пометка о доп. времени и пенальти.
- Утилиты: `shared/utils/predictionOutcome.ts`, `shared/utils/matchScoring.ts`.

---

## Друзья

- `/friends` — поиск, входящие/исходящие заявки, список друзей, удаление через меню `…`.
- `/users/:userId` — публичный профиль, добавить/удалить друга.
- `/profile` — блок «Друзья» с плашкой входящих заявок.

---

## Запуск

```bash
# fantasy-predictions-back
docker compose up -d --build
docker compose exec api alembic upgrade head   # миграции 003–004

# fantasy-predictions
cp .env.example .env.local
npm install
npm run dev
```

`.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

E2E: `fantasy-predictions-back/FRONTEND_INTEGRATION.md` §11.

---

## Код

| Область | Путь |
|---------|------|
| HTTP | `shared/api/httpClient.ts` |
| Auth | `features/auth/` |
| Profile API | `features/profile/` |
| Onboarding | `features/onboarding/` |
| Matches | `features/match-feed/` |
| Predictions | `features/quick-prediction/` |
| Friends | `features/friends/` |
| Profile page | `pages/profile/` |
| Friends page | `pages/friends/` |
| User profile | `pages/user-profile/` |

---

## Следующий этап (TBD)

- фильтры лиг на ленте матчей
- опциональные прогнозы на доп. время / пенальти (`mayHaveExtraTime`) — см. `BACKLOG.md`
- energy / official picks / game club — `PROJECT_ROADMAP.md`

Идеи без срока → [`BACKLOG.md`](BACKLOG.md).

---

## Документы

См. [`README.md`](README.md). Бэкенд-спеки — **только** в `fantasy-predictions-back`.
