export type OnboardingPreferences = {
  favoriteLeagueIds: string[];
  favoriteClubIds: string[];
};

const PREFERENCES_KEY = 'fp_preferences';

const emptyPreferences = (): OnboardingPreferences => ({
  favoriteLeagueIds: [],
  favoriteClubIds: [],
});

export const getPreferences = (): OnboardingPreferences => {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return emptyPreferences();
    const parsed = JSON.parse(raw) as OnboardingPreferences;
    return {
      favoriteLeagueIds: parsed.favoriteLeagueIds ?? [],
      favoriteClubIds: parsed.favoriteClubIds ?? [],
    };
  } catch {
    return emptyPreferences();
  }
};

export const setFavoriteLeagueIds = (ids: string[]): void => {
  const current = getPreferences();
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...current, favoriteLeagueIds: ids }));
};

export const setFavoriteClubIds = (ids: string[]): void => {
  const current = getPreferences();
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...current, favoriteClubIds: ids }));
};

export const isOnboardingComplete = (): boolean => {
  const prefs = getPreferences();
  return prefs.favoriteLeagueIds.length > 0 && prefs.favoriteClubIds.length > 0;
};
