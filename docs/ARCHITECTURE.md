# Frontend Architecture (FSD-light)

## Overview

FSD-light: `app`, `pages`, `features`, `shared`. Правила агента: `.cursor/rules/00-core.mdc`, `10-architecture.mdc`.

---

## Project profile

| Item | Decision |
|------|----------|
| App type | Mobile-first SPA (Vite) |
| Global state | React state + Context (`AuthProvider`, `OnboardingProvider`) |
| UI language | Russian |
| Styles | CSS variables `app/styles/tokens.css`; SCSS Modules, camelCase |
| HTTP | `shared/api/httpClient.ts`; domain calls in `features/*/api/` |
| Data | `pages` → `features` → `shared` |

---

## `src/` layout

```text
src/
  app/           # App.tsx, layout, global styles
  pages/         # route screens + page hooks (model/)
  features/      # auth, onboarding, match-feed, quick-prediction, profile
  shared/        # ui, hooks, api, types, lib
```

---

## Import direction

```text
shared ← everywhere
app    ← main.tsx, App.tsx; pages may use app providers
features ← pages (+ cross-feature via index.ts when needed)
pages  ← leaf nodes
```

**Banned:** domain API in `shared/`; `pages` importing `features/<x>/api` directly.

---

## Data sources (Phase 1)

| Данные | Источник |
|--------|----------|
| Auth, profile, leagues, clubs, matches, predictions | `fantasy-predictions-back` API |
| Выбор лиг/клубов в сессии | `OnboardingProvider` (in-memory) + PATCH профиля |
| Эмодзи гербов лиг | локальный fallback `leagueCrestFallback.ts` (API не отдаёт `crestEmoji`) |

---

## Async UI

Каждый async-блок: **loading / error / empty / success**. Хук `shared/hooks/useAsyncRequest.ts` — `mapError` не создавать inline (стабильная ссылка).

---

## Exception registry

_None._
