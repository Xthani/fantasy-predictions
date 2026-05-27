import { useOnboarding } from '@/features/onboarding/model/onboardingContext';

export const useMatchesPage = () => {
  const { favoriteLeagues, favoriteClubIds } = useOnboarding();

  return {
    hasLeagues: favoriteLeagues.length > 0,
    hasClubs: favoriteClubIds.length > 0,
    selectedLeagues: favoriteLeagues,
    isWaitingForBackend: true,
  };
};
