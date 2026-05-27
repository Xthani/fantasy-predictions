# Development Workflow

**Frontend leads the project.** The app is built in visible UI blocks first; infrastructure and backend follow from what the UI proved.

**Что работает сейчас:** [`CURRENT_STATE.md`](CURRENT_STATE.md).

---

## Current phase: waiting for backend

Auth + leagues работают на API. Клубы, матчи, profile PUT — **заглушки на фронте**, ждём ручки.

**Моки удалены.** localStorage не используется (кроме cookies для JWT).

---

## Rhythm (per block)

```text
1. UI/UX block     → touchable screens (stub or API)
2. Tech closure    → lint, format, small refactors, docs sync
3. Backend pack    → contract brief for API
4. Wire endpoint   → features/<name>/api/ + hook + update CURRENT_STATE.md
```

---

## Frontend-led rules

- New dependencies only when a **visible** screen or shared UI needs them.
- **No mocks** — screens without API show honest «waiting for backend» stubs.
- Onboarding state lives in `OnboardingProvider` (in-memory); auth tokens in cookies.
- After each integration slice: update **`CURRENT_STATE.md`**, `SPRINT_LOG.md`, `API_CONTRACT.md`.
- Russian UI copy in components; English in `/docs`.

---

## Wiring a new backend endpoint (checklist)

1. Add `features/<feature>/api/<resource>.ts` — raw DTO + `map*` + `fetch*`.
2. Use `httpRequest` from `shared/api/httpClient.ts`.
3. Page hook: `useAsyncRequest` or feature-specific hook; **loading / error / empty / success**.
4. Map errors via `shared/lib/getApiErrorMessage` + `features/<feature>/lib/*Errors.ts` if needed.
5. Update `CURRENT_STATE.md` and `API_CONTRACT.md`.

---

## Current focus

**Done:** auth API (cookies), leagues API, cleanup (no mocks, no localStorage).

**Waiting for backend:**

1. `GET /api/leagues` — correct 5 featured leagues + search
2. `PUT /api/players/me` — favorite leagues/clubs
3. `GET /api/teams?leagueIds=`
4. `GET /api/matches`
5. predictions API

See `CURRENT_STATE.md` for priority order.
