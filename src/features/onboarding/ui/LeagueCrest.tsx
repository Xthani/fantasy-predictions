import type { League } from '@/shared/types/league';
import styles from './LeagueCrest.module.css';

type LeagueCrestProps = {
  league: League;
};

const getFallbackLabel = (league: League): string =>
  league.name.trim().charAt(0).toUpperCase() || '?';

export const LeagueCrest = ({ league }: LeagueCrestProps) => {
  if (league.crestUrl) {
    return (
      <span className={[styles.frame, styles.frameLogo].join(' ')} aria-hidden>
        <img className={styles.img} src={league.crestUrl} alt="" loading="lazy" />
      </span>
    );
  }

  if (league.crestEmoji) {
    return (
      <span className={[styles.frame, styles.frameFallback].join(' ')} aria-hidden>
        <span className={styles.emoji}>{league.crestEmoji}</span>
      </span>
    );
  }

  return (
    <span className={[styles.frame, styles.frameFallback].join(' ')} aria-hidden>
      <span className={styles.fallback}>{getFallbackLabel(league)}</span>
    </span>
  );
};
