# Sprint Log

---

## Sprint 0 — Setup & Documentation

**Status:** Done (2026-05-22)

**Deliverables:** `/docs`, FSD-light, `ARCHITECTURE.md`, Decisions 001–016.

---

## Block A — Fast Onboarding (mock-first)

**Status:** **Done** (2026-05-22)

**Phases:** UI ✅ · Tech ✅ · Backend brief ✅

### Achievement

Demoable path: **Login → leagues → clubs → matches → Exact Score**.

| Phase | Done |
|-------|------|
| UI/UX | 4 screens, search, multi-select, quick score sheet, toast, redirects |
| Tech | ESLint, Prettier, mocks, build green |
| Backend brief | `BACKEND_BRIEF.md` for future endpoints |

### Demo path

```bash
npm run dev
```

Login (Google) → leagues → clubs → matches → save score.

**Сброс:** см. `CURRENT_STATE.md` (ключи storage).

---

## Partial API integration (2026-05-22)

**Status:** **In progress** — auth + leagues on real backend

| Endpoint | Frontend |
|----------|----------|
| `POST /api/auth/google` (+ email auth) | ✅ `features/auth/api/auth.ts` |
| `GET /api/leagues` | ✅ `features/onboarding/api/leagues.ts` |
| `GET /api/favorite-clubs` | ⏳ mocks; empty UX on clubs step |
| `PUT /api/players/me/preferences` | ⏳ `fp_preferences` local |
| `GET /api/matches/week` | ⏳ mocks |
| predictions | ⏳ localStorage |

**Refactor:** shared `useAsyncRequest`, `getApiErrorMessage`, feature `*Errors.ts`, `LeagueCrest`, prefs `favoriteLeagues` (id+name for UI labels).

**Source of truth:** [`CURRENT_STATE.md`](CURRENT_STATE.md)

### Quality gates

- [x] `npm run build`
- [x] `npm run lint`

---

## Sprint 1 — App Shell & UI Foundation

**Status:** In progress (Block A UI done; partial API done)

**Next:** see `CURRENT_STATE.md` — favorite-clubs API first when backend ready.

---

## Sprint 2+

See `PROJECT_ROADMAP.md`.
