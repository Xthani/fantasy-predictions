# API integration (Phase 1)

**Бэкенд:** соседний репозиторий [`fantasy-predictions-back`](../fantasy-predictions-back).

| Документ | Назначение |
|----------|------------|
| [`fantasy-predictions-back/docs/integration/frontend-wiring.md`](../fantasy-predictions-back/docs/integration/frontend-wiring.md) | Полная инструкция, примеры кода, коды ошибок, E2E |
| [`API_CONTRACT.md`](API_CONTRACT.md) | Краткая таблица ручек на фронте |
| [`CURRENT_STATE.md`](CURRENT_STATE.md) | Что подключено сейчас |

## Запуск

```bash
# бэкенд (из корня fantasy-predictions)
cd ../fantasy-predictions-back && docker compose up -d --build

# миграции (если контейнер уже был — на старте api поднимает head сам)
docker compose exec api alembic upgrade head

# фронт
cd ../fantasy-predictions
cp .env.example .env.local
npm install
npm run dev
```

Health: `GET http://localhost:8000/api/health` → `fantasy-predictions-back is running`.

E2E-чеклист — в [`frontend-wiring.md`](../fantasy-predictions-back/docs/integration/frontend-wiring.md) бэкенда, §12.

## Production (Vercel + Render)

| Сервис | Env |
|--------|-----|
| Frontend (Vercel) | `VITE_API_BASE_URL` → URL Render API **без** `/api` |
| Backend (Render) | migration **005** обязательна; см. `fantasy-predictions-back/docs/runbooks/render-deploy.md` |

Фронт: `vercel.json` — SPA rewrite на `index.html` (F5 на `/profile`, `/friends`, `/users/:id`).
