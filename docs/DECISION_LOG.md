# Decision Log

Format: **Decision NNN** — title, Context, Decision, Status.

Superseded integration churn (mocks, old backends): [`archive/DECISION_LOG_ARCHIVE.md`](archive/DECISION_LOG_ARCHIVE.md).

---

## Product & stack (001–016)

| ID | Summary |
|----|---------|
| 001 | Not a betting app — no real money |
| 002 | Exact Score is primary input |
| 003 | Energy system for depth |
| 004 | Official vs Shadow predictions |
| 005 | Bot clubs/players for MVP |
| 006 | No transfer chat in MVP |
| 007 | Prefer latest stable libs |
| 008 | Docs in `/docs` + Cursor rules |
| 009 | React 19 + Vite 8, no meta-framework |
| 010 | Docs language: English |
| 011 | Sprint 0 deps locked (npm, strict TS) |
| 012 | FSD-light structure |
| 013 | Fast onboarding: login → leagues → clubs → matches |
| 014 | `react-router-dom` for routes |
| 015 | Frontend-led blocks: UI → tech → API |
| 016 | ESLint + Prettier |

---

## Decision 020 — Pre–Phase 1 integration hygiene

- **Context:** Before wiring `fantasy-predictions-back`.
- **Decision:** `.env.example`, `API_CONTRACT.md`, profile hydration on onboarding back-navigation.
- **Status:** Accepted (2026-05-27)

---

## Decision 021 — Phase 1 backend contract

- **Context:** Auth + onboarding + matches on new backend.
- **Decision:** `register/login`, `profiles/me`, `leagues`, `clubs`, `matches`, `predictions`. Implementation in **`fantasy-predictions-back`**; frontend follows `docs/INTEGRATION.md` + `API_CONTRACT.md`.
- **Status:** Implemented (2026-05-27)

---

## Decision 022 — Frontend repo cleanup

- **Context:** Phase 1 works; repo had duplicate backend docs and dead code.
- **Decision:** No `BACKEND_*` / `MOCK_*` docs on frontend; no `shared/mocks/`; integration pointer only in `docs/INTEGRATION.md`; full guide stays in backend repo.
- **Status:** Accepted (2026-05-27)
