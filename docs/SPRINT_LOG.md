# Sprint Log

---

## Sprint 0 — Setup & Documentation

**Status:** Done (2026-05-22)

**Deliverables:** `/docs`, FSD-light, `ARCHITECTURE.md`, Decisions 001–016.

---

## Block A — Fast Onboarding UI

**Status:** **Done** (2026-05-22) — экраны и UX; моки **удалены** 2026-05-24.

---

## Partial API integration

**Status:** **Waiting for backend** (2026-05-24)

| Endpoint | Frontend |
|----------|----------|
| `POST /api/auth/google` (+ email auth) | ✅ |
| `GET /api/auth/me` | ✅ |
| `GET /api/leagues` | ✅ |
| `GET /api/profiles/me` | ✅ |
| `PATCH /api/profiles/me` | ✅ — leagues + clubs |
| `GET /api/teams?leagueIds=` | ✅ — clubs step |
| `GET /api/matches` | ⏳ waiting — matches step stub |
| predictions | ⏳ waiting |

### Frontend cleanup (2026-05-24)

- Removed `shared/mocks/` entirely
- Removed localStorage (`fp_preferences`, `fp_quick_predictions`, token keys)
- Auth tokens → cookies (`authCookies.ts`)
- Onboarding state → `OnboardingProvider` (in-memory only)
- Clubs/matches pages → «ждём бэкенд» stubs

**Source of truth:** [`CURRENT_STATE.md`](CURRENT_STATE.md)

### Quality gates

- [x] `npm run build`
- [x] `npm run lint`

---

## Sprint 1 — App Shell & UI Foundation

**Status:** In progress — auth + leagues live; **blocked on backend** for clubs, matches, profile.

**Next:** wire endpoints as backend ships them; see `CURRENT_STATE.md`.

---

## Sprint 2+

See `PROJECT_ROADMAP.md`.
