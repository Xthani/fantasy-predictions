import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/layout/AppShell';
import { RequireAuth } from '@/features/auth/ui/RequireAuth';
import { LoginPage } from '@/pages/login/page';
import { OnboardingLeaguesPage } from '@/pages/onboarding-leagues/page';
import { OnboardingClubsPage } from '@/pages/onboarding-clubs/page';
import { MatchesPage } from '@/pages/matches/page';
import { getSession } from '@/features/auth/lib/sessionStorage';
import { getPreferences, isOnboardingComplete } from '@/features/onboarding/lib/preferencesStorage';

const RootRedirect = () => {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (isOnboardingComplete()) return <Navigate to="/matches" replace />;
  const { favoriteLeagueIds } = getPreferences();
  if (favoriteLeagueIds.length > 0) return <Navigate to="/onboarding/clubs" replace />;
  return <Navigate to="/onboarding/leagues" replace />;
};

export const App = () => (
  <BrowserRouter>
    <AppShell>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/onboarding/leagues"
          element={
            <RequireAuth>
              <OnboardingLeaguesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/onboarding/clubs"
          element={
            <RequireAuth>
              <OnboardingClubsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/matches"
          element={
            <RequireAuth>
              <MatchesPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  </BrowserRouter>
);
