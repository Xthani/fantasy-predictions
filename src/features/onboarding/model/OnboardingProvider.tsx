import { useMemo, useState, type ReactNode } from 'react';
import {
  OnboardingContext,
  type FavoriteLeagueRef,
  type OnboardingContextValue,
} from '@/features/onboarding/model/onboardingContext';

type OnboardingProviderProps = {
  children: ReactNode;
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [favoriteLeagues, setFavoriteLeagues] = useState<FavoriteLeagueRef[]>([]);
  const [favoriteClubIds, setFavoriteClubIds] = useState<string[]>([]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      favoriteLeagues,
      setFavoriteLeagues,
      favoriteClubIds,
      setFavoriteClubIds,
      hasSelectedLeagues: favoriteLeagues.length > 0,
    }),
    [favoriteLeagues, favoriteClubIds],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};
