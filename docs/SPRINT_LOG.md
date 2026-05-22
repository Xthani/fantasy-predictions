# Sprint Log

---

## Sprint 0 — Setup & Documentation

**Status:** Done (2026-05-22)

**Deliverables:** `/docs`, FSD-light, `ARCHITECTURE.md`, Decisions 001–012.

---

## Block A — Fast Onboarding (mock-first)

**Status:** **Done** (2026-05-22)

**Phases:** UI ✅ · Tech ✅ · Backend brief ✅

### Achievement

Demoable path: **Login → leagues → clubs → matches → Exact Score** on mocks + `localStorage`.

| Phase | Done |
|-------|------|
| UI/UX | 4 screens, search, multi-select, quick score sheet, toast, redirects |
| Tech | ESLint, Prettier, `npm run lint` / `format`, `shared/mocks/index.ts`, build green |
| Backend | `BACKEND_BRIEF.md` ready — P0 endpoints, acceptance criteria, copy-paste task |

### Handoff for backend

**Primary doc:** [`BACKEND_BRIEF.md`](BACKEND_BRIEF.md)

**Supporting:** [`API_CONTRACT.md`](API_CONTRACT.md) Block A table, [`MOCK_DATA.md`](MOCK_DATA.md), `src/shared/mocks/*`

**P0 endpoints:** `POST /api/auth/google`, `GET /api/leagues`, `GET /api/favorite-clubs`, `PUT /api/players/me/preferences`, `GET /api/matches/week`, `POST /api/predictions`, `GET /api/predictions/me`

### Demo path

```bash
npm run dev
```

Login → Google → leagues → clubs → matches → save score → toast + card badge.

Reset: clear `localStorage` keys `fp_session`, `fp_preferences`, `fp_quick_predictions`.

### Quality gates (passed)

- [x] `npm run build`
- [x] `npm run lint`
- [x] `npm run format:check` (after format)
- [x] README demo section
- [x] Toast on save

---

## Sprint 1 — App Shell & UI Foundation

**Status:** Block A complete; remainder open

**Done via Block A:** routing, tokens, shell, Button/Screen/SearchField/Toast, mocks (leagues, favoriteClubs, matches)

**Next (Block B or integration):**

- Wire `shared/api/httpClient` when backend P0 ready
- Bottom tab navigation
- `Card` component if needed
- Or Sprint 4 prediction depth (energy, styles)

---

## Sprint 2+

See `PROJECT_ROADMAP.md`. Classic country/profile and game depth after Block A API integration.
