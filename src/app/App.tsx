import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/layout/AppShell';
import { PageLoading } from '@/shared/ui/PageLoading/PageLoading';
import { RequireAuth, useAuth } from '@/features/auth';
import {
  getOnboardingTarget,
  loadOnboardingProgress,
  onboardingStorage,
  RequireOnboarding,
  useOnboarding,
} from '@/features/onboarding';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import { LoginPage } from '@/pages/login/page';
import { OnboardingLeaguesPage } from '@/pages/onboarding-leagues/page';
import { OnboardingClubsPage } from '@/pages/onboarding-clubs/page';
import { MatchesPage } from '@/pages/matches/page';
import { ProfilePage } from '@/pages/profile/page';

const skipProgressRequest = async () => null;
const getProgressLoadErrorMessage = () => 'Не удалось загрузить прогресс';

const RootRedirect = () => {
  const { status, user } = useAuth();
  const { favoriteLeagues, favoriteClubIds } = useOnboarding();

  const shouldLoadProgress = status === 'authenticated' && Boolean(user);
  const { data: progress, status: progressStatus } = useAsyncRequest({
    request: shouldLoadProgress ? loadOnboardingProgress : skipProgressRequest,
    mapError: getProgressLoadErrorMessage,
  });

  if (status === 'idle' || status === 'loading') return <PageLoading />;
  if (!user) return <Navigate to="/login" replace />;

  const localTarget = getOnboardingTarget({
    favoriteLeagueIds: favoriteLeagues.map((league) => league.id),
    favoriteClubIds,
    hasLeagues: favoriteLeagues.length > 0,
    hasClubs: favoriteClubIds.length > 0,
    hasAnyPrediction: onboardingStorage.readHasAnyPrediction(),
  });

  if (localTarget !== '/onboarding/leagues') {
    return <Navigate to={localTarget} replace />;
  }

  if (progressStatus === 'loading') return <PageLoading />;
  if (!progress) return <Navigate to="/onboarding/leagues" replace />;

  return <Navigate to={getOnboardingTarget(progress)} replace />;
};

const OnboardingSessionSync = () => {
  const { status } = useAuth();
  const { resetOnboarding } = useOnboarding();

  useEffect(() => {
    if (status === 'unauthenticated') {
      resetOnboarding();
    }
  }, [resetOnboarding, status]);

  return null;
};

export const App = () => (
  <BrowserRouter>
    <AppShell>
      <OnboardingSessionSync />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/onboarding/leagues"
          element={
            <RequireAuth>
              <RequireOnboarding allow="/onboarding/leagues">
                <OnboardingLeaguesPage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />
        <Route
          path="/onboarding/clubs"
          element={
            <RequireAuth>
              <RequireOnboarding allow="/onboarding/clubs">
                <OnboardingClubsPage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />
        <Route
          path="/matches"
          element={
            <RequireAuth>
              <RequireOnboarding allow="/matches">
                <MatchesPage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <RequireOnboarding allow="/profile">
                <ProfilePage />
              </RequireOnboarding>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  </BrowserRouter>
);
