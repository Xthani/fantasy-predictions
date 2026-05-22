import styles from './OnboardingStepper.module.css';

type OnboardingStepperProps = {
  current: number;
  total: number;
};

export const OnboardingStepper = ({ current, total }: OnboardingStepperProps) => (
  <div className={styles.stepper} aria-label={`Шаг ${current} из ${total}`}>
    <div className={styles.track}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        return (
          <span key={step} style={{ display: 'contents' }}>
            {i > 0 ? <span className={styles.line} /> : null}
            <span className={`${styles.dot} ${isActive ? styles.dotActive : ''}`} />
          </span>
        );
      })}
    </div>
    <p className={styles.caption}>
      Шаг {current} из {total}
    </p>
  </div>
);
