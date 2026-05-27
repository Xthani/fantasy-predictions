# Mock Data Plan

> **DEPRECATED (2026-05-24).** `src/shared/mocks/` удалён. Фронт работает только с live API (auth, leagues) или показывает заглушки «ждём бэкенд». Этот документ сохранён как историческая справка по формам сущностей — см. `API_CONTRACT.md` и `BACKEND_BRIEF.md`.

---

## Former purpose

Frontend MVP previously used in-memory mocks until backend existed. Shapes aligned with `API_CONTRACT.md` draft endpoints.

**Removed files:** `leagues.ts`, `favoriteClubs.ts`, `matches.ts`, `index.ts`.

---

## Entity shapes (still valid for backend)

See `API_CONTRACT.md` and `BACKEND_BRIEF.md` for current contract shapes:

| Entity | Key fields |
|--------|------------|
| League | `id`, `name`, `countryName`, `isActive`, `crestUrl?` |
| Team/Club | `id`, `name`, `shortName`, `leagueId`, `crestUrl?` |
| Match | `id`, `homeTeam`, `awayTeam`, `kickoffAt`, `status`, `leagueId` |
| Prediction | `matchId`, `homeScore`, `awayScore`, `savedAt` |
