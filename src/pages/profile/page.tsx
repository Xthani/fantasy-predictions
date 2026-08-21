import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useProfilePage } from '@/pages/profile/model/useProfilePage';
import { Button } from '@/shared/ui/Button/Button';
import { PageLoading } from '@/shared/ui/PageLoading/PageLoading';
import { Screen } from '@/shared/ui/Screen/Screen';
import { PredictionHistoryItem } from '@/pages/profile/ui/PredictionHistoryItem';
import styles from './page.module.css';

type PredictionFilter = 'all' | 'official' | 'shadow';

const formatSavedAt = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { data, status, error, retry } = useProfilePage();
  const [predictionFilter, setPredictionFilter] = useState<PredictionFilter>('all');

  const leagues = data?.leagues ?? [];
  const clubs = data?.clubs ?? [];
  const predictions = useMemo(() => data?.predictions ?? [], [data?.predictions]);
  const stats = data?.stats;
  const incomingFriendRequestsCount = data?.friendRequests.incoming.length ?? 0;

  const leaguesLabel = useMemo(
    () => (leagues.length > 0 ? `${leagues.length}` : '0'),
    [leagues.length],
  );
  const clubsLabel = useMemo(() => (clubs.length > 0 ? `${clubs.length}` : '0'), [clubs.length]);

  const filteredPredictions = useMemo(() => {
    const sorted = predictions
      .slice()
      .sort((a, b) => (b.savedAt ?? '').localeCompare(a.savedAt ?? ''));
    if (predictionFilter === 'official') {
      return sorted.filter((prediction) => prediction.isOfficial);
    }
    if (predictionFilter === 'shadow') {
      return sorted.filter((prediction) => !prediction.isOfficial);
    }
    return sorted;
  }, [predictions, predictionFilter]);

  return (
    <Screen
      eyebrow="Профиль"
      title={user?.displayName || user?.login || 'Игрок'}
      subtitle="Официальный рейтинг, форма и история прогнозов"
      footer={
        <div className={styles.footerStack}>
          <Button type="button" variant="secondary" fullWidth onClick={logout}>
            Выйти
          </Button>
        </div>
      }
    >
      {status === 'loading' ? <PageLoading /> : null}

      {status === 'error' ? (
        <div className={styles.section}>
          <p className={styles.label}>Ошибка</p>
          <p className={styles.value}>{error ?? 'Не удалось загрузить профиль'}</p>
          <div className={styles.actionsRow}>
            <Button type="button" variant="ghost" onClick={retry}>
              Повторить
            </Button>
            <Link className={styles.link} to="/matches">
              К матчам
            </Link>
          </div>
        </div>
      ) : null}

      {status === 'success' ? (
        <div className={styles.stack}>
          <div className={styles.kpiRow}>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Офиц. рейтинг</p>
              <p className={styles.kpiValue}>{stats?.officialRating ?? '—'}</p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Форма</p>
              <p className={styles.kpiValue}>{stats?.form != null ? `${stats.form}%` : '—'}</p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Офиц. матчи</p>
              <p className={styles.kpiValue}>{stats?.official.gradedCount ?? 0}</p>
            </div>
          </div>

          {stats ? (
            <div className={styles.statsGrid}>
              <div className={styles.statsCard}>
                <p className={styles.statsTitle}>Официальные</p>
                <p className={styles.statsLine}>
                  Зачтено: {stats.official.gradedCount} · В ожидании: {stats.official.pendingCount}
                </p>
                <p className={styles.statsLine}>
                  Очки: {stats.official.totalPoints}
                  {stats.official.averagePoints != null
                    ? ` · ср. ${stats.official.averagePoints}`
                    : ''}
                </p>
                {stats.official.averageEfficiency != null ? (
                  <p className={styles.statsMuted}>
                    Эффективность {stats.official.averageEfficiency}%
                  </p>
                ) : null}
              </div>
              <div className={styles.statsCard}>
                <p className={styles.statsTitle}>Теневые</p>
                <p className={styles.statsLine}>
                  Зачтено: {stats.shadow.gradedCount} · В ожидании: {stats.shadow.pendingCount}
                </p>
                <p className={styles.statsLine}>
                  Очки: {stats.shadow.totalPoints}
                  {stats.shadow.averagePoints != null ? ` · ср. ${stats.shadow.averagePoints}` : ''}
                </p>
                {stats.shadow.averageEfficiency != null ? (
                  <p className={styles.statsMuted}>
                    Эффективность {stats.shadow.averageEfficiency}%
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className={styles.kpiRow}>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Лиги</p>
              <p className={styles.kpiValue}>{leaguesLabel}</p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Клубы</p>
              <p className={styles.kpiValue}>{clubsLabel}</p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Всего прогнозов</p>
              <p className={styles.kpiValue}>{predictions.length}</p>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionTitle}>Любимые лиги</p>
              <Link className={styles.link} to="/onboarding/leagues">
                Изменить
              </Link>
            </div>

            {leagues.length === 0 ? (
              <p className={styles.muted}>Лиги ещё не выбраны</p>
            ) : (
              <ul className={styles.chipList}>
                {leagues.map((league) => (
                  <li key={league.id} className={styles.chip}>
                    <span className={styles.chipIcon} aria-hidden>
                      {league.crestUrl ? (
                        <img
                          className={styles.chipImg}
                          src={league.crestUrl}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        (league.crestEmoji ?? '🏆')
                      )}
                    </span>
                    <span className={styles.chipText}>{league.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionTitle}>Любимые клубы</p>
              <Link className={styles.link} to="/onboarding/clubs">
                Изменить
              </Link>
            </div>

            {clubs.length === 0 ? (
              <p className={styles.muted}>Клубы ещё не выбраны</p>
            ) : (
              <ul className={styles.cardList}>
                {clubs.map((club) => (
                  <li key={club.id} className={styles.clubCard}>
                    <span className={styles.clubCrest} aria-hidden>
                      {club.crestUrl ? (
                        <img className={styles.clubImg} src={club.crestUrl} alt="" loading="lazy" />
                      ) : (
                        <span className={styles.clubFallback}>
                          {club.shortName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className={styles.clubInfo}>
                      <span className={styles.clubName}>{club.name}</span>
                      <span className={styles.clubMeta}>{club.shortName}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionTitle}>Мои прогнозы</p>
              <Link className={styles.link} to="/matches">
                К матчам
              </Link>
            </div>

            <div className={styles.filterRow} role="tablist" aria-label="Фильтр прогнозов">
              {(
                [
                  ['all', 'Все'],
                  ['official', 'Официальные'],
                  ['shadow', 'Теневые'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={predictionFilter === value}
                  className={[
                    styles.filterChip,
                    predictionFilter === value ? styles.filterChipActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setPredictionFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            {predictions.length === 0 ? (
              <p className={styles.muted}>Пока нет прогнозов — сделай первый на странице матчей</p>
            ) : filteredPredictions.length === 0 ? (
              <p className={styles.muted}>Нет прогнозов в этой категории</p>
            ) : (
              <ul className={styles.predictionList}>
                {filteredPredictions.map((prediction) => (
                  <PredictionHistoryItem
                    key={prediction.id}
                    prediction={prediction}
                    savedAtLabel={prediction.savedAt ? formatSavedAt(prediction.savedAt) : ''}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionTitle}>Друзья</p>
              <Link className={styles.link} to="/friends">
                Открыть
              </Link>
            </div>
            {incomingFriendRequestsCount > 0 ? (
              <Link className={styles.friendNotice} to="/friends">
                {incomingFriendRequestsCount === 1
                  ? '1 заявка в друзья ждёт решения'
                  : `${incomingFriendRequestsCount} заявок в друзья ждут решения`}
              </Link>
            ) : (
              <p className={styles.muted}>Добавляй друзей и играй вместе</p>
            )}
          </div>
        </div>
      ) : null}
    </Screen>
  );
};
