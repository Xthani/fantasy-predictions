import type { PredictionDto } from '@/features/quick-prediction';
import { COMPONENT_LABELS, STYLE_LABELS } from '@/features/quick-prediction';
import { formatKickoff } from '@/shared/utils/formatKickoff';
import { getResultDurationNote, getScoringPeriodLabel } from '@/shared/utils/matchScoring';
import { getPredictionOutcome, hasMatchResult } from '@/shared/utils/predictionOutcome';
import styles from '../page.module.css';

type PredictionHistoryItemProps = {
  prediction: PredictionDto;
  savedAtLabel: string;
};

const topComponentResults = (prediction: PredictionDto, limit = 4) => {
  if (!prediction.componentResults?.length) return [];
  return [...prediction.componentResults]
    .sort((left, right) => right.points - left.points)
    .slice(0, limit);
};

export const PredictionHistoryItem = ({ prediction, savedAtLabel }: PredictionHistoryItemProps) => {
  const showResult = hasMatchResult(prediction.match);
  const exactOutcome = getPredictionOutcome(
    prediction.homeScore,
    prediction.awayScore,
    prediction.match,
  );
  const resultDurationNote = getResultDurationNote(prediction.match.resultDuration);
  const componentResults = topComponentResults(prediction);

  return (
    <li className={styles.predictionRow}>
      <span className={styles.predictionScore}>
        {prediction.homeScore}:{prediction.awayScore}
      </span>
      <span className={styles.predictionBody}>
        <span className={styles.predictionTitle}>
          {prediction.match.homeTeam} — {prediction.match.awayTeam}
        </span>
        <span className={styles.predictionMeta}>
          {prediction.match.competition}
          {prediction.match.kickoffAt ? ` · ${formatKickoff(prediction.match.kickoffAt)}` : ''}
          {savedAtLabel ? ` · сохранён ${savedAtLabel}` : ''}
        </span>

        <span className={styles.predictionTags}>
          <span className={styles.predictionTag}>{STYLE_LABELS[prediction.style]}</span>
          {prediction.isOfficial ? (
            <span className={[styles.predictionTag, styles.predictionTagOfficial].join(' ')}>
              Официальный
            </span>
          ) : (
            <span className={styles.predictionTagMuted}>Теневой</span>
          )}
        </span>

        {showResult ? (
          <>
            <span className={styles.predictionResultRow}>
              <span className={styles.predictionResultScore}>
                Результат {prediction.match.homeResultScore}:{prediction.match.awayResultScore} (
                {getScoringPeriodLabel()})
              </span>
              {prediction.totalPoints != null ? (
                <span className={styles.predictionPoints}>{prediction.totalPoints} очков</span>
              ) : (
                <span
                  className={[
                    styles.predictionOutcome,
                    exactOutcome === 'exact' ? styles.predictionOutcomeExact : '',
                    exactOutcome === 'miss' ? styles.predictionOutcomeMiss : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {exactOutcome === 'exact' ? 'Точный счёт' : 'Не угадал'}
                </span>
              )}
            </span>

            {componentResults.length > 0 ? (
              <ul className={styles.componentResults}>
                {componentResults.map((item) => (
                  <li
                    key={item.component}
                    className={[
                      styles.componentResult,
                      item.correct ? styles.componentResultHit : styles.componentResultMiss,
                    ].join(' ')}
                  >
                    <span>{COMPONENT_LABELS[item.component] ?? item.component}</span>
                    <span>{item.points > 0 ? `+${item.points}` : '0'}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <span className={styles.predictionPending}>Ожидаем результат</span>
        )}

        {resultDurationNote ? (
          <span className={styles.predictionDurationNote}>{resultDurationNote}</span>
        ) : null}
      </span>
    </li>
  );
};
