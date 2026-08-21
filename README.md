# Fantasy Predictions

Mobile-first football prediction experience built with React and TypeScript. The application covers the complete player journey: authentication, preference onboarding, match discovery, score predictions, personal statistics, friends, and head-to-head comparison.

This repository contains the frontend. It integrates with a separate REST API and is structured as a production-oriented product rather than a UI prototype.

## Product capabilities

- registration, login, and protected routes;
- league and club preference onboarding;
- paginated match feed and quick score predictions;
- official and shadow prediction statistics;
- prediction history and component-level scoring;
- user search, friend requests, and friend management;
- public player profiles and prediction duels;
- responsive mobile-first interface;
- SPA deployment configuration for Vercel.

## Tech stack

| Area | Technology |
| --- | --- |
| UI | React 19, CSS Modules |
| Language | TypeScript 6 in strict mode |
| Build | Vite 8, SWC |
| Routing | React Router 7 |
| Architecture | Feature-oriented, FSD-inspired modules |
| Quality | ESLint, Prettier, TypeScript build checks |

## Architecture

```text
src/
  app/       application shell, routing, and global styles
  pages/     route-level screens
  features/  auth, onboarding, predictions, profiles, and friends
  shared/    API client, reusable UI, hooks, types, and utilities
```

The frontend communicates through a shared HTTP client and keeps API-specific logic inside feature modules. Authentication uses a bearer token, while onboarding is local-first and synchronizes profile updates with the backend.

See [Architecture](./docs/ARCHITECTURE.md) and [API integration](./docs/INTEGRATION.md) for the detailed design.

## Local development

Requirements:

- Node.js 20+
- npm 10+
- a compatible backend available at `http://localhost:8000`

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Quality checks

```bash
npm run lint
npm run format:check
npm run build
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/login` | Registration and authentication |
| `/onboarding/leagues` | League preferences |
| `/onboarding/clubs` | Club preferences |
| `/matches` | Match feed and score predictions |
| `/profile` | Rating, statistics, and prediction history |
| `/friends` | Search, requests, and friend management |
| `/users/:userId` | Public profile and head-to-head comparison |

## Documentation

- [Current product state](./docs/CURRENT_STATE.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [API contract](./docs/API_CONTRACT.md)
- [Game and scoring rules](./docs/GAME_RULES.md)
- [Product roadmap](./docs/PROJECT_ROADMAP.md)
- [Decision log](./docs/DECISION_LOG.md)
- [Documentation index](./docs/README.md)

## Deployment

The repository includes a Vercel SPA rewrite. Configure `VITE_API_BASE_URL` with the deployed backend URL and use `npm run build` with `dist/` as the output directory.
