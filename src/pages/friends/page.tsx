import { Link } from 'react-router-dom';
import { useFriendsPage } from '@/features/friends';
import { Button } from '@/shared/ui/Button/Button';
import { PageLoading } from '@/shared/ui/PageLoading/PageLoading';
import { Screen } from '@/shared/ui/Screen/Screen';
import { SearchField } from '@/shared/ui/SearchField/SearchField';
import styles from './page.module.css';

const getUserTitle = (login: string, displayName?: string | null) =>
  displayName ? `${displayName} (@${login})` : `@${login}`;

export const FriendsPage = () => {
  const {
    status,
    error,
    retry,
    friends,
    incoming,
    outgoing,

    query,
    setQuery,
    runSearch,
    searchResults,
    searchStatus,
    searchError,

    actionStatus,
    actionError,
    sendRequestToUser,
    acceptRequest,
    declineRequest,
    removeFriendFromUser,

    friendIds,
    outgoingToUserIds,
    incomingFromUserIds,
  } = useFriendsPage();

  return (
    <Screen
      eyebrow="Социальное"
      title="Друзья"
      subtitle="Добавляй людей и играй вместе"
      footer={
        <div className={styles.errors}>
          {actionError ? <p className={styles.stateMessage}>{actionError}</p> : null}
        </div>
      }
    >
      {status === 'loading' ? <PageLoading /> : null}

      {status === 'error' ? (
        <div className={styles.section}>
          <p className={styles.stateMessage}>{error ?? 'Не удалось загрузить друзей'}</p>
          <Button type="button" onClick={retry}>
            Повторить
          </Button>
          <Link className={styles.backLink} to="/profile">
            ← В профиль
          </Link>
        </div>
      ) : null}

      {status === 'success' ? (
        <div className={styles.stack}>
          <div className={styles.section}>
            <p className={styles.sectionTitle}>Найти человека</p>
            <div className={styles.row}>
              <div className={styles.grow}>
                <SearchField
                  value={query}
                  placeholder="Логин или имя…"
                  onChange={(value) => setQuery(value)}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                disabled={searchStatus === 'loading'}
                onClick={() => void runSearch()}
              >
                {searchStatus === 'loading' ? 'Ищем…' : 'Найти'}
              </Button>
            </div>

            {searchStatus === 'error' ? (
              <p className={styles.stateMessage}>{searchError ?? 'Ошибка поиска'}</p>
            ) : null}

            {searchStatus === 'success' && searchResults.length === 0 ? (
              <p className={styles.muted}>Никого не нашли</p>
            ) : null}

            {searchResults.length > 0 ? (
              <ul className={styles.list}>
                {searchResults.map((user) => {
                  const isFriend = friendIds.has(user.id);
                  const hasOutgoing = outgoingToUserIds.has(user.id);
                  const hasIncoming = incomingFromUserIds.has(user.id);

                  const label = isFriend
                    ? 'Уже в друзьях'
                    : hasOutgoing
                      ? 'Заявка отправлена'
                      : hasIncoming
                        ? 'Есть входящая'
                        : 'Добавить';

                  const disabled =
                    isFriend ||
                    hasOutgoing ||
                    hasIncoming ||
                    actionStatus === 'loading' ||
                    searchStatus === 'loading';

                  return (
                    <li key={user.id} className={styles.userRow}>
                      <div className={styles.userText}>
                        <Link className={styles.login} to={`/users/${user.id}`}>
                          {getUserTitle(user.login, user.displayName)}
                        </Link>
                        {user.displayName ? (
                          <span className={styles.displayName}>Логин: {user.login}</span>
                        ) : null}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        disabled={disabled}
                        onClick={() => void sendRequestToUser(user.id)}
                        title={label}
                      >
                        {actionStatus === 'loading' ? '…' : label}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Входящие заявки</p>
            {incoming.length === 0 ? (
              <p className={styles.muted}>Пока нет входящих заявок</p>
            ) : (
              <ul className={styles.list}>
                {incoming.map((req) => (
                  <li key={req.id} className={styles.userRow}>
                    <div className={styles.userText}>
                      <Link className={styles.login} to={`/users/${req.fromUser.id}`}>
                        {getUserTitle(req.fromUser.login, req.fromUser.displayName)}
                      </Link>
                      <span className={styles.displayName}>Хочет добавить тебя в друзья</span>
                    </div>
                    <div className={styles.row}>
                      <Button
                        type="button"
                        disabled={actionStatus === 'loading'}
                        onClick={() => void acceptRequest(req.id)}
                      >
                        Принять
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={actionStatus === 'loading'}
                        onClick={() => void declineRequest(req.id)}
                      >
                        Отклонить
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Исходящие заявки</p>
            {outgoing.length === 0 ? (
              <p className={styles.muted}>Пока нет исходящих заявок</p>
            ) : (
              <ul className={styles.list}>
                {outgoing.map((req) => (
                  <li key={req.id} className={styles.userRow}>
                    <div className={styles.userText}>
                      <Link className={styles.login} to={`/users/${req.toUser.id}`}>
                        {getUserTitle(req.toUser.login, req.toUser.displayName)}
                      </Link>
                      <span className={styles.displayName}>Ожидает подтверждения</span>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={actionStatus === 'loading'}
                      onClick={() => void declineRequest(req.id)}
                    >
                      Отменить
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Мои друзья</p>
            {friends.length === 0 ? (
              <p className={styles.muted}>Пока друзей нет — найди кого-нибудь сверху</p>
            ) : (
              <ul className={styles.list}>
                {friends.map((u) => (
                  <li key={u.id} className={styles.userRow}>
                    <div className={styles.userText}>
                      <Link className={styles.login} to={`/users/${u.id}`}>
                        {getUserTitle(u.login, u.displayName)}
                      </Link>
                      {u.displayName ? (
                        <span className={styles.displayName}>Логин: {u.login}</span>
                      ) : null}
                    </div>
                    <details className={styles.moreMenu}>
                      <summary className={styles.moreButton} aria-label="Действия с другом">
                        …
                      </summary>
                      <div className={styles.morePanel}>
                        <button
                          type="button"
                          className={styles.dangerAction}
                          disabled={actionStatus === 'loading'}
                          onClick={() => void removeFriendFromUser(u.id)}
                        >
                          Удалить из друзей
                        </button>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {actionError ? <p className={styles.stateMessage}>{actionError}</p> : null}

          <Link className={styles.backLink} to="/profile">
            ← В профиль
          </Link>
        </div>
      ) : null}
    </Screen>
  );
};
