import styles from './PageLoading.module.css';

export const PageLoading = () => (
  <p className={styles.message} role="status">
    Загрузка…
  </p>
);
