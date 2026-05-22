import type { FavoriteClub } from '@/shared/types/favoriteClub';
import styles from './ClubListItem.module.css';

type ClubListItemProps = {
  club: FavoriteClub;
  selected: boolean;
  onToggle: (clubId: string) => void;
};

export const ClubListItem = ({ club, selected, onToggle }: ClubListItemProps) => (
  <button
    type="button"
    className={[styles.item, selected ? styles.itemSelected : ''].filter(Boolean).join(' ')}
    onClick={() => onToggle(club.id)}
    aria-pressed={selected}
  >
    <span className={styles.crest} aria-hidden>
      {club.crestEmoji}
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
