# Decision Log

Format: **Decision NNN** — title, Context, Decision, Reason, Status.

---

## Decision 001 — Product is not a betting app

- **Context:** Risk of scope creep into gambling UX.
- **Decision:** No real-money wagering, withdrawals, deposits, or bookmaker patterns.
- **Reason:** Legal, brand, and player trust; product is football RPG + prediction league.
- **Status:** Accepted

---

## Decision 002 — Exact Score is the main prediction input

- **Context:** Need one clear primary action for mobile UX.
- **Decision:** Player enters **Exact Score**; system derives **Prediction Components**.
- **Reason:** Simple entry, deep strategy via Energy and multipliers.
- **Status:** Accepted

---

## Decision 003 — Energy system creates strategic depth

- **Context:** Avoid flat 1X2-only gameplay.
- **Decision:** 100 **Energy** per match, split by **Style** across components; `points = energy × multiplier` if correct.
- **Reason:** Skill expression without manual pick of every market.
- **Status:** Accepted

---

## Decision 004 — Official and Shadow predictions are separated

- **Context:** Players want practice picks without rating risk.
- **Decision:** Only **Official Predictions** affect **Official Rating** and club; others → **Shadow Stats**.
- **Reason:** Flexibility + competitive fairness.
- **Status:** Accepted

---

## Decision 005 — Bot Clubs and Bot Players are required for MVP

- **Context:** Cold start — empty leagues kill retention.
- **Decision:** **Bot Club** / **Bot Player** fill slots, auto lineups, auto predictions.
- **Reason:** League always playable at launch.
- **Status:** Accepted

---

## Decision 006 — No internal chat for transfers

- **Context:** Transfer UX could balloon scope.
- **Decision:** No player-to-player chat for **Transfer Offer** in MVP or near-term.
- **Reason:** Moderation cost; use structured offers later.
- **Status:** Accepted

---

## Decision 007 — Latest stable libraries should be preferred

- **Context:** Bare template; dependencies added incrementally.
- **Decision:** Prefer latest stable versions; avoid legacy packages; log major choices here.
- **Reason:** Security, maintainability, team velocity.
- **Status:** Accepted

---

## Decision 008 — Documentation is maintained in `/docs` as project memory

- **Context:** Cursor and team need persistent product memory.
- **Decision:** English docs in `/docs` + `.cursor/rules/project-memory.mdc` with update rules.
- **Reason:** Prevent drift; lower token cost; single terminology.
- **Status:** Accepted

---

## Decision 009 — Frontend stack: React 19 + Vite 8 (no meta-framework)

- **Context:** Greenfield mobile-first SPA.
- **Decision:** React 19, Vite 8, `@vitejs/plugin-react-swc`, TypeScript strict, `@/` alias; no Next.js at start.
- **Reason:** Full control, fast HMR, minimal bundle.
- **Status:** Accepted

---

## Decision 010 — Documentation language: English

- **Context:** Team, code, and Cursor efficiency.
- **Decision:** All `/docs` in English; unified terms in `GLOSSARY.md`.
- **Reason:** Lower token usage; consistent technical language.
- **Status:** Accepted

---

## Decision 011 — Sprint 0 dependency baseline confirmed

- **Context:** Close Sprint 0; lock what the bare template actually ships with.
- **Decision:** **npm** only; runtime: `react@19.2.6`, `react-dom@19.2.6`; dev: `vite@8.0.14`, `typescript@6.0.3`, `@vitejs/plugin-react-swc@4.3.1`, `@types/*`. No router, CSS system, lint, or mocks until Sprint 1. Node **20+** recommended (verified on 24.x).
- **Reason:** Minimal surface; add dependencies incrementally per roadmap.
- **Status:** Accepted (2026-05-22)

---

## Decision 012 — Frontend structure: FSD-light

- **Context:** Sprint 1 needs a clear folder and import policy before app shell and features land.
- **Decision:** Adopt **FSD-light** with layers `app`, `pages`, `features`, `shared`. Full rules in `.cursor/rules/00-core.mdc` (always) and `10-architecture.mdc` (structure tasks). Project summary and exceptions in `docs/ARCHITECTURE.md`.
- **Reason:** Scalable MVP without a meta-framework; pragmatic rules (YAGNI, no empty folders, barrels when needed); aligns with planned `shared/mocks/` and `app/styles/tokens.css`.
- **Status:** Accepted (2026-05-22)

---

## Decision 013 — Fast onboarding flow (mock UI first)

- **Context:** No backend yet; need playable path to first Exact Score; visual reference is premium dark + gold, not bookmaker UX.
- **Decision:** Onboarding order: **Login (Google mock + reserved email/sign-up UI) → multi league pick → multi club pick (filtered by leagues) → match feed with quick score**. Defer country, game club join, energy/official mechanics on this path.
- **Reason:** Fast time-to-fun; backend contracts drafted in `API_CONTRACT.md` from real screens.
- **Status:** Accepted (2026-05-22)

---

## Decision 014 — React Router for Sprint 1 shell

- **Context:** Multi-step onboarding and future tabs need client routing.
- **Decision:** Add `react-router-dom` (latest stable); routes under `pages/`, guards via mock session in `features/auth`.
- **Reason:** Minimal dependency; no meta-framework; matches FSD-light `pages/` layer.
- **Status:** Accepted (2026-05-22)

---

## Decision 015 — Frontend-led delivery in three phases per block

- **Context:** Need clear rhythm: demoable UI first, then tooling, then backend contracts — without mixing lint/refactor into active UI work.
- **Decision:** Each **block** (starting with **Block A — fast onboarding**) ships as: **(1) UI/UX on mocks** → **(2) tech closure** (ESLint, Prettier, refactors) → **(3) backend brief** (`BACKEND_BRIEF.md` from proven screens). Frontend sets pace; full Sprint 2–9 map remains for later game depth.
- **Reason:** Touchable slices for stakeholders and backend; contracts match real flows; less throwaway infra work.
- **Status:** Accepted (2026-05-22)

---

## Decision 016 — Block A-tech: ESLint + Prettier

- **Context:** Close Block A with maintainable tooling before backend handoff.
- **Decision:** ESLint 9 flat config (`eslint.config.js`), TypeScript-eslint, react-hooks, react-refresh; Prettier with eslint-config-prettier; scripts `lint`, `format`, `format:check`.
- **Reason:** Enforce quality without blocking UI iteration earlier.
- **Status:** Accepted (2026-05-22)

---

## Decision 017 — Incremental API wiring + CURRENT_STATE doc

- **Context:** Backend ships endpoints gradually (auth Google, then leagues); full `BACKEND_BRIEF` must not be read as «frontend backlog».
- **Decision:** Wire each endpoint in `features/*/api/` when backend is ready; keep mocks for other screens. Maintain **`docs/CURRENT_STATE.md`** as the single «what works / what next» file. Save `favoriteLeagues` (id+name) in `fp_preferences` for labels on mock-only steps.
- **Reason:** Clear handoff for daily planning; honest UX when clubs/matches still mock (API league ids ≠ mock club ids).
- **Status:** Accepted (2026-05-22)

---

## Decision 018 — Remove mocks and localStorage; cookies for auth only

- **Context:** Mixed mock/API ids and localStorage made testing confusing. Backend not ready for clubs/matches/profile.
- **Decision:** Delete `shared/mocks/` and all localStorage. Auth tokens in cookies (`authCookies.ts`). Onboarding in `OnboardingProvider` (in-memory). Clubs/matches = «waiting for backend» stubs.
- **Reason:** Only auth + leagues are live; no fake data polluting real API flow.
- **Status:** Accepted (2026-05-24)
