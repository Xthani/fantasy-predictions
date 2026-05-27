# Sprint Log

---

## Sprint 0 — Setup & Documentation

**Status:** Done (2026-05-22)

---

## Block A — Fast Onboarding UI

**Status:** Done (2026-05-22)

Экраны: login → leagues → clubs → matches + quick score.

---

## Phase 1 — `fantasy-predictions-back`

**Status:** Done (2026-05-27)

- Live API: auth, profile, leagues, clubs, matches, predictions
- Контракт: `fantasy-predictions-back` + `docs/INTEGRATION.md`
- Fix: бесконечный fetch матчей (`mapError` в `useAsyncRequest`)
- Frontend: матч-лента поддерживает пагинацию (`offset/limit` + «Показать ещё»)
- Frontend: local-first онбординг (`localStorage` → быстрый переход, backend PATCH → sync)
- Frontend: минимальный `/profile` с любимыми лигами/клубами и сохранёнными прогнозами
- Tech closure: публичные `features/*/index.ts`; страницы больше не импортируют внутренности фич
- Tech closure: local onboarding state очищается при logout / unauthenticated, профиль вынесен в page hook

---

## Next phase

**TBD** — см. [`CURRENT_STATE.md`](CURRENT_STATE.md), [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md).
