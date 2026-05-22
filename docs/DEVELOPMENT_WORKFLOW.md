# Development Workflow

**Frontend leads the project.** The app is built in visible UI blocks first; infrastructure and backend follow from what the UI proved.

**Что работает сейчас:** [`CURRENT_STATE.md`](CURRENT_STATE.md).

---

## Rhythm (per block)

```text
1. UI/UX block     → touchable screens on mocks (demoable product slice)
2. Tech closure    → lint, format, small refactors, barrels, docs sync
3. Backend pack    → large prompt / contract brief for API (only when UI + tech are stable)
```

Do **not** mix heavy infra (ESLint, big refactors) into the middle of a UI block — it slows feedback and creates throwaway work.

Do **not** write the full backend brief before the UI path is walked end-to-end — contracts come from real screens.

---

## Block naming

| Block | Product slice | Backend |
|-------|---------------|---------|
| **A** | Fast onboarding: login → leagues → clubs → matches → quick Exact Score | UI done; **auth + leagues on API**; rest mocks until backend |
| **B+** | Tabs, full prediction, profile, game loop | Per `PROJECT_ROADMAP` |

`BACKEND_BRIEF.md` describes **целевые** ручки для бэка, не обязательный полный чеклист на сегодня.

---

## Frontend-led rules

- New dependencies only when a **visible** screen or shared UI needs them.
- Mocks in `shared/mocks/` for screens **без готового API**; replace with `features/<name>/api/` + `httpClient` when backend ships.
- After each integration slice: update **`CURRENT_STATE.md`**, `SPRINT_LOG.md`, `API_CONTRACT.md` (live section).
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

**Done:** Block A UI, auth API, leagues API, refactor aligned with auth patterns.

**Next (when backend ready):** `GET /api/favorite-clubs` — see `CURRENT_STATE.md`.

**Optional without backend:** tab shell, match status UI, prediction depth (Sprint 4).
