import { useCallback, useRef, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  getOnboardingTarget,
  loadOnboardingProgress,
  type OnboardingTarget,
} from '@/features/onboarding/model/onboardingProgress';
import { fetchLeagues } from '@/features/onboarding/api/leagues';
import { onboardingStorage } from '@/features/onboarding/lib/onboardingStorage';
import { useOnboarding } from '@/features/onboarding/model/onboardingContext';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import { PageLoading } from '@/shared/ui/PageLoading/PageLoading';
import { Button } from '@/shared/ui/Button/Button';
import { Screen } from '@/shared/ui/Screen/Screen';

type RequireOnboardingProps = {
  children: ReactNode;
  allow?: OnboardingTarget;
};

const getProgressLoadErrorMessage = () => 'Не удалось загрузить прогресс онбординга';

export const RequireOnboarding = ({ children, allow }: RequireOnboardingProps) => {
  const location = useLocation();
  const { favoriteLeagues, favoriteClubIds, setFavoriteLeagues, setFavoriteClubIds } =
    useOnboarding();
  const hydratedKeyRef = useRef<string | null>(null);

  const hydrateContext = useCallback(
    async (progress: Awaited<ReturnType<typeof loadOnboardingProgress>>) => {
      setFavoriteClubIds(progress.favoriteClubIds);

      if (progress.favoriteLeagueIds.length === 0) {
        setFavoriteLeagues([]);
        hydratedKeyRef.current = '';
        return;
      }

      const key = progress.favoriteLeagueIds.slice().sort().join('|');
      if (hydratedKeyRef.current === key) return;

      const wanted = new Set(progress.favoriteLeagueIds);
      const found = new Map<string, { id: string; name: string }>();

      let offset = 0;
      let hasMore = true;
      while (hasMore && found.size < wanted.size) {
        const page = await fetchLeagues({ offset, limit: 50 });
        for (const league of page.leagues) {
          if (wanted.has(league.id)) found.set(league.id, { id: league.id, name: league.name });
        }
        hasMore = page.pagination.hasMore;
        offset += page.pagination.limit;
        if (page.leagues.length === 0) break;
      }

      setFavoriteLeagues(
        progress.favoriteLeagueIds.map((id) => found.get(id) ?? { id, name: id }).filter(Boolean),
      );
      hydratedKeyRef.current = key;
    },
    [setFavoriteClubIds, setFavoriteLeagues],
  );

  const {
    data: progress,
    status,
    error,
    retry,
  } = useAsyncRequest({
    request: loadOnboardingProgress,
    mapError: getProgressLoadErrorMessage,
    onSuccess: (data) => void hydrateContext(data),
  });

  const localProgress = {
    favoriteLeagueIds: favoriteLeagues.map((league) => league.id),
    favoriteClubIds,
    hasLeagues: favoriteLeagues.length > 0,
    hasClubs: favoriteClubIds.length > 0,
    hasAnyPrediction: onboardingStorage.readHasAnyPrediction(),
  };

  const canOpenFromLocal =
    !allow ||
    allow === '/onboarding/leagues' ||
    (allow === '/onboarding/clubs' && localProgress.hasLeagues) ||
    (allow === '/matches' && localProgress.hasLeagues && localProgress.hasClubs) ||
    (allow === '/profile' &&
      localProgress.hasLeagues &&
      localProgress.hasClubs &&
      localProgress.hasAnyPrediction);

  if (canOpenFromLocal) return children;

  if (status === 'loading') return <PageLoading />;
  if (status === 'error' || !progress) {
    return (
      <Screen
        eyebrow="Онбординг"
        title="Не удалось загрузить данные"
        subtitle={error ?? 'Попробуй ещё раз'}
        footer={
          <Button type="button" onClick={retry} fullWidth>
            Повторить
          </Button>
        }
      >
        <p />
      </Screen>
    );
  }

  const target = getOnboardingTarget(progress);

  if (allow) {
    const cameFromOnboardingAction =
      Boolean(location.state) &&
      typeof location.state === 'object' &&
      'fromOnboarding' in location.state &&
      (location.state as { fromOnboarding?: unknown }).fromOnboarding === true;

    // Allow optimistic forward navigation from the previous step.
    // Guard remains strict on refresh / direct URL entry.
    if (!cameFromOnboardingAction && target !== allow) {
      return <Navigate to={target} replace state={{ from: location.pathname }} />;
    }
  }

  // If onboarding is complete, keep user in profile by default.
  if (target === '/profile' && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace state={{ from: location.pathname }} />;
  }

  return children;
};
