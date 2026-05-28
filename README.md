# Fantasy Predictions

Mobile-first фронтенд: **React 19**, **Vite 8**, **TypeScript** (strict). FSD-light, без лишних фреймворков.

## Tech Stack

| Слой | Технология |
|------|------------|
| UI | React 19 |
| Сборка | Vite 8 + `@vitejs/plugin-react-swc` |
| Язык | TypeScript 6 (strict) |
| Роутинг | `react-router-dom` |

## Быстрый старт

### Требования

- Node.js 20+
- npm 10+
- Локальный бэкенд [`fantasy-predictions-back`](../fantasy-predictions-back) (Docker, порт 8000)

### Установка и запуск

```bash
npm install
cp .env.example .env.local   # VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000)

### Сборка

```bash
npm run build    # tsc + vite → dist/
npm run preview  # preview dist/
npm run lint
npm run format
```

## Демо-путь (Phase 1)

1. `/login` — регистрация или вход (`login` + `password`)
2. `/onboarding/leagues` — выбор лиг
3. `/onboarding/clubs` — выбор клубов
4. `/matches` — лента матчей и быстрый прогноз счёта

Подробности API: [`docs/INTEGRATION.md`](docs/INTEGRATION.md).

## Структура

```text
src/
  app/           # App.tsx, layout, tokens
  pages/         # экраны (login, onboarding, matches)
  features/      # auth, onboarding, match-feed, quick-prediction, profile
  shared/        # ui, api/httpClient, hooks, types
```

Архитектура: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Документация

Полный индекс: [`docs/README.md`](docs/README.md).

| Файл | Назначение |
|------|------------|
| **[`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md)** | Что работает сейчас и что дальше |
| [`docs/INTEGRATION.md`](docs/INTEGRATION.md) | Ссылка на бэкенд и контракт |
| [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) | Таблица ручек Phase 1 |
| [`docs/PROJECT_ROADMAP.md`](docs/PROJECT_ROADMAP.md) | Roadmap продукта |
| [`docs/PROJECT_VISION.md`](docs/PROJECT_VISION.md) | Видение |
| [`docs/GAME_RULES.md`](docs/GAME_RULES.md) | Игровые правила |
| [`docs/UX_NOTES.md`](docs/UX_NOTES.md) | UX-принципы |
| [`docs/DEVELOPMENT_WORKFLOW.md`](docs/DEVELOPMENT_WORKFLOW.md) | Ритм разработки |
| [`docs/SPRINT_LOG.md`](docs/SPRINT_LOG.md) | Журнал спринтов |
| [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md) | Архитектурные решения |

**Статус:** [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md).

Спека и seed бэкенда — только в репозитории **`fantasy-predictions-back`**.

## Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (порт 3000) |
| `npm run build` | Production-сборка |
| `npm run preview` | Preview `dist/` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
