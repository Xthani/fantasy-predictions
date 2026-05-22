import { Link, Navigate } from 'react-router-dom';
import { isOnboardingComplete } from '@/features/onboarding/lib/preferencesStorage';
import { OnboardingStepper } from '@/features/onboarding/ui/OnboardingStepper';
import { LeagueFilterChips } from '@/features/match-feed/ui/LeagueFilterChips';
import { MatchCard } from '@/features/match-feed/ui/MatchCard';
import { QuickScoreSheet } from '@/features/quick-prediction/ui/QuickScoreSheet';
import { useMatchesPage } from '@/pages/matches/model/useMatchesPage';
import { Screen } from '@/shared/ui/Screen/Screen';
import { Toast } from '@/shared/ui/Toast/Toast';
import styles from './page.module.css';

export const MatchesPage = () => {
  const {
    hasLeagues,
    isEmpty,
    filterOptions,
    leagueFilter,
    setLeagueFilter,
    visibleMatches,
    predictionByMatchId,
    isFavoriteMatch,
    openMatch,
    closeSheet,
    saveScore,
    activeMatch,
    activePrediction,
    toast,
  } = useMatchesPage();

  if (!hasLeagues) {
    return <Navigate to="/onboarding/leagues" replace />;
  }

  if (!isOnboardingComplete()) {
    return <Navigate to="/onboarding/clubs" replace />;
  }

  return (
    <>
      <Screen
        eyebrow="Онбординг"
        title="Матчи недели"
        subtitle="Нажми на матч и укажи точный счёт"
        footer={<OnboardingStepper current={3} total={3} />}
      >
        <p className={styles.hint}>Матчи любимых лиг · золотая обводка — твои клубы</p>

        {filterOptions.length > 1 ? (
          <LeagueFilterChips
            options={filterOptions}
            activeId={leagueFilter}
            onChange={setLeagueFilter}
          />
        ) : null}

        {isEmpty ? (
          <p className={styles.empty}>
            Нет матчей для выбранных лиг. Измени фильтр или добавь лиги.
          </p>
        ) : (
          <ul className={styles.list}>
            {visibleMatches.map((match) => (
              <li key={match.id}>
                <MatchCard
                  match={match}
                  prediction={predictionByMatchId(match.id)}
                  isFavorite={isFavoriteMatch(match)}
                  onOpen={openMatch}
                />
              </li>
            ))}
          </ul>
        )}

        <Link className={styles.backLink} to="/onboarding/clubs">
          ← Изменить клубы и лиги
        </Link>
      </Screen>

      {activeMatch ? (
        <QuickScoreSheet
          match={activeMatch}
          initialHome={activePrediction?.homeScore ?? 0}
          initialAway={activePrediction?.awayScore ?? 0}
          onSave={saveScore}
          onClose={closeSheet}
        />
      ) : null}

      {toast ? <Toast message={toast} /> : null}
    </>
  );
};
