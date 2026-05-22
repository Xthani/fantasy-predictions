# Sprint Log

---

## Sprint 0 — Setup & Documentation

**Status:** Done (2026-05-22)

**Goal:** Prepare project memory, English documentation, and frontend foundation.

### Done

- Bare **React 19 + Vite 8 + TypeScript 6** template
- Strict TS, `@/` path alias, `tsconfig.node.json`, `@types/node`
- Production build: `tsc` + `vite build`
- `/docs` structure created
- `.cursor/rules/project-memory.mdc` with maintenance rules
- Full docs refactor: English, Exact Score mechanics, roadmap sprints 0–9
- Product decisions 001–011 in `DECISION_LOG.md`
- Tech state confirmed: npm, pinned versions, no extra runtime deps (Decision 011)
- UI direction: `DESIGN_TOKENS.md` (dark premium tokens + wire sketches)
- Mock data plan: `MOCK_DATA.md` (entities, volumes, `src/shared/mocks/` layout)
- `API_CONTRACT.md` linked to mock plan

### Deliverables

| Artifact | Path |
|----------|------|
| Design tokens sketch | `docs/DESIGN_TOKENS.md` |
| Mock data plan | `docs/MOCK_DATA.md` |
| Dependency baseline | `docs/DECISION_LOG.md` → Decision 011 |

### Tech snapshot (Sprint 0 close)

| Item | Value |
|------|--------|
| Package manager | npm |
| Node (verified) | v24.14.1 |
| Runtime deps | react 19.2.6, react-dom 19.2.6 |
| Dev | vite 8.0.14, typescript 6.0.3, @vitejs/plugin-react-swc 4.3.1 |
| Missing (Sprint 1+) | router, CSS tokens in code, mocks module, lint, feature folders |

---

## Sprint 1 — App Shell & UI Foundation

**Status:** Not started

**Goal:** Mobile-first app shell, routing, theme in code, base components, mock modules.

### Next

1. Routing (document choice in `DECISION_LOG.md` when added)
2. App layout + mobile viewport shell (`--layout-max-width` from `DESIGN_TOKENS.md`)
3. `src/app/styles/tokens.css` from design tokens
4. Feature folders + `src/shared/mocks/` per `MOCK_DATA.md`
5. Basic components: Button, Card, Screen
6. ESLint / Prettier (if approved)
7. Replace placeholder `App.tsx` with shell + empty routes
