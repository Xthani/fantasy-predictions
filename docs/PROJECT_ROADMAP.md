# Project Roadmap

**Текущая правда:** [`CURRENT_STATE.md`](CURRENT_STATE.md)

---

## Development approach

**Frontend-led delivery** — см. [`DEVELOPMENT_WORKFLOW.md`](DEVELOPMENT_WORKFLOW.md).

```text
UI block → tech closure → API wiring → docs sync
```

**Block A** (fast onboarding + quick score) — **Done** на live API Phase 1.

---

## Current Status

| Item | Status |
|------|--------|
| Sprint 0 — Setup & docs | **Done** |
| Block A — Fast onboarding + matches | **Done** (live API) |
| Phase 1 API (`fantasy-predictions-back`) | **Done** |
| Sprint 1 — App shell | **Done** (базовый shell) |
| **Next phase** | **TBD** — см. `CURRENT_STATE.md` |

---

## Current Tech State

| Area | Status |
|------|--------|
| React 19 + Vite 8 + TS strict | ✅ |
| `react-router-dom` | ✅ |
| FSD-light | ✅ |
| Design tokens | ✅ `app/styles/tokens.css` |
| `shared/api/httpClient.ts` | ✅ |
| Phase 1 API wired | ✅ |
| ESLint / Prettier | ✅ |
| Bottom tab navigation | ❌ later |
| Game logic (energy, official, club league) | ❌ Sprint 4+ |

**Routes:**

| Path | Screen | Data |
|------|--------|------|
| `/login` | Login / Register | API |
| `/onboarding/leagues` | Leagues | API |
| `/onboarding/clubs` | Clubs | API |
| `/matches` | Match feed + quick score | API |

---

## Block A vs full MVP

| Block A (done) | Full roadmap |
|----------------|--------------|
| Login + onboarding + match feed | Sprint 1–3 |
| Quick Exact Score only | Sprint 4+ (energy, components, official) |
| — | Sprint 5–9: profile rating, game club, virtual match, bots |

---

## MVP Roadmap (full product)

### Sprint 0 — Setup & Documentation ✅

### Sprint 1 — App Shell ✅ (Phase 1 scope)

- [x] Routing, layout, tokens, base UI
- [x] Auth + onboarding + matches on API

### Sprint 2 — Onboarding (classic)

- [x] League + club pick *(Block A)*
- [ ] Country, extended profile

### Sprint 3 — Match Feed

- [x] List, cards, quick score *(Block A)*
- [ ] League filter chips, status UX (open/locked/finished)

### Sprint 4 — Prediction Core

- [x] Exact Score input *(quick sheet)*
- [ ] Prediction Components, Energy, Styles

### Sprint 5–9

Official picks, profile rating, game clubs, virtual match, divisions — см. `PROJECT_VISION.md`, `GAME_RULES.md`.

---

## Later (post-MVP)

Economy, monetization (cosmetics only), social — `PROJECT_VISION.md`, `BACKLOG.md`.
