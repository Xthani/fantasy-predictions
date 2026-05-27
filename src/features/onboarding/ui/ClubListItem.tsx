import type { FavoriteClub } from '@/shared/types/favoriteClub';
import styles from './ClubListItem.module.css';

type ClubListItemProps = {
  club: FavoriteClub;
  selected: boolean;
  onToggle: (clubId: string) => void;
};

const getFallbackLabel = (club: FavoriteClub): string =>
  club.name.trim().charAt(0).toUpperCase() || '?';

export const ClubListItem = ({ club, selected, onToggle }: ClubListItemProps) => (
  <button
    type="button"
    className={[styles.item, selected ? styles.itemSelected : ''].filter(Boolean).join(' ')}
    onClick={() => onToggle(club.id)}
    aria-pressed={selected}
  >
    <span className={styles.crest} aria-hidden>
      {club.crestUrl ? (
        <img className={styles.crestImg} src={club.crestUrl} alt="" loading="lazy" />
      ) : club.crestEmoji ? (
        <span className={styles.crestEmoji}>{club.crestEmoji}</span>
      ) : (
        <span className={styles.crestFallback}>{getFallbackLabel(club)}</span>
      )}
    </span>
    <span className={styles.info}>
      <p className={styles.name}>{club.name}</p>
      <p className={styles.meta}>{club.shortName}</p>
    </span>
    <span
      className={[styles.check, selected ? styles.checkSelected : ''].filter(Boolean).join(' ')}
      aria-hidden
    >
      ✓
    </span>
  </button>
);
