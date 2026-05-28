import { getMyProfile } from '@/features/profile';
import { fetchMyPredictions } from '@/features/quick-prediction';

export type OnboardingProgress = {
  favoriteLeagueIds: string[];
  favoriteClubIds: string[];
  hasLeagues: boolean;
  hasClubs: boolean;
  hasAnyPrediction: boolean;
};

export type OnboardingTarget = '/onboarding/leagues' | '/onboarding/clubs' | '/matches' | '/profile';

export const getOnboardingTarget = (progress: OnboardingProgress): OnboardingTarget => {
  if (!progress.hasLeagues) return '/onboarding/leagues';
  if (!progress.hasClubs) return '/onboarding/clubs';
  if (!progress.hasAnyPrediction) return '/matches';
  return '/profile';
};

export const loadOnboardingProgress = async (): Promise<OnboardingProgress> => {
  const profile = await getMyProfile();
  const predictions = await fetchMyPredictions();

  return {
    favoriteLeagueIds: profile.favoriteLeagueIds,
    favoriteClubIds: profile.favoriteClubIds,
    hasLeagues: profile.favoriteLeagueIds.length > 0,
    hasClubs: profile.favoriteClubIds.length > 0,
    hasAnyPrediction: predictions.length > 0,
  };
};

