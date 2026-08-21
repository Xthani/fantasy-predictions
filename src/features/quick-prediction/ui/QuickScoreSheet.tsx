import type { Match } from '@/shared/types/match';
import { Button } from '@/shared/ui/Button/Button';
import {
  COMPONENT_LABELS,
  STYLE_LABELS,
  STYLE_OPTIONS,
  formatBtts,
  formatOutcome,
  formatTotalGoals,
} from '@/features/quick-prediction/lib/predictionLabels';
import { useQuickScoreSheet } from '@/features/quick-prediction/model/useQuickScoreSheet';
import type { PredictionStyle } from '@/features/quick-prediction/types/prediction';
import styles from './QuickScoreSheet.module.css';

export type QuickScoreSavePayload = {
  homeScore: number;
  awayScore: number;
  style: PredictionStyle;
  isOfficial: boolean;
};

type QuickScoreSheetProps = {
  match: Match;
  initialHome: number;
  initialAway: number;
  initialStyle?: PredictionStyle;
  initialIsOfficial?: boolean;
  onSave: (payload: QuickScoreSavePayload) => void;
  onClose: () => void;
};

const topEnergyEntries = (energyByComponent: Record<string, number>, limit = 4) =>
  Object.entries(energyByComponent)
    .sort(([, left], [, right]) => right - left)
    .slice(0, limit);

export const QuickScoreSheet = ({
  match,
  initialHome,
  initialAway,
  initialStyle,
  initialIsOfficial,
  onSave,
  onClose,
}: QuickScoreSheetProps) => {
  const {
    home,
    away,
    style,
    isOfficial,
    preview,
    previewStatus,
    changeHome,
    changeAway,
    setHomeScore,
    setAwayScore,
    setStyle,
    setIsOfficial,
  } = useQuickScoreSheet({
    initialHome,
    initialAway,
    initialStyle,
    initialIsOfficial,
  });

  return (
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.sheet}
        role="dialog"
        aria-labelledby="quick-score-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} />
        <h2 id="quick-score-title" className={styles.title}>
          Твой прогноз
        </h2>
        <p className={styles.subtitle}>
          Точный счёт — главный ввод. Стиль распределяет 100 энергии.
        </p>

        <div className={styles.scoreRow}>
          <div className={styles.teamCol}>
            <p className={styles.teamName}>{match.homeTeam}</p>
            <div className={styles.scoreControl}>
              <button type="button" className={styles.stepBtn} onClick={() => changeHome(-1)}>
                −
              </button>
              <input
                className={styles.scoreInput}
                type="number"
                min={0}
                max={9}
                value={home}
                onChange={(e) => setHomeScore(Number(e.target.value) || 0)}
                aria-label={`Счёт ${match.homeTeam}`}
              />
              <button type="button" className={styles.stepBtn} onClick={() => changeHome(1)}>
                +
              </button>
            </div>
          </div>

          <span className={styles.colon}>:</span>

          <div className={styles.teamCol}>
            <p className={styles.teamName}>{match.awayTeam}</p>
            <div className={styles.scoreControl}>
              <button type="button" className={styles.stepBtn} onClick={() => changeAway(-1)}>
                −
              </button>
              <input
                className={styles.scoreInput}
                type="number"
                min={0}
                max={9}
                value={away}
                onChange={(e) => setAwayScore(Number(e.target.value) || 0)}
                aria-label={`Счёт ${match.awayTeam}`}
              />
              <button type="button" className={styles.stepBtn} onClick={() => changeAway(1)}>
                +
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Стиль энергии</p>
          <div className={styles.styleRow}>
            {STYLE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={[styles.styleBtn, style === option ? styles.styleBtnActive : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setStyle(option)}
              >
                {STYLE_LABELS[option]}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.previewHeader}>
            <p className={styles.sectionLabel}>Компоненты из счёта</p>
            {preview ? (
              <span className={styles.maxPoints}>до {preview.maxPoints} очков</span>
            ) : null}
          </div>

          {previewStatus === 'loading' ? (
            <p className={styles.previewHint}>Считаем компоненты…</p>
          ) : null}
          {previewStatus === 'error' ? (
            <p className={styles.previewHint}>Не удалось загрузить превью</p>
          ) : null}

          {preview ? (
            <>
              <div className={styles.componentChips}>
                <span className={styles.chip}>
                  Исход: {formatOutcome(preview.components.matchOutcome)}
                </span>
                <span className={styles.chip}>
                  Тотал: {formatTotalGoals(preview.components.totalGoals)}
                </span>
                <span className={styles.chip}>ОЗ: {formatBtts(preview.components.btts)}</span>
                <span className={styles.chip}>
                  Счёт: {preview.components.exactScore.home}:{preview.components.exactScore.away}
                </span>
              </div>

              <ul className={styles.energyList}>
                {topEnergyEntries(preview.energyByComponent).map(([key, energy]) => (
                  <li key={key} className={styles.energyRow}>
                    <span className={styles.energyName}>{COMPONENT_LABELS[key] ?? key}</span>
                    <span className={styles.energyValue}>{energy}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <label className={styles.officialToggle}>
          <input
            type="checkbox"
            checked={isOfficial}
            onChange={(e) => setIsOfficial(e.target.checked)}
          />
          <span>
            <span className={styles.officialTitle}>Официальный прогноз</span>
            <span className={styles.officialHint}>
              Влияет на рейтинг. До 10 на тур, смена за 4 ч до старта.
            </span>
          </span>
        </label>

        <div className={styles.actions}>
          <Button
            fullWidth
            onClick={() => onSave({ homeScore: home, awayScore: away, style, isOfficial })}
          >
            Сохранить прогноз
          </Button>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
