# Sprint Log

---

## Sprint 0 — Setup & Documentation

**Status:** Done (2026-05-22)

---

## Block A — Fast Onboarding UI

**Status:** Done (2026-05-22)

Экраны: login → leagues → clubs → matches + quick score.

---

## Phase 1 — `fantasy-predictions-back`

**Status:** Done (2026-05-27)

- Live API: auth, profile, leagues, clubs, matches, predictions
- Контракт: `fantasy-predictions-back` + `docs/INTEGRATION.md`
- Fix: бесконечный fetch матчей (`mapError` в `useAsyncRequest`)
- Frontend: матч-лента с пагинацией (`offset/limit` + «Показать ещё»)
- Frontend: local-first онбординг (`localStorage` → быстрый переход, backend PATCH → sync)
- Frontend: минимальный `/profile`
- Tech closure: публичные `features/*/index.ts`; страницы без прямых импортов из `features/*/api|model`

---

## Social + profile predictions (2026-06-05)

**Status:** Done

### Friends (backend + frontend)

- Backend: `users/search`, `users/:id`, `friends`, `friend-requests` (migration 003)
- Frontend: `/friends`, `/users/:userId`, блок друзей на `/profile`
- UX: удаление через `…`, плашка входящих заявок, `RequireOnboarding allowWhenComplete`

### Profile predictions (backend + frontend)

- Backend: `GET/POST /api/predictions` — вложенный `match`; join с `matches`
- Backend: `homeResultScore` / `awayResultScore` из sync FINISHED-матчей
- Backend: зачёт по **90 мин** (`score.regularTime`); поля `scoringPeriod`, `mayHaveExtraTime`, `resultDuration` (migration 004)
- Frontend: история прогнозов с командами и лигой; сравнение «Точный счёт» / «Не угадал»
- Frontend: подсказка на карточке плей-офф-матча; пометка «матч решён в пенальти · зачёт по основному времени»
- Refactor: `app/services/match_mapper.py` — единый маппер `Match` → API

Контракт и state: `docs/API_CONTRACT.md`, `CURRENT_STATE.md` (оба репо), `GAME_RULES.md` §1.1, Decision 024.

---

## Sprint 4 — Prediction Core (backend, 2026-06-05)

**Status:** Done (backend + frontend UI)

- Backend migration 005: `style`, `energy_distribution`, `components_snapshot`, `is_official`, `total_points`, `component_results`, `graded_at`
- Domain: derive components from exact score; energy presets (defensive/balanced/aggressive/manual); grading `energy × multiplier`
- API: `POST /api/predictions/preview`, расширенный `POST /api/predictions`, `PATCH /api/predictions/:id/official`
- Official: лимит 10 на тур, дедлайн 4 ч до kickoff
- Docs: `API_CONTRACT.md`, `frontend-wiring.md` §9

---

### Sprint 4 — Prediction Core (frontend, 2026-06-05)

- `QuickScoreSheet`: стиль (defensive/balanced/aggressive), live preview через `POST /api/predictions/preview`, official toggle
- `MatchCard`: бейджи стиля и official
- `/profile`: `totalPoints`, top component breakdown, official/shadow tags
- API client: `previewPrediction`, расширенный `savePrediction`, типы `PredictionDto`

---

## Friend duels (2026-06-05)

**Status:** Done

- Backend: `GET /api/friends/:userId/duels` — общие матчи, сравнение `totalPoints`, summary win/loss/draw
- Frontend: блок «Сравнение прогнозов» на `/users/:userId` (только для друзей)

---

## Docs sync (2026-06-05)

**Status:** Done

- Fixed broken `FRONTEND_INTEGRATION.md` links → `frontend-wiring.md`
- Backend `CURRENT_STATE.md`: Sprint 4 + duels, removed stale «not implemented»
- `PROJECT_ROADMAP`, `DECISION_LOG` 026–027, `GLOSSARY`, `UX_NOTES`, `BACKLOG`, E2E §12
- `ARCHITECTURE.md`: `features/friends`, data sources
- Backend `phase1-api.md` disclaimer → `CURRENT_STATE` / `frontend-wiring` for Sprint 4+
- Backend `docs/README.md`, frontend `docs/README.md` index
- `DEVELOPMENT_WORKFLOW.md` → Sprint 5 as next block

---

## Next phase

**Sprint 5** — Official Rating, shadow stats aggregation — см. [`CURRENT_STATE.md`](CURRENT_STATE.md).
