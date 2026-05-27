import { Link, Navigate } from 'react-router-dom';
import { MatchCard } from '@/features/match-feed/ui/MatchCard';
import { OnboardingStepper } from '@/features/onboarding/ui/OnboardingStepper';
import { QuickScoreSheet } from '@/features/quick-prediction/ui/QuickScoreSheet';
import { useMatchesPage } from '@/pages/matches/model/useMatchesPage';
import { Button } from '@/shared/ui/Button/Button';
import { Screen } from '@/shared/ui/Screen/Screen';
import styles from './page.module.css';

export const MatchesPage = () => {
  const {
    hasLeagues,
    hasClubs,
    matches,
    loadStatus,
    loadError,
    retryLoad,
    predictionsByMatchId,
    activeMatch,
    activePrediction,
    openMatch,
    closeSheet,
    saveMatchPrediction,
    saveError,
    isSaving,
    isFavoriteClub,
  } = useMatchesPage();

  if (!hasLeagues) {
    return <Navigate to="/onboarding/leagues" replace />;
  }

  if (!hasClubs) {
    return <Navigate to="/onboarding/clubs" replace />;
  }

  return (
    <>
      <Screen
        eyebrow="Онбординг"
        title="Матчи недели"
        subtitle="До 10 ближайших матчей твоих лиг и клубов"
        footer={<OnboardingStepper current={3} total={3} />}
      >
        {loadStatus === 'loading' ? <p className={styles.stateMessage}>Загружаем матчи…</p> : null}

        {loadStatus === 'error' ? (
          <div className={styles.stateBlock}>
            <p className={styles.stateMessage}>{loadError}</p>
            <Button type="button" onClick={retryLoad}>
              Повторить
            </Button>
          </div>
        ) : null}

        {loadStatus === 'success' && matches.length === 0 ? (
          <p className={styles.empty}>
            Пока нет открытых матчей по твоим лигам и клубам. Проверь выбор в онбординге.
          </p>
        ) : null}

        {loadStatus === 'success' && matches.length > 0 ? (
          <ul className={styles.list}>
            {matches.map((match) => {
              const prediction = predictionsByMatchId[match.id] ?? null;
              const isFavorite =
                isFavoriteClub(match.homeClubId) || isFavoriteClub(match.awayClubId);

              return (
                <li key={match.id}>
                  <MatchCard
                    match={match}
                    prediction={prediction}
                    isFavorite={isFavorite}
                    onOpen={openMatch}
                  />
                </li>
              );
            })}
          </ul>
        ) : null}

        <Link className={styles.backLink} to="/onboarding/clubs">
          ← Назад к клубам
        </Link>
      </Screen>

      {activeMatch ? (
        <>
          <QuickScoreSheet
            match={activeMatch}
            initialHome={activePrediction?.homeScore ?? 0}
            initialAway={activePrediction?.awayScore ?? 0}
            onSave={(homeScore, awayScore) => void saveMatchPrediction(homeScore, awayScore)}
            onClose={closeSheet}
          />
          {saveError ? <p className={styles.sheetError}>{saveError}</p> : null}
          {isSaving ? <p className={styles.sheetSaving}>Сохраняем…</p> : null}
        </>
      ) : null}
    </>
  );
};
