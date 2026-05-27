import { Link, Navigate } from 'react-router-dom';
import { OnboardingStepper } from '@/features/onboarding/ui/OnboardingStepper';
import { useMatchesPage } from '@/pages/matches/model/useMatchesPage';
import { Screen } from '@/shared/ui/Screen/Screen';
import styles from './page.module.css';

export const MatchesPage = () => {
  const { hasLeagues, hasClubs, selectedLeagues, isWaitingForBackend } = useMatchesPage();

  if (!hasLeagues) {
    return <Navigate to="/onboarding/leagues" replace />;
  }

  if (!hasClubs) {
    return <Navigate to="/onboarding/clubs" replace />;
  }

  return (
    <Screen
      eyebrow="Онбординг"
      title="Матчи недели"
      subtitle="Здесь появятся ближайшие матчи выбранных клубов и лиг"
      footer={<OnboardingStepper current={3} total={3} />}
    >
      <p className={styles.empty}>
        Шаг матчей пока недоступен: бэкенд ещё не отдаёт ленту матчей по выбранным лигам и клубам.
      </p>
      <p className={styles.hint}>
        Выбранные лиги сохранены в сессии (до перезагрузки страницы). После подключения API здесь
        можно будет проставить прогнозы.
      </p>
      {isWaitingForBackend ? (
        <ul className={styles.list}>
          {selectedLeagues.map((league) => (
            <li key={league.id} className={styles.leaguePreview}>
              {league.name}
            </li>
          ))}
        </ul>
      ) : null}
      <Link className={styles.backLink} to="/onboarding/clubs">
        ← Назад к клубам
      </Link>
    </Screen>
  );
};
