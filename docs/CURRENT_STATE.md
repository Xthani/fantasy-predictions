# Current State (frontend)

**Обновлено:** 2026-05-27

---

## Статус: Phase 1 — live API

Бэкенд: **`fantasy-predictions-back`** → `http://localhost:8000`  
Интеграция: [`INTEGRATION.md`](INTEGRATION.md)

| Шаг | Экран | API |
|-----|--------|-----|
| 0 | `/login` | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| 1 | `/onboarding/leagues` | `GET /api/leagues`, `PATCH /api/profiles/me` |
| 2 | `/onboarding/clubs` | `GET /api/clubs`, `PATCH /api/profiles/me` |
| 3 | `/matches` | `GET /api/matches`, `POST /api/predictions`, `GET /api/predictions/me` |
| 4 | `/profile` | `GET /api/profiles/me`, `GET /api/predictions/me`, catalog lookups |

**Сессия:** `localStorage` → `fp_accessToken`, заголовок `Authorization: Bearer …`.

**Онбординг:** local-first. Выбор лиг/клубов и факт первого прогноза сразу пишутся в `localStorage` через `OnboardingProvider`; PATCH профиля синхронизирует бэкенд в фоне. На reload guard восстанавливает состояние из локального storage и профиля; при logout / unauthenticated локальный прогресс очищается.

**Пагинация:** `/api/leagues`, `/api/clubs`, `/api/matches` используют `offset/limit` + `pagination.hasMore`; клубы догружаются отдельно под каждой выбранной лигой.

---

## Запуск

```bash
# fantasy-predictions-back
docker compose up -d --build

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

## Код (Phase 1)

| Слой | Файлы |
|------|--------|
| HTTP | `shared/api/httpClient.ts` |
| Auth | `features/auth/api/auth.ts`, `AuthProvider`, `RequireAuth` |
| Profile | `features/profile/api/profile.ts` |
| Onboarding | `features/onboarding/api/leagues.ts`, `clubs.ts` |
| Matches | `features/match-feed/api/matches.ts` |
| Predictions | `features/quick-prediction/api/predictions.ts` |
| Profile | `pages/profile/page.tsx` |

---

## Следующий этап (TBD)

Определяется продуктом. Кандидаты после Phase 1:

- профиль: нормальная история прогнозов с названиями матчей (нужен backend contract: predictions with match snapshot или matches by ids)
- фильтры лиг на ленте матчей
- energy / official picks / game club (см. `PROJECT_ROADMAP.md`)

Идеи без срока → [`BACKLOG.md`](BACKLOG.md).

---

## Документы

См. [`README.md`](README.md) — полный индекс.

Бэкенд-спеки и seed — **только** в `fantasy-predictions-back`.
