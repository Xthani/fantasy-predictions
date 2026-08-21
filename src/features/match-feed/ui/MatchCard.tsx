import type { Match } from '@/shared/types/match';
import type { QuickPrediction } from '@/shared/types/quickPrediction';
import { formatKickoff } from '@/shared/utils/formatKickoff';
import { getExtraTimeHint } from '@/shared/utils/matchScoring';
import styles from './MatchCard.module.css';

type MatchCardProps = {
  match: Match;
  prediction: QuickPrediction | null;
  isFavorite: boolean;
  onOpen: (matchId: string) => void;
};

const STYLE_SHORT: Record<string, string> = {
  defensive: 'Оборон.',
  balanced: 'Баланс',
  aggressive: 'Атака',
};

export const MatchCard = ({ match, prediction, isFavorite, onOpen }: MatchCardProps) => {
  const extraTimeHint = getExtraTimeHint(match);

  return (
    <button
      type="button"
      className={[
        styles.card,
        isFavorite ? styles.cardFavorite : '',
        prediction ? styles.cardHasPrediction : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onOpen(match.id)}
    >
      <div className={styles.topRow}>
        <p className={styles.kickoff}>{formatKickoff(match.kickoffAt)}</p>
        {prediction ? (
          <div className={styles.badges}>
            {prediction.isOfficial ? <span className={styles.badgeOfficial}>Офиц.</span> : null}
            {prediction.style ? (
              <span className={styles.badge}>
                {STYLE_SHORT[prediction.style] ?? prediction.style}
              </span>
            ) : (
              <span className={styles.badge}>Прогноз</span>
            )}
          </div>
        ) : null}
      </div>
      <div className={styles.teams}>
        <p className={styles.team}>{match.homeTeam}</p>
        <span className={styles.vs}>VS</span>
        <p className={`${styles.team} ${styles.teamAway}`}>{match.awayTeam}</p>
      </div>
      {prediction ? (
        <p className={styles.scorePreview}>
          {prediction.homeScore} : {prediction.awayScore}
        </p>
      ) : (
        <p className={styles.competition}>{match.competition}</p>
      )}
      {extraTimeHint ? <p className={styles.extraTimeHint}>{extraTimeHint}</p> : null}
    </button>
  );
};
