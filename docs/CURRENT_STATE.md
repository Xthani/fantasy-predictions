# Current State (frontend)

**Обновлено:** 2026-05-24  
**Главный файл для вопроса «что работает / что дальше».**

---

## Статус: ждём бэкенд

Фронт приведён в порядок: **моки и localStorage удалены**. Работает только то, что подключено к API. Остальные шаги — заглушки «ждём API».

| # | Шаг | Экран | Статус | Источник данных |
|---|-----|--------|--------|-----------------|
| 1 | Auth | `/login` | ✅ **Работает** | API — Google + email login/signup |
| 2 | Лиги | `/onboarding/leagues` | ✅ **Работает** | API — `GET /api/leagues` + `PATCH /api/profiles/me` |
| 3 | Клубы | `/onboarding/clubs` | ✅ **Работает** | API — `GET /api/teams?leagueIds=` + `PATCH` профиля |
| 4 | Матчи | `/matches` | ⏳ **Ждём бэк** | Заглушка; API не подключён |

---

## Что работает end-to-end

```bash
cp .env.example .env   # VITE_API_BASE_URL, VITE_GOOGLE_WEB_CLIENT_ID
npm install
npm run dev
```

1. [http://localhost:3000/login](http://localhost:3000/login) → Google или email  
2. Редирект на `/onboarding/leagues`  
3. Список лиг с API → выбор → «Далее» → **`PATCH /api/profiles/me`** с `favoriteLeagueIds` → `/onboarding/clubs`  
4. Клубы — экран-заглушка (кнопка «К матчам» disabled)  
5. `/matches` — экран-заглушка (доступен только если есть выбранные лиги в сессии)

**После перезагрузки страницы** выбранные лиги/клубы **сбрасываются** — это намеренно, чтобы не мешать тестированию.

---

## Хранение данных

| Что | Где | Примечание |
|-----|-----|------------|
| JWT (access + refresh) | **Cookies** (`fp_access_token`, `fp_refresh_token`) | Единственное персистентное хранилище |
| User (displayName, id…) | **React state** | Восстанавливается через `GET /api/auth/me` при reload |
| Выбранные лиги/клубы | **React state** (`OnboardingProvider`) | Только в рамках сессии, без localStorage |
| Прогнозы | — | Не реализовано до API |

**localStorage не используется.**

---

## Что ждём от бэкенда (приоритет)

| # | Endpoint | Блокирует |
|---|----------|-----------|
| 1 | `GET /api/leagues` — **5 featured лиг** + `search` по всей базе | Корректный список на шаге 2 |
| 2 | ~~`PATCH /api/profiles/me` — `favoriteLeagueIds`~~ | ✅ Подключено |
| 3 | `GET /api/teams?leagueIds=` (+ `name`) | ✅ Подключено |
| 4 | ~~`PATCH /api/profiles/me` — `favoriteClubIds`~~ | ✅ Подключено |
| 5 | `GET /api/matches` — по leagues+clubs, max 10, sort by date | Шаг 6 |
| 6 | `POST/GET /api/predictions` | Прогнозы |

Контракты переданы бэкендеру. Детали: `BACKEND_BRIEF.md`, `API_CONTRACT.md`.

---

## Техника на фронте

| Область | Статус |
|---------|--------|
| `shared/api/httpClient.ts` | ✅ fetch, JWT из cookies, refresh, `credentials: include` |
| `features/auth/lib/authCookies.ts` | ✅ токены в cookies |
| `features/auth/api/auth.ts` | ✅ Google + email |
| `features/onboarding/api/leagues.ts` | ✅ |
| `features/onboarding/api/teams.ts` | ✅ GET `/api/teams` по `leagueIds` |
| `features/profile/api/profile.ts` | ✅ GET + PATCH `/api/profiles/me` |
| `features/onboarding/model/OnboardingProvider.tsx` | ✅ in-memory state |
| `shared/mocks/` | ❌ **удалено** |
| ESLint / Prettier / `npm run build` | ✅ |

---

## DevTools: частые сообщения (не баги)

| Симптом | Причина |
|---------|--------|
| `leagues` **304** | Нормальный кэш браузера |
| `[GSI_LOGGER]: button width invalid` | Шум Google OAuth |
| `Cross-Origin-Opener-Policy` + `postMessage` | Шум Google popup; если вход работает — игнорировать |

---

## Связанные документы

| Документ | Зачем |
|----------|--------|
| [`API_CONTRACT.md`](API_CONTRACT.md) | Форматы живых и планируемых ручек |
| [`BACKEND_BRIEF.md`](BACKEND_BRIEF.md) | Задание бэкенду |
| [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md) | Roadmap по спринтам |
| [`SPRINT_LOG.md`](SPRINT_LOG.md) | Журнал поставок |
