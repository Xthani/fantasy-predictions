# Project Roadmap

## Development approach

**Frontend-led delivery** — see `DEVELOPMENT_WORKFLOW.md`.

```text
UI block (demoable) → tech closure (lint, refactor) → backend brief (contracts prompt)
```

Classic Sprint 2–9 in this file remain the **full game MVP** map; **Block A** is a deliberate shortcut to first playable UX on mocks (Decision 013).

---

## Current Status

| Item | Status |
|------|--------|
| Sprint 0 — Setup & docs | **Done** |
| Sprint 1 — App shell | **In progress** |
| **Block A — Fast onboarding** | **Done** — UI + tech + [`BACKEND_BRIEF.md`](BACKEND_BRIEF.md) |
| Block B — TBD | **Next** (API integration or next UI slice) |

## Current Goal

**Block A closed.** Next: backend implements P0 from `BACKEND_BRIEF.md`, then frontend wires HTTP (Block B).

---

## Current Tech State

| Area | Status |
|------|--------|
| React 19 + Vite 8 + TS strict | ✅ |
| `react-router-dom` | ✅ |
| FSD-light (`app`, `pages`, `features`, `shared`) | ✅ |
| Design tokens in `app/styles/tokens.css` | ✅ |
| Mobile shell `AppShell` (max-width 480px) | ✅ |
| Shared UI | `Button`, `Screen`, `SearchField` |
| Mocks | `leagues`, `favoriteClubs`, `matches` |
| Local persistence | `fp_session`, `fp_preferences`, `fp_quick_predictions` |
| ESLint / Prettier | ✅ |
| Bottom tab navigation | ❌ later block |
| Real API client | ❌ after backend P0 |
| Backend brief | ✅ `BACKEND_BRIEF.md` |
| Game logic (energy, official, club league) | ❌ Sprint 4+ |

**Routes today:**

| Path | Screen |
|------|--------|
| `/login` | Google mock + reserved email/sign-up |
| `/onboarding/leagues` | Multi-select leagues + search |
| `/onboarding/clubs` | Multi-select clubs by league + search |
| `/matches` | Feed + league chips + quick Exact Score sheet |

---

## Block A vs classic sprints (mapping)

| Block A (done on mocks) | Overlaps roadmap |
|-------------------------|------------------|
| Login + shell + tokens | Sprint 1 |
| Leagues + clubs onboarding | Sprint 2 (simplified; no country) |
| Match feed + filters | Sprint 3 |
| Quick Exact Score only | Sprint 4 (partial) |

**Not in Block A:** energy, styles, components, official/shadow, profile rating, game club, virtual match, bots.

---

## MVP Roadmap (full product — unchanged direction)

### Sprint 0 — Setup & Documentation ✅

- [x] Template, docs, FSD-light, design tokens sketch, mock plan

### Sprint 1 — App Shell & UI Foundation

- [x] Routing, layout, theme tokens, base components (partial: no Card, no tabs)
- [x] Block A fast onboarding UI on mocks
- [x] Block A — fast onboarding UI + tech + backend brief

### Sprint 2 — Onboarding (classic)

- [x] League + favorite club pick *(covered by Block A variant)*
- [ ] Country, full profile
- [ ] Defer until after Block B or backend integration

### Sprint 3 — Match Feed

- [x] List, filters, cards *(Block A)*
- [ ] Status chips: open / locked / finished in UI

### Sprint 4 — Prediction Core

- [x] Exact Score input *(quick sheet only)*
- [ ] Prediction Components, Energy, Styles, points preview

### Sprint 5 — Official Picks

- [ ] Official vs Shadow, limits, deadlines

### Sprint 6 — Player Profile

- [ ] Official Rating, form, stats

### Sprint 7 — Clubs (game)

- [ ] Starter clubs, Bot Club, squad screen

### Sprint 8 — Virtual Match

- [ ] XI, Team Energy, results

### Sprint 9 — Divisions & Bots

- [ ] Table, Bot Player, Bot Club automation

---

## Later (post-MVP)

Economy, transfers, scout, monetization (cosmetics / no ads only), social, creator leagues — see `PROJECT_VISION.md`.

---

## Recommended order (next moves)

1. **Backend** — implement P0 from `BACKEND_BRIEF.md`.
2. **Block B (frontend)** — `shared/api/httpClient` + replace mocks for Block A flows.
3. **Block B or C (UI)** — tab shell and/or full prediction screen (energy, styles).
