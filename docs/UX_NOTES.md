# UX Notes

## Principles

1. **Mobile-first** — design for narrow viewport first; touch targets ≥ 44px.
2. **Fast first action** — first useful interaction within minutes of open.
3. **First prediction in 3–5 minutes** — onboarding must not block with long rules.
4. **Progressive disclosure** — basics first; **Manual Style** and advanced energy later.
5. **Exact Score input is primary** — largest control on prediction screen.
6. **Advanced controls don't block beginners** — Defensive / Balanced / Aggressive default; Manual optional.
7. **Dark premium sports UI** — fantasy manager + RPG, not neon casino.
8. **No betting/casino language** — avoid: odds, stake, bet slip, cash out, wallet.
9. **Official vs Shadow** — always visible which picks affect **Official Rating** and **Club**.
10. **Show why it matters** — each prediction screen links to rating, club, virtual match, rewards.

## Fast onboarding (Phase 1 — live)

Goal: player makes a **first Exact Score** in minutes. Advanced mechanics (Official Picks, club league, energy styles) come **after** this path.

| Step | Screen | Rule |
|------|--------|------|
| 0 | **Login / Register** | `login` + `password` (без email, без Google) |
| 1 | **Leagues** | 5 featured + search → `PATCH` профиля с `favoriteLeagueIds` |
| 2 | **Clubs** | 2 клуба на лигу + search → `PATCH` с `favoriteClubIds` |
| 3 | **Match feed** | пагинируемая лента → `POST` прогноз счёта |
| 4 | **Profile** | появляется после первого прогноза; показывает любимые лиги/клубы и сохранённые прогнозы |

Order: **login → leagues → clubs → matches → profile**. API: `docs/INTEGRATION.md`.

Navigation is local-first: after a user selects leagues/clubs or saves the first prediction, the UI moves forward immediately from local state while backend sync continues separately. Logout clears this local progress before another user signs in on the same device.

Skip / defer: country picker, bot clubs, official vs shadow, energy styles, club apply — not on this path.

## Onboarding (full product, later)

| Step | Rule |
|------|------|
| Profile | Minimal fields |
| Country | When multi-region leagues need it |
| Club join (game club) | After first prediction feel |
| Official picks tutorial | Progressive disclosure |

## Key Screens (planned)

| Screen | Focus |
|--------|--------|
| Home | Next matches, club snapshot |
| Match feed | Weekly list, status, filter |
| Prediction | Exact Score, components, energy, style |
| Official picks | Select & order official slots |
| Profile | Official Rating, form, shadow toggle |
| Club | Squad, virtual fixture, apply |
| Virtual match | XI, Team Energy, contributions |

## Anti-patterns

- Bookmaker odds table as hero UI
- Green/red flashing “win money” patterns
- Slot-machine celebration on points
- Forcing Manual Style before Balanced

## Visual Direction

- Dark background, high contrast typography
- Club colors as accents, not garish gradients
- Card-based match list
- Clear lock states (4h / 1h deadlines)

**Concrete tokens:** see `DESIGN_TOKENS.md` (colors, typography, spacing, component wire-level notes).
