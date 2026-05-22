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
