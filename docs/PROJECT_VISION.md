# Project Vision

## Product Summary

**Fantasy Predictions** is a mobile-first web football prediction game and fantasy football manager.

Players predict **Exact Score** on real football matches. The system derives **Prediction Components**, players allocate **Energy** using a **Style**, earn points after real results, grow **Official Rating**, contribute to a **Club**, and compete in a **Virtual Match** league with **Bot Clubs** and **Bot Players** at launch.

This is a football RPG / manager experience — not a sportsbook.

## What This Product Is Not

- Not a betting app
- Not a casino or gambling product
- No real-money wagering
- No deposits or withdrawals
- No pay-to-win monetization
- No bookmaker odds UI or “place bet” flows

## Core Game Loop

```text
Real football match
  → Exact Score prediction
  → Prediction Components (auto-derived)
  → Energy distribution (Style)
  → Points after real result
  → Official Rating / Shadow Stats
  → Club contribution
  → Virtual Match in Division
```

## MVP Player Flow

1. Create profile
2. Select country
3. Select active league
4. Optional favorite club / tournaments
5. Make first **Exact Score** prediction
6. Select **Defensive / Balanced / Aggressive / Manual Style**
7. Join a starter **Club**
8. Select **Official Predictions** (up to league limit)
9. Play **Virtual Match** with club
10. Grow **Official Rating** (0–110)

## Core MVP Features

- Match feed (weekly)
- **Exact Score** input
- **Prediction Components** + **Energy** + **Styles**
- **Official Prediction** vs **Shadow Prediction**
- Player profile
- **Official Rating** 0–110, form, stats
- **Club**, **Bot Club**, squad
- **Virtual Match**, **Team Energy**, lineup
- **Division**, league table, **Season**
- **Bot Player** automation for filled leagues

## Long-Term Vision

- **Transfer Offer**, **Contract**, **Scout**, **Negotiator**
- In-game economy (virtual only)
- **Season** awards, creator/community leagues
- Social sharing
- Monetization: ads, subscription, cosmetics, advanced stats — **no pay-to-win**

## UI/UX Direction

- Mobile-first
- Dark premium sports UI
- Fantasy football manager + RPG feeling
- No sportsbook / casino visual language
- See `UX_NOTES.md`

## Development Principle

Build a **playable core** first: matches → prediction → energy → points → profile → club → virtual match → table.

Add economy, transfers, and monetization later.

## Current Frontend Stack (template)

| Item | State |
|------|--------|
| Framework | React 19 |
| Build | Vite 8 + `@vitejs/plugin-react-swc` |
| Language | TypeScript 6 (strict) |
| Package manager | npm (`package-lock.json`) |
| Alias | `@/` → `src/` |
| App code | Bare shell only — see `PROJECT_ROADMAP.md` |
