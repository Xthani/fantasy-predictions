# Frontend Architecture (FSD-light)

## Overview

The frontend uses **FSD-light** (Feature-Sliced Design, pragmatic variant): four layers under `src/` — `app`, `pages`, `features`, `shared`. Architecture is a tool, not a goal; prefer simple working code over perfect folder trees.

**Canonical rules for agents and contributors:**

| Document | Role |
|----------|------|
| [`.cursor/rules/00-core.mdc`](../.cursor/rules/00-core.mdc) | Always-on invariants: import direction, bans, agent behavior, async UI, size soft-limits |
| [`.cursor/rules/10-architecture.mdc`](../.cursor/rules/10-architecture.mdc) | Full guide: layer duties, barrels, hooks, styles, tests, DB, enforcement (loaded on `src/` structure work) |

This file records **project-specific** choices and the **exception registry**. Update it when introducing a deliberate deviation from the rules above.

---

## Project profile

| Item | Decision |
|------|----------|
| App type | Mobile-first **web SPA** (Vite), not a meta-framework |
| Global state | Local React state + Context only for now — no `app/store/` until needed |
| Lazy loading | TBD in Sprint 1 — default: `React.lazy` + `Suspense` for route pages unless bundle stays tiny |
| i18n | **Single-language** for MVP — short UI strings in JSX allowed; no i18n library at start |
| UI language | Russian for user-facing copy (consistent across UI; no mixed EN toasts) |
| Styles (Sprint 1+) | CSS variables in `app/styles/tokens.css` per `DESIGN_TOKENS.md`; SCSS Modules with **camelCase** class names when introduced |
| HTTP / API | Transport only in `shared/api/`; domain calls in `features/<name>/api/`; mocks in `shared/mocks/` per `MOCK_DATA.md` |
| Data flow | `pages` → `features` (via `index.ts` barrel when required) → `shared` |

---

## Target `src/` layout (Sprint 1+)

Folders are created **only when needed** — see `00-core.mdc`.

```text
src/
  app/           # providers, layout, styles (tokens.css), App.tsx, main.tsx
  pages/         # route pages (thin orchestration)
  features/      # business slices (api / model / ui / index.ts)
  shared/        # ui, hooks, utils, api (transport), mocks, types
```

Current template (pre–Sprint 1): flat `main.tsx`, `App.tsx` at `src/` root — migrate into `app/` when implementing the shell.

---

## Import direction (summary)

```text
shared   ← importable everywhere
app      ← entry + global providers; pages may use app context hooks only
features ← pages + other features (cross-feature only via index.ts)
pages    ← leaf nodes; never imported by other layers
```

**Banned:** business logic or domain API methods in `shared/`; `pages` importing `features/<x>/api` or `features/<x>/model` directly; `__test-utils__` in production.

---

## Mocks (MVP)

Per `MOCK_DATA.md`:

- Static mock data lives in `shared/mocks/`.
- Sprint 1: feature `api/` modules or page orchestration may read mocks; replace with `shared/api` + real endpoints later without moving domain types out of features.

---

## Async UI

Every async screen/block: **loading / error / empty / success**. No silent `catch {}`, no `null` for loading.

---

## Exception registry

_None yet._ When adding an exception, use this format:

```md
## [exception-id] Short title
- Where: path
- Rule violated: section in 10-architecture.mdc
- Reason: why this is better here
- Mitigation: how to avoid spread
- Owner: name, date
```

---

## Related docs

- `DESIGN_TOKENS.md` — visual tokens → `app/styles/tokens.css`
- `MOCK_DATA.md` — mock entities and `shared/mocks/` layout
- `API_CONTRACT.md` — endpoint shapes when leaving mocks
- `DECISION_LOG.md` — Decision 012 (FSD-light adoption)
