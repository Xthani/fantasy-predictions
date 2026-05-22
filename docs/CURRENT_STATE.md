# Current State (frontend)

**Обновлено:** 2026-05-22  
**Главный файл для вопроса «что работает / что дальше».** Остальные docs: видение, полный roadmap, бриф для бэка.

---

## Что работает сейчас (реальный API)

| Шаг | Экран | Данные |
|-----|--------|--------|
| 1 | `/login` | **API** — Google (`POST /api/auth/google`), опционально email login/signup если бэк отвечает |
| 2 | `/onboarding/leagues` | **API** — `GET /api/leagues` (snake_case → доменная модель `League`) |
| 3 | `/onboarding/clubs` | **Моки** — `shared/mocks/favoriteClubs.ts` |
| 4 | `/matches` | **Моки** — `shared/mocks/matches.ts` + quick score в `localStorage` |

**Бэкенд готов:** только Google-auth и каталог лиг. Остальные ручки из `BACKEND_BRIEF.md` — **план для бэка**, не требование к фронту сегодня.

---

## Демо-путь

```bash
cp .env.example .env   # VITE_API_BASE_URL, VITE_GOOGLE_WEB_CLIENT_ID
npm install
npm run dev
```

1. [http://localhost:3000/login](http://localhost:3000/login) → Google  
2. Выбрать лиги (список с API, логотипы) → **Далее**  
3. Клубы — **см. ограничение ниже**  
4. Матчи → quick Exact Score  

### Ограничение шага «Клубы»

Мок-клубы привязаны к id вида `league_la_liga`. После выбора лиг из API id другие (`"302"`, `"152"` …) — **список клубов пуст**, пока бэк не отдаст `GET /api/favorite-clubs`.

На экране клубов показывается пояснение; названия выбранных лиг отображаются из сохранённых метаданных (`fp_preferences.favoriteLeagues`).

**Сброс онбординга:** DevTools → Application → Local Storage → удалить `accessToken`, `refreshToken`, `user`, `fp_preferences`, `fp_quick_predictions`.

---

## Техника на фронте

| Область | Статус |
|---------|--------|
| `shared/api/httpClient.ts` | ✅ fetch, JWT, refresh, `ApiError`, ngrok header |
| `features/auth/api/auth.ts` | ✅ |
| `features/onboarding/api/leagues.ts` | ✅ |
| `shared/hooks/useAsyncRequest.ts` | ✅ загрузка списков (лиги) |
| `shared/lib/getApiErrorMessage.ts` | ✅ базовые сообщения об ошибках |
| ESLint / Prettier / `npm run build` | ✅ |

**Env:** `VITE_API_BASE_URL` (без `/api` в конце), `VITE_GOOGLE_WEB_CLIENT_ID`.

---

## Local storage (факт)

| Ключ | Назначение |
|------|------------|
| `accessToken`, `refreshToken`, `user` | Сессия auth |
| `fp_preferences` | `favoriteLeagueIds`, `favoriteLeagues` (id+name), `favoriteClubIds` |
| `fp_quick_predictions` | Quick Exact Score (моки матчей) |

---

## Что делать дальше (приоритет)

Когда бэк отдаст следующую ручку — подключать по образцу лиг (`features/.../api` + `useAsyncRequest` + обновить этот файл).

| # | Когда готов бэк | Фронт |
|---|-----------------|--------|
| **1** | `GET /api/favorite-clubs?leagueIds=` | `features/onboarding/api/clubs.ts`, `useClubsPage` → API |
| **2** | `PUT /api/players/me/preferences` | сохранять лиги/клубы на сервер вместо только `fp_preferences` |
| **3** | `GET /api/matches/week` | `useMatchesPage` → API |
| **4** | `POST/GET /api/predictions` | quick score → API |

**Параллельно (без бэка):** нижние табы, статусы матчей, полный экран прогноза (energy/styles) — см. `PROJECT_ROADMAP.md` Sprint 3–4.

---

## DevTools: частые сообщения (не баги)

| Симптом | Причина |
|---------|--------|
| `leagues` **дважды** на reload | Было: `restoreSession` → `loading` → `RequireAuth` снимал страницу и монтировал снова. **Исправлено:** refresh сессии в фоне без `loading` |
| `leagues` **304** | Нормальный кэш: бэк отдал `ETag`, второй запрос с `If-None-Match` → «не изменилось», тело из кэша браузера |
| `[GSI_LOGGER]: button width invalid: 100%` | У Google кнопки `width` только в **пикселях** — исправлено на login |
| `Cross-Origin-Opener-Policy` + `postMessage` | Шум от popup/iframe Google OAuth; если вход работает — можно игнорировать |
| `favicon.ico` 404 | Файл должен быть в корневом `public/favicon.ico` (не `src/public/`) |

---

## Связанные документы

| Документ | Зачем |
|----------|--------|
| [`API_CONTRACT.md`](API_CONTRACT.md) | Форматы **живых** ручек (auth, leagues) + черновик остального |
| [`BACKEND_BRIEF.md`](BACKEND_BRIEF.md) | Задание бэкенду на будущее (не чеклист готовности фронта) |
| [`PROJECT_ROADMAP.md`](PROJECT_ROADMAP.md) | Полный MVP по спринтам |
| [`SPRINT_LOG.md`](SPRINT_LOG.md) | Журнал поставок |
