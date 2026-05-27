import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useProfilePage } from '@/pages/profile/model/useProfilePage';
import { Button } from '@/shared/ui/Button/Button';
import { PageLoading } from '@/shared/ui/PageLoading/PageLoading';
import { Screen } from '@/shared/ui/Screen/Screen';
import styles from './page.module.css';

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

  const leagues = data?.leagues ?? [];
  const clubs = data?.clubs ?? [];
  const predictions = data?.predictions ?? [];

  const leaguesLabel = useMemo(
    () => (leagues.length > 0 ? `${leagues.length}` : '0'),
    [leagues.length],
  );
  const clubsLabel = useMemo(() => (clubs.length > 0 ? `${clubs.length}` : '0'), [clubs.length]);

  return (
    <Screen
      eyebrow="Профиль"
      title={user?.displayName || user?.login || 'Игрок'}
      subtitle="Тут будут твой прогресс, рейтинг и история"
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
              <p className={styles.kpiLabel}>Лиги</p>
              <p className={styles.kpiValue}>{leaguesLabel}</p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Клубы</p>
              <p className={styles.kpiValue}>{clubsLabel}</p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Прогнозы</p>
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

            {predictions.length === 0 ? (
              <p className={styles.muted}>Пока нет прогнозов — сделай первый на странице матчей</p>
            ) : (
              <ul className={styles.predictionList}>
                {predictions
                  .slice()
                  .sort((a, b) => (b.savedAt ?? '').localeCompare(a.savedAt ?? ''))
                  .map((p) => (
                    <li key={p.id} className={styles.predictionRow}>
                      <span className={styles.predictionScore}>
                        {p.homeScore}:{p.awayScore}
                      </span>
                      <span className={styles.predictionBody}>
                        <span className={styles.predictionTitle}>Матч {p.matchId}</span>
                        <span className={styles.predictionMeta}>
                          {p.savedAt ? formatSavedAt(p.savedAt) : '—'}
                        </span>
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </Screen>
  );
};
