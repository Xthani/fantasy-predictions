# Fantasy Predictions

Минималистичный enterprise-grade фронтенд на **React 19**, **Vite 8** и **TypeScript** — без лишних фреймворков, CSS-бойлерплейта и скрытой магии. Проект собран с нуля для максимального контроля над архитектурой, зависимостями и производительностью сборки.

## Tech Stack

| Слой | Технология | Версия (ориентир) |
|------|------------|-------------------|
| UI | React | 19.x |
| Рендер | react-dom | 19.x |
| Сборка | Vite + `@vitejs/plugin-react-swc` | 8.x / SWC |
| Язык | TypeScript (`moduleResolution: bundler`, strict) | 6.x |

Стек намеренно **собран с нуля**: нет Next.js, CRA и тяжёлых UI-фреймворков «из коробки» — только то, что нужно для старта и масштабирования.

## Быстрый старт

### Требования

- Node.js 20+ (рекомендуется LTS)
- npm 10+

### Установка зависимостей

```bash
npm install
```

### Режим разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000) (порт зафиксирован в `vite.config.ts` через `strictPort: true`).

### Production-сборка

```bash
npm run build
```

Скрипт выполняет проверку типов (`tsc`) и сборку Vite в каталог `dist/`.

### Предпросмотр production-сборки

```bash
npm run preview
```

Локальный сервер для проверки содержимого `dist/` перед деплоем.

## Структура проекта

```text
fantasy-predictions/
├── index.html          # Точка входа HTML
├── package.json
├── tsconfig.json       # Strict TypeScript для src/
├── vite.config.ts      # Vite 8 + SWC + алиас @/
├── README.md
├── public/             # (опционально) статические ассеты
└── src/
    ├── main.tsx        # createRoot, StrictMode (→ app/ в Sprint 1)
    ├── App.tsx         # Корневой компонент
    └── vite-env.d.ts   # Типы Vite (import.meta.env и др.)
```

Целевая структура после Sprint 1 — **FSD-light**: `app/`, `pages/`, `features/`, `shared/`. Подробности: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), правила для Cursor — `.cursor/rules/00-core.mdc`, `10-architecture.mdc`.

## Архитектурный выбор

### Почему «с нуля», а не тяжёлый фреймворк

- **Прозрачность**: каждый слой (роутинг, стейт, стили) добавляется осознанно, без наследия шаблона.
- **Размер бандла и скорость**: нет неиспользуемого кода фреймворка на старте.
- **Гибкость**: FSD-light (`docs/ARCHITECTURE.md`), собственный API-слой, i18n и CI/CD без борьбы с conventions чужого стека.

### Почему SWC (`@vitejs/plugin-react-swc`)

SWC компилирует JSX/TS в нативном Rust — быстрее классического Babel на больших кодовых базах. В связке с Vite 8 это даёт быстрый HMR и короткие production-сборки при сохранении полной совместимости с React 19.

### Алиас `@/` → `src/`

В `vite.config.ts` и `tsconfig.json` настроен единый алиас:

```ts
import { App } from '@/App';
```

- **Vite** резолвит `@` в абсолютный путь к `src/` через `fileURLToPath`.
- **TypeScript** понимает те же импорты через `paths: { "@/*": ["src/*"] }`.

Импорты остаются короткими и предсказуемыми при росте дерева каталогов.

## Документация проекта

Продуктовая и техническая память — в каталоге [`docs/`](docs/):

| Файл | Содержание |
|------|------------|
| `PROJECT_VISION.md` | Видение продукта |
| `PROJECT_ROADMAP.md` | Roadmap, Block A vs Sprint 1–9 |
| `DEVELOPMENT_WORKFLOW.md` | Ритм: UI → tech → backend brief |
| `SPRINT_LOG.md` | Журнал спринтов, чеклист Block A |
| `BACKEND_BRIEF.md` | Промпт-пак для бэка (после Block A) |
| `DESIGN_TOKENS.md` | Дизайн-токены (тёмная тема) |
| `ARCHITECTURE.md` | FSD-light: слои, импорты, решения проекта |
| `MOCK_DATA.md` | План мок-данных для MVP |
| `GAME_RULES.md` | Игровые правила |

**Текущий статус:** **Block A закрыт** (UI + lint + бриф для бэка). Бэкенду: [`docs/BACKEND_BRIEF.md`](docs/BACKEND_BRIEF.md).

### Демо-путь (Block A)

```bash
npm run dev
```

1. Открыть [http://localhost:3000/login](http://localhost:3000/login) → **Продолжить с Google**
2. Выбрать одну или несколько лиг → **Далее**
3. Выбрать один или несколько клубов → **К матчам**
4. Тап по матчу → указать счёт → **Сохранить прогноз**

Данные в `localStorage` (`fp_session`, `fp_preferences`, `fp_quick_predictions`). Сброс: очистить storage в DevTools и обновить страницу.

## Скрипты npm

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер с HMR (порт 3000) |
| `npm run build` | `tsc` + production bundle в `dist/` |
| `npm run preview` | Локальный preview собранного `dist/` |
| `npm run lint` | ESLint по `src/` |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |

## Лицензия

Проект в разработке. Уточните лицензию перед публикацией пакета.
