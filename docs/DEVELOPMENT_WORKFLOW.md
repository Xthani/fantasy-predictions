# Development Workflow

**Frontend leads.** См. [`CURRENT_STATE.md`](CURRENT_STATE.md) для актуального статуса.

---

## Phase 1 — завершён

Live API: **`fantasy-predictions-back`**. Контракт: [`INTEGRATION.md`](INTEGRATION.md), кратко — [`API_CONTRACT.md`](API_CONTRACT.md).

---

## Rhythm (следующие блоки)

```text
1. UI/UX block     → экран или доработка flow
2. Tech closure    → lint, refactor, docs
3. Backend (если нужен новый контракт) → fantasy-predictions-back
4. Wire            → features/*/api + page hook + CURRENT_STATE.md
```

---

## Правила

- Новые зависимости — только под видимую фичу.
- Без half-wired API: либо ручка есть, либо честная заглушка.
- После интеграции: `CURRENT_STATE.md`, `API_CONTRACT.md`, `SPRINT_LOG.md`.
- UI на русском; `/docs` на русском или английском по контексту.

---

## Wiring endpoint (чеклист)

1. Контракт в `fantasy-predictions-back` + Swagger.
2. `features/<feature>/api/<resource>.ts` + `httpClient`.
3. Page hook: `useAsyncRequest` — 4 состояния; **стабильный** `mapError`.
4. Обновить `CURRENT_STATE.md`, `API_CONTRACT.md`.

---

## Следующий этап

Определяется владельцем продукта. Трекинг идей: [`BACKLOG.md`](BACKLOG.md).
