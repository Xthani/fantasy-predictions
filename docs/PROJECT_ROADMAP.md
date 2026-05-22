# Project Roadmap

## Development approach

**Frontend-led delivery** — see `DEVELOPMENT_WORKFLOW.md`.

```text
UI block (demoable) → tech closure (lint, refactor) → backend brief (contracts prompt)
```

Classic Sprint 2–9 in this file remain the **full game MVP** map; **Block A** is a deliberate shortcut to first playable UX (Decision 013).

**Текущая правда по фронту:** [`CURRENT_STATE.md`](CURRENT_STATE.md) — что на API, что на моках, что делать дальше.

---

## Current Status

| Item | Status |
|------|--------|
| Sprint 0 — Setup & docs | **Done** |
| Sprint 1 — App shell | **In progress** |
| **Block A — Fast onboarding** | **Done** — UI + tech + backend brief |
| **Partial API wiring** | **In progress** — auth + leagues live; clubs/matches — mocks |

## Current Goal

Подключать фронт **по мере готовности бэка**, по одной ручке. Сейчас живые: Google auth + leagues. Детали и очередь: **`CURRENT_STATE.md`**.

---

## Current Tech State

| Area | Status |
|------|--------|
| React 19 + Vite 8 + TS strict | ✅ |
| `react-router-dom` | ✅ |
| FSD-light (`app`, `pages`, `features`, `shared`) | ✅ |
| Design tokens in `app/styles/tokens.css` | ✅ |
| Mobile shell `AppShell` (max-width 480px) | ✅ |
| Shared UI | `Button`, `Screen`, `SearchField`, `Toast` |
| HTTP client | ✅ `shared/api/httpClient.ts` |
| **API wired** | ✅ auth (Google + email), ✅ `GET /api/leagues` |
| **Still mocks** | clubs, matches, quick predictions |
| Local persistence | auth keys + `fp_preferences`, `fp_quick_predictions` |
| ESLint / Prettier | ✅ |
| Bottom tab navigation | ❌ later |
| Backend brief (future endpoints) | ✅ `BACKEND_BRIEF.md` |
| Game logic (energy, official, club league) | ❌ Sprint 4+ |

**Routes today:**

| Path | Screen | Data source |
|------|--------|-------------|
| `/login` | Google + email sign-in/sign-up | API |
| `/onboarding/leagues` | Multi-select leagues + search | API |
| `/onboarding/clubs` | Multi-select clubs | Mocks (empty until favorite-clubs API) |
| `/matches` | Feed + filters + quick Exact Score | Mocks + localStorage |

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
- [x] Block A fast onboarding UI
- [x] Block A — tech + backend brief
- [x] Partial API: auth + leagues
- [ ] Wire remaining Block A endpoints when backend ready (see `CURRENT_STATE.md`)

### Sprint 2 — Onboarding (classic)

- [x] League + favorite club pick *(Block A variant)*
- [ ] Country, full profile
- [ ] Defer until after more API slices or backend

### Sprint 3 — Match Feed

- [x] List, filters, cards *(Block A mocks)*
- [ ] Status chips: open / locked / finished in UI
- [ ] `GET /api/matches/week` when backend ready

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

См. приоритетную таблицу в **`CURRENT_STATE.md`**.

1. **Backend next:** `GET /api/favorite-clubs` (unblocks clubs step with API league ids).
2. **Frontend:** wire clubs API по образцу `features/onboarding/api/leagues.ts`.
3. Затем preferences PUT, matches week, predictions — по готовности бэка.
4. **Без бэка (опционально):** tab shell, match status chips, full prediction screen.
