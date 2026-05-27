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

**Сессия:** `localStorage` → `fp_accessToken`, заголовок `Authorization: Bearer …`.

**Онбординг:** выбор лиг/клубов в `OnboardingProvider` (in-memory) + синхронизация с профилем через PATCH.

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

---

## Следующий этап (TBD)

Определяется продуктом. Кандидаты после Phase 1:

- logout в UI, guard онбординга по `GET /api/profiles/me`
- фильтры лиг на ленте матчей
- energy / official picks / game club (см. `PROJECT_ROADMAP.md`)

Идеи без срока → [`BACKLOG.md`](BACKLOG.md).

---

## Документы

См. [`README.md`](README.md) — полный индекс.

Бэкенд-спеки и seed — **только** в `fantasy-predictions-back`.
