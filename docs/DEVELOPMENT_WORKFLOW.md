# Development Workflow

**Frontend leads the project.** The app is built in visible UI blocks first; infrastructure and backend follow from what the UI proved.

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

| Block | Product slice | Backend contracts (draft in `API_CONTRACT.md`) |
|-------|---------------|-----------------------------------------------|
| **A** | Fast onboarding: login → leagues → clubs → matches → quick Exact Score | Auth, leagues, clubs, preferences, matches week, quick prediction |
| **B** | TBD (e.g. full prediction screen, tab shell, profile) | TBD |
| **C+** | Game loop from `PROJECT_ROADMAP` Sprint 4–9 | TBD |

---

## Frontend-led rules

- New dependencies only when a **visible** screen or shared UI needs them.
- Mocks in `shared/mocks/` mirror future API shapes; pages do not call real HTTP until Block A backend integration.
- After each UI block: update `SPRINT_LOG.md`, `PROJECT_ROADMAP.md`, and contract sections in `API_CONTRACT.md`.
- Russian UI copy in components; English in `/docs`.

---

## Current focus

**Block A:** **Done** (2026-05-22) — see `SPRINT_LOG.md`.

**Backend handoff:** [`BACKEND_BRIEF.md`](BACKEND_BRIEF.md) — ready to send.

**Next:** Backend P0 implementation → frontend Block B (HTTP integration).
