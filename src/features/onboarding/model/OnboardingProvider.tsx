import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  OnboardingContext,
  type FavoriteLeagueRef,
  type OnboardingContextValue,
} from '@/features/onboarding/model/onboardingContext';
import { onboardingStorage } from '@/features/onboarding/lib/onboardingStorage';

type OnboardingProviderProps = {
  children: ReactNode;
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [favoriteLeagues, setFavoriteLeaguesState] = useState<FavoriteLeagueRef[]>(() =>
    onboardingStorage.readLeagues(),
  );
  const [favoriteClubIds, setFavoriteClubIdsState] = useState<string[]>(() =>
    onboardingStorage.readClubIds(),
  );

  const setFavoriteLeagues = useCallback((leagues: FavoriteLeagueRef[]) => {
    onboardingStorage.writeLeagues(leagues);
    setFavoriteLeaguesState(leagues);
  }, []);

  const setFavoriteClubIds = useCallback((ids: string[]) => {
    onboardingStorage.writeClubIds(ids);
    setFavoriteClubIdsState(ids);
  }, []);

  const resetOnboarding = useCallback(() => {
    onboardingStorage.clear();
    setFavoriteLeaguesState([]);
    setFavoriteClubIdsState([]);
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      favoriteLeagues,
      setFavoriteLeagues,
      favoriteClubIds,
      setFavoriteClubIds,
      resetOnboarding,
      hasSelectedLeagues: favoriteLeagues.length > 0,
    }),
    [favoriteLeagues, setFavoriteLeagues, favoriteClubIds, setFavoriteClubIds, resetOnboarding],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};
