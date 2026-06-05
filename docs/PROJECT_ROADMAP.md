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
| Sprint 1 — App shell | **Done** |
| Sprint 4 — Prediction core | **Done** (backend + frontend) |
| Friend duels (social compare) | **Done** |
| Sprint 5 — Official Rating + Shadow Stats | **Done** |
| **Next** | **Sprint 6** — game club / virtual match — см. `CURRENT_STATE.md` |

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
| Prediction core (energy, components, styles) | ✅ |
| Friend duels UI | ✅ |
| ESLint / Prettier | ✅ |
| Vercel SPA deploy | ✅ |
| Bottom tab navigation | ❌ later |
| Official Rating + Shadow Stats | ✅ |
| Game club / virtual match | ❌ Sprint 6+ |

**Routes:**

| Path | Screen | Data |
|------|--------|------|
| `/login` | Login / Register | API |
| `/onboarding/leagues` | Leagues | API |
| `/onboarding/clubs` | Clubs | API |
| `/matches` | Match feed + prediction sheet | API |
| `/profile` | Profile + prediction history | API |
| `/friends` | Friends + requests | API |
| `/users/:userId` | Public profile + friend duels | API |

---

## Block A vs full MVP

| Block A (done) | Full roadmap |
|----------------|--------------|
| Login + onboarding + match feed | Sprint 1–3 ✅ |
| Quick Exact Score only | Sprint 4 ✅ (components, energy, styles) |
| Local-first onboarding | ✅ |
| Friends + duels | ✅ (Phase 1 social) |
| — | Sprint 5–9: rating, game club, virtual match, bots |

---

## MVP Roadmap (full product)

### Sprint 0 — Setup & Documentation ✅

### Sprint 1 — App Shell ✅

- [x] Routing, layout, tokens, base UI
- [x] Auth + onboarding + matches on API

### Sprint 2 — Onboarding (classic)

- [x] League + club pick *(Block A)*
- [ ] Country, extended profile

### Sprint 3 — Match Feed

- [x] List, cards, quick score *(Block A)*
- [x] Offset pagination + profile CTA after first prediction
- [ ] League filter chips, status UX (open/locked/finished)

### Sprint 4 — Prediction Core ✅

- [x] Exact Score input (quick sheet)
- [x] Prediction Components preview (`POST /api/predictions/preview`)
- [x] Energy + Styles (defensive / balanced / aggressive)
- [x] Official toggle on save; grading `totalPoints` on profile
- [ ] Manual style UI (sliders)
- [ ] Dedicated Official Picks screen

### Social — Friend duels ✅

- [x] `GET /api/friends/:id/duels`
- [x] «Сравнение прогнозов» на `/users/:userId`

### Sprint 5 — Official Rating ✅

- [x] `GET /api/stats/me` — rating, form, official/shadow buckets
- [x] Profile UI: rating KPI, stats cards, prediction filter
- [x] Public profile: `officialRating`, `form`
- [ ] Dedicated Official Picks screen

### Sprint 6–9
- [ ] Game clubs, virtual match, divisions, bots

---

## Later (post-MVP)

Economy, monetization (cosmetics only) — `PROJECT_VISION.md`, `BACKLOG.md`.
