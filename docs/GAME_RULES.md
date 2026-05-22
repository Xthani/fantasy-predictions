# Game Rules

> **Version:** 0.2 draft — source of truth for mechanics.  
> Balance numbers marked **draft** are not final.  
> Any rule change → update this file + `DECISION_LOG.md`.

## 1. General

- Only in-game points and virtual resources — no real money.
- Real match results come from an agreed data source (see `API_CONTRACT.md`).
- One account per human player (enforcement TBD).

---

## 2. Exact Score as Main Input

The Player enters an **Exact Score**, e.g.:

```text
Madrid Crown 2 - 1 Sevilla Reds
```

The system auto-generates **Prediction Components**:

| Component | Notes |
|-----------|--------|
| Match Outcome | W / D / L |
| Double Chance | Derived from outcome |
| Total Goals | Over/under style |
| Both Teams To Score | Yes / No |
| Home Team Individual Total | Home goals band |
| Away Team Individual Total | Away goals band |
| Goal Difference / Handicap | Spread-style |
| Exact Total Goals | Total goals exact |
| Team Goals | Per-team goal markets |
| Exact Score | Same as main input |

Player does **not** pick each component manually in MVP — they flow from Exact Score + Style energy split.

---

## 3. Scoring — Draft Multipliers

> **Draft balancing — not final.**

| Component | Multiplier |
|-----------|------------|
| Double Chance | ×0.6 |
| Match Outcome | ×1.0 |
| Total Goals | ×1.2 |
| Both Teams To Score | ×1.3 |
| Individual Total (home/away) | ×1.2–×1.4 |
| Goal Difference / Handicap | ×1.8 |
| Exact Total Goals | ×2.0 |
| Team Goals | ×2.5 |
| Exact Score | ×4.0 |

### Points formula (per component)

```text
If correct: points = energy_on_component × multiplier
If wrong:   points = 0
```

---

## 4. Energy

- **100 Energy** per real match per Player.
- Energy is distributed across **Prediction Components** according to **Style** (or **Manual Style**).
- Wrong component → 0 points for that component only.

---

## 5. Styles

| Style | Behavior |
|-------|----------|
| **Defensive Style** | More Energy on safer components (Double Chance, Match Outcome, Total Goals) |
| **Balanced Style** | Even spread across risk levels |
| **Aggressive Style** | More Energy on Exact Score, Exact Total Goals, Goal Difference, Team Goals |
| **Manual Style** | Player sets distribution (advanced; must not block beginners — see `UX_NOTES.md`) |

---

## 6. Official vs Shadow Predictions

- Player may predict many matches.
- Only selected **Official Predictions** affect **Official Rating**, rewards, and **Club** virtual result.
- All other predictions count toward **Shadow Stats** only.
- MVP limit: up to **10 Official Predictions** per league round (confirm in implementation).

---

## 7. Deadlines

| Action | Lock |
|--------|------|
| Change **Official Prediction** | Until **4 hours** before real match kick-off |
| Change club starting lineup for **Virtual Match** | Until **1 hour** before virtual match start |
| Locked match | No edits |

---

## 8. Official Rating & Shadow Stats

- **Official Rating**: 0–110, driven by Official Predictions.
- **Shadow Stats**: practice / non-official performance, no rating impact.
- **Form**: recent official performance indicator (formula TBD).

---

## 9. Club & Team Energy

### Club

- Player joins a **Club** (starter clubs + **Bot Club** for MVP).
- Squad: starting XI + reserves (details in club screen).

### Team Energy (separate from Player Energy)

- Club has **100 Team Energy** per **Virtual Match**.
- Does **not** affect Player personal **Official Rating**.
- Only adds team contribution in **Virtual Match**.
- Distribution: **10** regular players × **9** Team Energy; **Captain** × **10** → total **100**.
- Club picks **Defensive / Balanced / Aggressive** team style (same philosophy as Player Styles).

### Captain

- One **Captain** per lineup — receives extra Team Energy slot (10 vs 9).

---

## 10. Virtual Match

- **11 vs 11** Players (real + **Bot Player**).
- Score = sum of personal match points + Team Energy bonus per player.
- Higher total wins.
- Display may map to football-like virtual score (e.g. goals) for narrative.

---

## 11. Division, Season, League Table

- **Division**: e.g. 10 clubs, 9 matchdays per **Season**.
- Table: points for win / draw / loss in virtual league.
- Promotion/relegation — post-MVP unless needed for MVP table only.

---

## 12. Bots (MVP required)

| Type | Role |
|------|------|
| **Bot Player** | Auto predictions; styles: Defensive / Balanced / Aggressive |
| **Bot Club** | Auto lineup, auto-accept applications, fill empty slots |

League must function with few human players.

---

## 13. Monetization (future — not MVP)

Allowed later: ads, subscription, cosmetics, profile themes, badges, advanced stats.  
Forbidden: pay-to-win boosts, real-money loops.

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-05-22 | Initial structure |
| 0.2 | 2026-05-22 | Exact Score core, energy, styles, official/shadow, bots, virtual match |
