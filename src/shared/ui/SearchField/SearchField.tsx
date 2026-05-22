import styles from './SearchField.module.css';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const SearchField = ({ value, onChange, placeholder = 'Поиск' }: SearchFieldProps) => (
  <div className={styles.wrap}>
    <span className={styles.icon} aria-hidden>
      ⌕
    </span>
    <input
      className={styles.input}
      type="search"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
    />
  </div>
);
