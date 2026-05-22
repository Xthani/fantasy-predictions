import styles from './LeagueFilterChips.module.css';

export type LeagueFilterOption = {
  id: string;
  label: string;
};

type LeagueFilterChipsProps = {
  options: LeagueFilterOption[];
  activeId: string;
  onChange: (id: string) => void;
};

export const LeagueFilterChips = ({ options, activeId, onChange }: LeagueFilterChipsProps) => (
  <div className={styles.row} role="tablist" aria-label="Фильтр лиг">
    {options.map((option) => (
      <button
        key={option.id}
        type="button"
        role="tab"
        aria-selected={activeId === option.id}
        className={[styles.chip, activeId === option.id ? styles.chipActive : '']
          .filter(Boolean)
          .join(' ')}
        onClick={() => onChange(option.id)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
