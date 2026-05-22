# Project Roadmap

## Current Status

**Sprint 0 — Project Setup / Documentation / Frontend foundation** (Done)

**Sprint 1 — App Shell & UI Foundation** (Next)

## Current Goal

Prepare mobile-first frontend foundation for MVP. No game logic in app yet.

---

## Current Tech State (bare template)

| Area | Present | Missing |
|------|---------|---------|
| React 19 + react-dom | ✅ | — |
| Vite 8 + SWC plugin | ✅ | — |
| TypeScript strict + `@/` alias | ✅ | — |
| `tsconfig.node.json` for Vite config | ✅ | — |
| Scripts: `dev`, `build`, `preview` | ✅ | — |
| Package manager | npm | — |
| `src/` structure | `main.tsx`, `App.tsx`, `vite-env.d.ts` only | FSD-light: `app`, `pages`, `features`, `shared` (see `ARCHITECTURE.md`) |
| Routing | — | react-router or equivalent |
| Layout / mobile shell | — | app layout, bottom nav |
| Theme / CSS tokens | inline styles only | dark premium design system |
| Mock data | plan in `MOCK_DATA.md` | implementation in `src/shared/mocks/` |
| Design tokens | sketch in `DESIGN_TOKENS.md` | CSS in `src/app/styles/` |
| ESLint / Prettier | — | recommended in Sprint 1 |
| Backend / API client | — | mock first per `API_CONTRACT.md` |

**Folder structure today:**

```text
fantasy-predictions/
├── docs/
├── .cursor/rules/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    └── vite-env.d.ts
```

---

## MVP Roadmap

### Sprint 0 — Setup & Documentation

- [x] Bare React/Vite/TS template
- [x] `/docs` + `project-memory.mdc`
- [x] English product docs aligned with game design
- [x] Confirm dependencies & document tech state (`DECISION_LOG.md` Decision 011)
- [x] Base UI direction (`DESIGN_TOKENS.md`, `UX_NOTES.md`)
- [x] Mock data plan (`MOCK_DATA.md`)
- [x] FSD-light architecture policy (`ARCHITECTURE.md`, Cursor rules `00-core`, `10-architecture`)

### Sprint 1 — App Shell & UI Foundation

- [ ] Routing
- [ ] App layout (mobile-first)
- [ ] Theme tokens (dark premium sports)
- [ ] Basic components (Button, Card, Screen, etc.)
- [ ] ESLint / Prettier (if approved)

### Sprint 2 — Onboarding

- [ ] Profile creation
- [ ] Country selection
- [ ] Active league selection
- [ ] Optional favorite club / tournaments

### Sprint 3 — Match Feed

- [ ] Weekly match list
- [ ] Filters
- [ ] Match cards
- [ ] Match status (open / locked / finished)

### Sprint 4 — Prediction Core

- [ ] Exact Score input
- [ ] Prediction Components display
- [ ] Energy + Defensive / Balanced / Aggressive / Manual Style
- [ ] Points preview

### Sprint 5 — Official Picks

- [ ] Select Official Predictions (limit)
- [ ] Numbering / ordering
- [ ] Shadow vs Official UI
- [ ] Deadline lock (4h rule)

### Sprint 6 — Player Profile

- [ ] Official Rating 0–110
- [ ] Form
- [ ] Official stats vs Shadow Stats

### Sprint 7 — Clubs

- [ ] Starter clubs list
- [ ] Bot Club
- [ ] Club screen + squad

### Sprint 8 — Virtual Match

- [ ] Starting XI
- [ ] Team style + Team Energy
- [ ] Match result + contribution breakdown

### Sprint 9 — Divisions & Bots

- [ ] Divisions + league table
- [ ] Bot Player logic
- [ ] Bot Club automation

---

## Later (post-MVP)

- Economy (virtual currency loops)
- **Transfer Offer**, **Contract**
- **Scout**, **Negotiator**
- Monetization (ads / subscription / cosmetics)
- Social sharing
- Creator / community leagues

---

## Recommended Next Technical Steps (Sprint 0 → 1)

1. Add routing (e.g. React Router — document in `DECISION_LOG.md`)
2. App layout + mobile viewport shell
3. CSS variables / theme tokens (dark premium)
4. `src/` FSD-light folders (`app`, `pages`, `features`, `shared` — see `ARCHITECTURE.md`)
5. Mock data module for matches / players / clubs
6. ESLint + Prettier
7. Replace placeholder `App.tsx` with shell + empty routes
