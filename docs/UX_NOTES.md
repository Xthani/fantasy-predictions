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

## Onboarding (MVP)

| Step | Rule |
|------|------|
| Profile | Minimal fields |
| Country / league | Required |
| Favorites | Optional skip |
| First prediction | Before heavy tutorial |
| Club join | After first prediction feel |

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
