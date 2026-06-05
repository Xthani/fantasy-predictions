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

## Next phase

**TBD** — см. [`CURRENT_STATE.md`](CURRENT_STATE.md), [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md).
