# Mock Data Plan (Sprint 0)

Frontend MVP uses **in-memory mocks** in `src/` until backend exists. Shapes align with `API_CONTRACT.md` draft endpoints.

**Implementation:** Sprint 1 (`src/shared/mocks/`).

---

## Folder layout (planned)

```text
src/
├── shared/
│   ├── mocks/
│   │   ├── index.ts          # re-exports
│   │   ├── leagues.ts        # ✅ implemented
│   │   ├── favoriteClubs.ts  # ✅ implemented (onboarding favorites)
│   │   ├── matches.ts        # ✅ implemented
│   │   ├── players.ts
│   │   ├── clubs.ts
│   │   ├── bots.ts
│   │   ├── divisions.ts
│   │   └── predictions.ts
│   └── types/
│       ├── match.ts
│       ├── player.ts
│       ├── club.ts
│       └── prediction.ts
```

No API client in Sprint 1 — pages import mocks directly; swap to fetch layer later.

---

## Entity shapes (MVP minimum)

### `League` (onboarding)

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | e.g. `league_la_liga` |
| `name` | string | Display name |
| `countryName` | string | For search |
| `countryCode` | string | ISO-style |
| `isActive` | boolean | Inactive leagues shown disabled |
| `crestEmoji` | string | Mock crest until `crestUrl` from API |

**Volume:** 5–8 leagues (mix active + coming soon). **File:** `src/shared/mocks/leagues.ts`.

---

### `FavoriteClub` (onboarding)

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | e.g. `club_real_madrid` |
| `name` | string | Display name |
| `shortName` | string | Abbreviation |
| `leagueId` | string | FK to `League.id` |
| `crestEmoji` | string | Mock until `crestUrl` |

**Volume:** ~3–4 clubs per active league. **File:** `src/shared/mocks/favoriteClubs.ts`. Filter: `GET /api/clubs?leagueIds=…`.

---

### `Match`

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | e.g. `m_1` |
| `homeTeam` | string | Display name |
| `awayTeam` | string | Display name |
| `kickoffAt` | string (ISO) | UTC |
| `status` | `'open' \| 'locked' \| 'finished'` | Feed + card state |
| `competition` | string | e.g. "La Liga" |
| `week` | number | Round number |
| `leagueId` | string | Active league filter |
| `resultHome?` | number | When `finished` |
| `resultAway?` | number | When `finished` |

**Volume:** 10 matches per mock week (covers feed scroll + filters).

---

### `Player` (current user)

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | `player_me` |
| `displayName` | string | Onboarding |
| `countryId` | string | |
| `leagueId` | string | Active league |
| `officialRating` | number | 0–110 |
| `form` | number[] | Last 5 official results (points or WDL proxy) |
| `clubId` | string \| null | After join |
| `officialPicksLimit` | number | e.g. 5 per round |

**Volume:** 1 current player + 8 squad mates in club context.

---

### `Club`

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | |
| `name` | string | |
| `isBot` | boolean | **Bot Club** flag |
| `divisionId` | string | |
| `accentColor` | string | Hex for UI accent |
| `memberIds` | string[] | Player ids in squad |

**Volume:** 5 starter clubs (human-joinable) + 5 **Bot Club** entries for table fill.

---

### `BotPlayer`

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | |
| `clubId` | string | |
| `displayName` | string | |
| `style` | `'defensive' \| 'balanced' \| 'aggressive'` | Auto predictions |
| `officialRating` | number | Static for MVP mock |

**Volume:** 2–3 bots per Bot Club (15–20 total bot players across mocks).

---

### `Prediction`

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | |
| `matchId` | string | |
| `playerId` | string | |
| `homeScore` | number | **Exact Score** |
| `awayScore` | number | |
| `style` | string | Energy style |
| `isOfficial` | boolean | Official vs **Shadow** |
| `officialOrder?` | number | 1..N when official |
| `createdAt` | string (ISO) | |

**Volume:** 3 sample predictions for current player (mix official/shadow).

---

### `Division` + table row

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | |
| `name` | string | e.g. "Division 3" |
| `season` | string | e.g. "2025-26" |
| `rows` | `DivisionTableRow[]` | |

`DivisionTableRow`: `clubId`, `played`, `won`, `drawn`, `lost`, `points`.

**Volume:** 1 division, 10 clubs (mix real mock clubs + bots).

---

### `VirtualMatch` (stub)

| Field | Type | Notes |
|-------|------|--------|
| `id` | string | |
| `homeClubId` | string | |
| `awayClubId` | string | |
| `status` | `'upcoming' \| 'live' \| 'finished'` | |
| `lineupDeadlineAt` | string (ISO) | |

**Volume:** 1 current fixture for player's club.

---

## Mock scenarios (for UI dev)

| Scenario | Data intent |
|----------|-------------|
| Fresh user | No predictions; club not joined |
| Active week | 10 open matches, 2 locked, 1 finished |
| Official cap | 5 official slots, 2 already used |
| Club joined | `player_me` in club with next virtual match |
| Division table | 10 rows including 3 bot clubs |

Toggle via a single `MOCK_SCENARIO` constant in `src/shared/mocks/index.ts` (Sprint 1).

---

## Mapping to API (later)

| Mock module | Future endpoint |
|-------------|-----------------|
| `matches.ts` | `GET /api/matches/week`, `GET /api/matches/:id` |
| `predictions.ts` | `POST/GET/PATCH /api/predictions*` |
| `players.ts` | `GET /api/players/me` |
| `clubs.ts` | `GET /api/clubs`, `GET /api/clubs/:id` |
| `divisions.ts` | `GET /api/divisions/:id/table` |
| virtual stub | `GET /api/virtual-matches/current` |

---

## Naming rules

- IDs: prefix + number (`m_1`, `c_3`, `bp_12`)
- Team names: fictional (no real trademarked club names in mocks unless licensed later)
- Times: ISO 8601 UTC strings
- All mock copy in English (per Decision 010)
