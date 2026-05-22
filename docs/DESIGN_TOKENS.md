# Design Tokens (Sprint 0 sketch)

Dark premium sports UI for a fantasy football manager — not bookmaker/casino visuals.

**Status:** Sketch for Sprint 1 implementation in CSS variables (`src/app/styles/tokens.css`).

See also `UX_NOTES.md` for principles and screen priorities.

---

## Color palette

| Token | Value | Usage |
|-------|-------|--------|
| `--color-bg-base` | `#0B0E12` | App background |
| `--color-bg-elevated` | `#141A22` | Cards, bottom sheet |
| `--color-bg-muted` | `#1C2430` | Secondary panels, chips |
| `--color-border` | `#2A3544` | Dividers, card outline |
| `--color-text-primary` | `#F2F5F8` | Headings, primary labels |
| `--color-text-secondary` | `#9AA8B8` | Meta, kickoff time, hints |
| `--color-text-muted` | `#6B7A8C` | Placeholders, disabled |
| `--color-accent` | `#3D8BFF` | Primary actions, links (cool blue, not neon green) |
| `--color-accent-hover` | `#5A9DFF` | Hover / pressed primary |
| `--color-success` | `#2DB87A` | Correct pick, positive form (muted, no flash) |
| `--color-warning` | `#E6A23C` | Deadline soon, lock approaching |
| `--color-danger` | `#E85D5D` | Errors, locked missed deadline |
| `--color-official` | `#C9A227` | Official Prediction badge (gold accent, not casino gold) |
| `--color-shadow` | `#7B8CFF` | Shadow Prediction badge (soft violet) |

Club-specific accents (jersey colors) are applied as `--color-club-accent` per screen, never as full-screen gradients.

---

## Typography

| Token | Size | Weight | Line height | Usage |
|-------|------|--------|-------------|--------|
| `--font-family` | — | — | — | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` |
| `--text-display` | 28px | 700 | 1.2 | Screen titles |
| `--text-title` | 20px | 600 | 1.3 | Card titles, team names |
| `--text-body` | 16px | 400 | 1.5 | Default copy |
| `--text-label` | 14px | 500 | 1.4 | Buttons, tabs |
| `--text-caption` | 12px | 400 | 1.4 | Kickoff, competition, hints |
| `--text-score` | 32px | 700 | 1 | Exact Score input display |

---

## Spacing & layout

| Token | Value | Usage |
|-------|-------|--------|
| `--space-1` | 4px | Tight gaps |
| `--space-2` | 8px | Inline spacing |
| `--space-3` | 12px | Card padding (compact) |
| `--space-4` | 16px | Default padding |
| `--space-5` | 24px | Section gaps |
| `--space-6` | 32px | Screen top/bottom safe areas |
| `--layout-max-width` | 480px | Mobile shell max width (centered on tablet/desktop) |
| `--touch-min` | 44px | Minimum tap target height |

---

## Radius & elevation

| Token | Value | Usage |
|-------|-------|--------|
| `--radius-sm` | 8px | Chips, small buttons |
| `--radius-md` | 12px | Cards, inputs |
| `--radius-lg` | 16px | Modals, bottom sheets |
| `--shadow-card` | `0 4px 24px rgba(0, 0, 0, 0.35)` | Match cards, elevated panels |

---

## Component sketches (wire-level)

### Match card (feed)

- Elevated card on `--color-bg-elevated`
- Home / away on one row, kickoff + competition in caption
- Status chip: `open` (accent), `locked` (warning), `finished` (muted)
- Tap → prediction screen

### Prediction screen

- **Exact Score** controls largest (center or top)
- Style selector: horizontal segmented control (Defensive / Balanced / Aggressive / Manual)
- Components list below with energy bars (read-only until Manual)
- Sticky footer: primary CTA “Save prediction”, secondary link to official picks info

### Official vs Shadow badge

- Official: gold outline + label “Official”
- Shadow: violet outline + label “Shadow”
- Always visible on prediction list items

### Lock states

| State | Visual |
|-------|--------|
| Open | Default; accent CTA |
| Locks in &lt; 4h | Warning caption + countdown |
| Locked | Muted card, no edit CTA |
| Finished | Result row + points summary |

---

## Sprint 1 implementation notes

- Map tokens to `:root` in `src/app/styles/tokens.css`
- Import once in `main.tsx` or app shell
- No third-party CSS framework in Sprint 1 unless decided later in `DECISION_LOG.md`
- Prefer CSS variables + minimal component-scoped styles
