import { createContext, useContext } from 'react';

export type FavoriteLeagueRef = {
  id: string;
  name: string;
};

export type OnboardingContextValue = {
  favoriteLeagues: FavoriteLeagueRef[];
  setFavoriteLeagues: (leagues: FavoriteLeagueRef[]) => void;
  favoriteClubIds: string[];
  setFavoriteClubIds: (ids: string[]) => void;
  resetOnboarding: () => void;
  hasSelectedLeagues: boolean;
};

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const useOnboarding = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding must be used inside OnboardingProvider');
  }

  return context;
};
