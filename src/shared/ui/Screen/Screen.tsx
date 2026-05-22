import type { ReactNode } from 'react';
import styles from './Screen.module.css';

type ScreenProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export const Screen = ({ title, subtitle, eyebrow, children, footer }: ScreenProps) => (
  <section className={styles.screen}>
    <header className={styles.header}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </header>
    <div className={styles.body}>{children}</div>
    {footer ? <footer className={styles.footer}>{footer}</footer> : null}
  </section>
);
