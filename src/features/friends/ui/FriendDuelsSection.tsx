import { STYLE_LABELS } from '@/features/quick-prediction';
import type { FriendDuelsResponse, FriendDuelItem } from '@/features/friends/api/friendDuels';
import { formatKickoff } from '@/shared/utils/formatKickoff';
import styles from './FriendDuelsSection.module.css';

type FriendDuelsSectionProps = {
  data: FriendDuelsResponse;
  friendName: string;
};

const outcomeLabels: Record<FriendDuelItem['outcome'], string> = {
  win: 'Ты впереди',
  loss: 'Друг впереди',
  draw: 'Ничья',
  pending: 'Ждём матч',
};

const outcomeClass: Record<FriendDuelItem['outcome'], string> = {
  win: styles.outcomeWin,
  loss: styles.outcomeLoss,
  draw: styles.outcomeDraw,
  pending: styles.outcomePending,
};

const formatPoints = (points: number | null) => (points == null ? '—' : `${points}`);

export const FriendDuelsSection = ({ data, friendName }: FriendDuelsSectionProps) => {
  const { summary, duels } = data;

  if (summary.sharedMatches === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Сравнение прогнозов</h2>
        <p className={styles.empty}>
          Пока нет общих матчей — сделайте прогнозы на одни и те же игры, и здесь появится
          соревнование.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Сравнение прогнозов</h2>
        <p className={styles.subtitle}>
          Общие матчи с {friendName}: кто набрал больше очков после игры
        </p>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Твои победы</p>
          <p className={styles.summaryValue}>{summary.myWins}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Ничьи</p>
          <p className={styles.summaryValue}>{summary.draws}</p>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.summaryLabel}>Победы друга</p>
          <p className={styles.summaryValue}>{summary.friendWins}</p>
        </div>
      </div>

      {summary.finishedDuels > 0 ? (
        <p className={styles.pointsTotal}>
          Очки на общих матчах: <strong>ты {summary.myTotalPoints}</strong> ·{' '}
          <strong>{friendName} {summary.friendTotalPoints}</strong>
        </p>
      ) : null}

      {summary.pending > 0 ? (
        <p className={styles.pendingNote}>{summary.pending} матч(ей) ещё не сыграно</p>
      ) : null}

      <ul className={styles.list}>
        {duels.map((duel) => (
          <li key={duel.match.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div>
                <p className={styles.matchTitle}>
                  {duel.match.homeTeam} — {duel.match.awayTeam}
                </p>
                <p className={styles.matchMeta}>
                  {duel.match.competition}
                  {duel.match.kickoffAt ? ` · ${formatKickoff(duel.match.kickoffAt)}` : ''}
                </p>
              </div>
              <span className={[styles.outcome, outcomeClass[duel.outcome]].join(' ')}>
                {outcomeLabels[duel.outcome]}
              </span>
            </div>

            <div className={styles.compareRow}>
              <div className={styles.side}>
                <p className={styles.sideLabel}>Ты</p>
                <p className={styles.sideScore}>
                  {duel.me.homeScore}:{duel.me.awayScore}
                </p>
                <p className={styles.sideMeta}>{STYLE_LABELS[duel.me.style]}</p>
                <p className={styles.sidePoints}>{formatPoints(duel.me.totalPoints)} очк.</p>
              </div>

              <span className={styles.vs}>VS</span>

              <div className={styles.side}>
                <p className={styles.sideLabel}>{friendName}</p>
                <p
                  className={[
                    styles.sideScore,
                    duel.outcome === 'pending' ? styles.sideScoreBlurred : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden={duel.outcome === 'pending'}
                >
                  {duel.friend.homeScore}:{duel.friend.awayScore}
                </p>
                <p className={styles.sideMeta}>{STYLE_LABELS[duel.friend.style]}</p>
                <p className={styles.sidePoints}>{formatPoints(duel.friend.totalPoints)} очк.</p>
              </div>
            </div>

            {duel.match.status === 'finished' &&
            duel.match.homeResultScore != null &&
            duel.match.awayResultScore != null ? (
              <p className={styles.resultLine}>
                Результат 90 мин: {duel.match.homeResultScore}:{duel.match.awayResultScore}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
