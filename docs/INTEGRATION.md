# API integration (Phase 1)

**Бэкенд:** соседний репозиторий [`fantasy-predictions-back`](../fantasy-predictions-back).

| Документ | Назначение |
|----------|------------|
| [`fantasy-predictions-back/FRONTEND_INTEGRATION.md`](../fantasy-predictions-back/FRONTEND_INTEGRATION.md) | Полная инструкция, примеры кода, коды ошибок |
| [`API_CONTRACT.md`](API_CONTRACT.md) | Краткая таблица ручек на фронте |
| [`CURRENT_STATE.md`](CURRENT_STATE.md) | Что подключено сейчас |

## Запуск

```bash
# бэкенд (из корня fantasy-predictions)
cd ../fantasy-predictions-back && docker compose up -d --build

# фронт
cd ../fantasy-predictions
cp .env.example .env.local
npm install
npm run dev
```

Health: `GET http://localhost:8000/api/health` → `fantasy-predictions-back is running`.

E2E-чеклист — в `FRONTEND_INTEGRATION.md` бэкенда, §11.
