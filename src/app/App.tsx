import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/app/layout/AppShell';
import { useAuth } from '@/features/auth/model/authContext';
import { PageLoading } from '@/shared/ui/PageLoading/PageLoading';
import { RequireAuth } from '@/features/auth/ui/RequireAuth';
import { LoginPage } from '@/pages/login/page';
import { OnboardingLeaguesPage } from '@/pages/onboarding-leagues/page';
import { OnboardingClubsPage } from '@/pages/onboarding-clubs/page';
import { MatchesPage } from '@/pages/matches/page';

const RootRedirect = () => {
  const { status, user } = useAuth();

  if (status === 'idle' || status === 'loading') return <PageLoading />;
  if (!user) return <Navigate to="/login" replace />;
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
