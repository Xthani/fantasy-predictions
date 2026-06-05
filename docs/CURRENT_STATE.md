# Current State (frontend)

**Обновлено:** 2026-06-05

---

## Статус: Phase 1 — live API + prediction core + social + friend duels

Бэкенд: **`fantasy-predictions-back`** → `http://localhost:8000`  
Интеграция: [`INTEGRATION.md`](INTEGRATION.md)

| Шаг | Экран | API |
|-----|--------|-----|
| 0 | `/login` | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| 1 | `/onboarding/leagues` | `GET /api/leagues`, `PATCH /api/profiles/me` |
| 2 | `/onboarding/clubs` | `GET /api/clubs`, `PATCH /api/profiles/me` |
| 3 | `/matches` | `GET /api/matches`, `POST /api/predictions`, `POST /api/predictions/preview`, `GET /api/predictions/me` |
| 4 | `/profile` | `GET /api/profiles/me`, `GET /api/predictions/me`, catalog lookups, `GET /api/friend-requests` |
| 5 | `/friends` | `GET /api/users/search`, `GET/DELETE /api/friends`, friend-request endpoints |
| 6 | `/users/:userId` | `GET /api/users/:id`, `GET /api/friends/:id/duels`, friend-request endpoints |

**Сессия:** `localStorage` → `fp_accessToken`, заголовок `Authorization: Bearer …`.

**Онбординг:** local-first. Выбор лиг/клубов и факт первого прогноза сразу пишутся в `localStorage`; PATCH профиля синхронизирует бэкенд в фоне. Guard `RequireOnboarding` с `allowWhenComplete` — после онбординга доступны `/friends` и `/users/:id` без редиректа на `/profile`.

**Пагинация:** `/api/leagues`, `/api/clubs`, `/api/matches` — `offset/limit` + `pagination.hasMore`.

---

## Профиль и прогнозы

- `GET /api/predictions/me` — каждый прогноз с вложенным `match` (команды, лига, kickoff, результат).
- Сравнение прогноза с результатом: **только основное время (90 мин)** — см. `GAME_RULES.md` §1.1.
- UI лист прогноза: стиль энергии, превью компонентов, official toggle, `maxPoints`.
- UI профиль: `totalPoints`, breakdown по компонентам, метки official/shadow, стиль.
- Для плей-офф — пометка о доп. времени и пенальти.
- Утилиты: `shared/utils/predictionOutcome.ts`, `shared/utils/matchScoring.ts`.

---

## Друзья

- `/friends` — поиск, входящие/исходящие заявки, список друзей, удаление через меню `…`.
- `/users/:userId` — публичный профиль, добавить/удалить друга; для друзей — блок **«Сравнение прогнозов»** (общие матчи, очки, win/loss/draw).
- `/profile` — блок «Друзья» с плашкой входящих заявок.

---

## Запуск

```bash
# fantasy-predictions-back
docker compose up -d --build
docker compose exec api alembic upgrade head   # миграции до 005

# fantasy-predictions
cp .env.example .env.local
npm install
npm run dev
```

`.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

E2E: [`fantasy-predictions-back/docs/integration/frontend-wiring.md`](../fantasy-predictions-back/docs/integration/frontend-wiring.md) §12.

### Vercel (frontend)

- Build: `npm run build` → `dist/`
- `vercel.json` — SPA rewrite: все пути → `index.html` (иначе F5 на `/profile`, `/friends` и т.д. даёт 404)
- Env: `VITE_API_BASE_URL` → URL Render-бэкенда

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

## Следующий этап

**Sprint 5** — Official Rating 0–110, Shadow Stats aggregation.

Polish (без блокера):

- manual style UI (API готов)
- PATCH official из профиля
- фильтры лиг на ленте матчей
- полный breakdown 10 компонентов в профиле
- friend duels: счётчик общих матчей на `/friends`

Дальше: game club / virtual match — `PROJECT_ROADMAP.md`

Идеи без срока → [`BACKLOG.md`](BACKLOG.md).

---

## Документы

См. [`README.md`](README.md). Бэкенд-спеки — **только** в `fantasy-predictions-back`.
