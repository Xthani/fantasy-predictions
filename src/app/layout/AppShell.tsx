import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

type AppShellProps = {
  children: ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => (
  <div className={styles.shell}>
    <div className={styles.inner}>
      <main className={styles.content}>{children}</main>
    </div>
  </div>
);
