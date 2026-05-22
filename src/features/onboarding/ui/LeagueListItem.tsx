import { LeagueCrest } from '@/features/onboarding/ui/LeagueCrest';
import type { League } from '@/shared/types/league';
import styles from './LeagueListItem.module.css';

type LeagueListItemProps = {
  league: League;
  selected: boolean;
  onToggle: (leagueId: string) => void;
};

export const LeagueListItem = ({ league, selected, onToggle }: LeagueListItemProps) => {
  const disabled = !league.isActive;

  return (
    <button
      type="button"
      className={[
        styles.item,
        selected ? styles.itemSelected : '',
        disabled ? styles.itemDisabled : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      onClick={() => onToggle(league.id)}
      aria-pressed={selected}
    >
      <LeagueCrest league={league} />
      <span className={styles.info}>
        <p className={styles.name}>{league.name}</p>
        <p className={styles.meta}>{league.countryName}</p>
      </span>
      {disabled ? (
        <span className={styles.badge}>Скоро</span>
      ) : (
        <span
          className={[styles.check, selected ? styles.checkSelected : ''].filter(Boolean).join(' ')}
          aria-hidden
        >
          ✓
        </span>
      )}
    </button>
  );
};
