import { Link, useParams } from 'react-router-dom';
import { FriendDuelsSection } from '@/features/friends';
import { useUserProfilePage } from '@/pages/user-profile/model/useUserProfilePage';
import { Button } from '@/shared/ui/Button/Button';
import { PageLoading } from '@/shared/ui/PageLoading/PageLoading';
import { Screen } from '@/shared/ui/Screen/Screen';
import styles from './page.module.css';

const statusLabels = {
  self: 'Это твой профиль',
  friend: 'У вас дружба',
  incoming: 'Есть входящая заявка',
  outgoing: 'Заявка отправлена',
  none: 'Пока не друзья',
};

export const UserProfilePage = () => {
  const { userId } = useParams();
  const {
    profile,
    status,
    error,
    retry,
    actionStatus,
    actionError,
    duels,
    actionLabel,
    sendRequest,
    removeCurrentFriend,
  } = useUserProfilePage(userId);

  const title = profile?.user.displayName || profile?.user.login || 'Игрок';
  const canSendRequest = profile?.friendshipStatus === 'none';

  return (
    <Screen eyebrow="Социальное" title={title} subtitle="Публичный профиль игрока">
      {status === 'loading' ? <PageLoading /> : null}

      {status === 'error' ? (
        <div className={styles.section}>
          <p className={styles.stateMessage}>{error ?? 'Не удалось загрузить профиль игрока'}</p>
          <Button type="button" onClick={retry}>
            Повторить
          </Button>
          <Link className={styles.backLink} to="/friends">
            ← К друзьям
          </Link>
        </div>
      ) : null}

      {status === 'success' && !profile ? (
        <p className={styles.stateMessage}>Профиль не найден</p>
      ) : null}

      {status === 'success' && profile ? (
        <div className={styles.stack}>
          <div className={styles.section}>
            <div className={styles.hero}>
              <p className={styles.login}>@{profile.user.login}</p>
              <span className={styles.status}>{statusLabels[profile.friendshipStatus]}</span>
              <div className={styles.actions}>
                {actionError ? <p className={styles.stateMessage}>{actionError}</p> : null}
                {profile.friendshipStatus === 'friend' ? (
                  <details className={styles.moreMenu}>
                    <summary className={styles.moreButton} aria-label="Действия с другом">
                      …
                    </summary>
                    <div className={styles.morePanel}>
                      <button
                        type="button"
                        className={styles.dangerAction}
                        disabled={actionStatus === 'loading'}
                        onClick={() => void removeCurrentFriend()}
                      >
                        Удалить из друзей
                      </button>
                    </div>
                  </details>
                ) : (
                  <Button
                    type="button"
                    disabled={!canSendRequest || actionStatus === 'loading'}
                    onClick={() => void sendRequest()}
                  >
                    {actionStatus === 'loading' ? 'Отправляем…' : actionLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.kpiRow}>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Офиц. рейтинг</p>
              <p className={styles.kpiValue}>{profile.stats.officialRating}</p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Форма</p>
              <p className={styles.kpiValue}>
                {profile.stats.form != null ? `${profile.stats.form}%` : '—'}
              </p>
            </div>
            <div className={styles.kpi}>
              <p className={styles.kpiLabel}>Прогнозы</p>
              <p className={styles.kpiValue}>{profile.stats.predictionsCount}</p>
            </div>
          </div>

          {profile.friendshipStatus === 'friend' && duels ? (
            <FriendDuelsSection
              data={duels}
              friendName={profile.user.displayName || profile.user.login}
            />
          ) : null}

          <Link className={styles.backLink} to="/friends">
            ← К друзьям
          </Link>
        </div>
      ) : null}
    </Screen>
  );
};
