import styles from './Toast.module.css';

type ToastProps = {
  message: string;
};

export const Toast = ({ message }: ToastProps) => (
  <div className={styles.toast} role="status" aria-live="polite">
    {message}
  </div>
);
