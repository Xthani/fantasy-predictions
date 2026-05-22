# API Contract

## Current State

- Frontend is a **bare React/Vite template** — no API client yet.
- MVP development should use **mock data** in `src/` until backend exists.
- Entity shapes, volumes, and folder layout: `MOCK_DATA.md`.
- This document is a **draft** for frontend/backend alignment.

## Conventions (planned)

| Item | Plan |
|------|------|
| Base URL | `TBD` (e.g. `https://api.example.com`) |
| Auth | Bearer JWT after login |
| Format | JSON |
| Errors | `{ "code": string, "message": string, "details"?: unknown }` |
| Time | ISO 8601 UTC |

---

## Future API Draft

### Matches

#### `GET /api/matches/week`

**Purpose:** Weekly match feed for active league.

**Query:** `leagueId`, `week`, `countryId?`

**Response (draft):**

```json
{
  "week": 12,
  "matches": [
    {
      "id": "m_1",
      "homeTeam": "Madrid Crown",
      "awayTeam": "Sevilla Reds",
      "kickoffAt": "2026-05-25T18:00:00Z",
      "status": "open",
      "competition": "La Liga"
    }
  ]
}
```

---

#### `GET /api/matches/:id`

**Purpose:** Single match for prediction screen.

**Response (draft):** match + lock state + user prediction if any.

---

### Predictions

#### `POST /api/predictions`

**Purpose:** Create prediction (Exact Score + style + energy split).

**Body (draft):**

```json
{
  "matchId": "m_1",
  "homeScore": 2,
  "awayScore": 1,
  "style": "balanced",
  "energyDistribution": {}
}
```

**Response:** prediction id, components, lock time.

---

#### `GET /api/predictions/me`

**Purpose:** List current Player predictions (official + shadow flags).

---

#### `PATCH /api/predictions/:id`

**Purpose:** Update before deadline (4h rule). Rejected if locked.

---

### Official Picks

#### `POST /api/league-picks`

**Purpose:** Mark predictions as **Official Predictions** for the round.

**Body (draft):**

```json
{
  "predictionIds": ["p_1", "p_2"],
  "order": [1, 2]
}
```

**Response:** confirmed official list, shadow remainder.

---

### Players

#### `GET /api/players/me`

**Purpose:** Current Player profile, **Official Rating**, form, stats.

---

#### `GET /api/players/:id`

**Purpose:** Public Player card (club, rating, form).

---

### Clubs

#### `GET /api/clubs`

**Purpose:** List clubs (starter + bot), filters for onboarding.

---

#### `GET /api/clubs/:id`

**Purpose:** Club detail — squad, next **Virtual Match**, division.

---

#### `POST /api/clubs/:id/apply`

**Purpose:** Apply to join club. **Bot Club** may auto-accept.

**Body:** `{ "message"?: string }`

---

### Virtual Matches

#### `GET /api/virtual-matches/current`

**Purpose:** Active virtual fixture for Player's club — lineup deadline, Team Energy, opponent.

---

### Divisions

#### `GET /api/divisions/:id/table`

**Purpose:** League table — clubs, points, played, virtual W/D/L.

**Response (draft):**

```json
{
  "divisionId": "d_1",
  "season": "2025-26",
  "rows": [
    { "clubId": "c_1", "played": 5, "won": 3, "drawn": 1, "lost": 1, "points": 10 }
  ]
}
```

---

## Not in MVP API

- Real-money wallet
- Bookmaker odds feed
- Internal transfer chat (see `DECISION_LOG.md` Decision 006)
