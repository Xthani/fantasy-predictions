import { useState } from 'react';
import type { Match } from '@/shared/types/match';
import { Button } from '@/shared/ui/Button/Button';
import styles from './QuickScoreSheet.module.css';

type QuickScoreSheetProps = {
  match: Match;
  initialHome: number;
  initialAway: number;
  onSave: (homeScore: number, awayScore: number) => void;
  onClose: () => void;
};

const clampScore = (value: number) => Math.min(9, Math.max(0, value));

export const QuickScoreSheet = ({
  match,
  initialHome,
  initialAway,
  onSave,
  onClose,
}: QuickScoreSheetProps) => {
  const [home, setHome] = useState(initialHome);
  const [away, setAway] = useState(initialAway);

  const changeHome = (delta: number) => setHome((v) => clampScore(v + delta));
  const changeAway = (delta: number) => setAway((v) => clampScore(v + delta));

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
        <p className={styles.subtitle}>Точный счёт — главный прогноз матча</p>

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
                onChange={(e) => setHome(clampScore(Number(e.target.value) || 0))}
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
                onChange={(e) => setAway(clampScore(Number(e.target.value) || 0))}
                aria-label={`Счёт ${match.awayTeam}`}
              />
              <button type="button" className={styles.stepBtn} onClick={() => changeAway(1)}>
                +
              </button>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button fullWidth onClick={() => onSave(home, away)}>
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
