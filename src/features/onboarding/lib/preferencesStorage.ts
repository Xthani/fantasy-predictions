export type FavoriteLeagueRef = {
  id: string;
  name: string;
};

export type OnboardingPreferences = {
  favoriteLeagueIds: string[];
  favoriteLeagues: FavoriteLeagueRef[];
  favoriteClubIds: string[];
};

const PREFERENCES_KEY = 'fp_preferences';

const emptyPreferences = (): OnboardingPreferences => ({
  favoriteLeagueIds: [],
  favoriteLeagues: [],
  favoriteClubIds: [],
});

export const getPreferences = (): OnboardingPreferences => {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return emptyPreferences();
    const parsed = JSON.parse(raw) as Partial<OnboardingPreferences>;
    return {
      favoriteLeagueIds: parsed.favoriteLeagueIds ?? [],
      favoriteLeagues: parsed.favoriteLeagues ?? [],
      favoriteClubIds: parsed.favoriteClubIds ?? [],
    };
  } catch {
    return emptyPreferences();
  }
};

export const getLeagueNameById = (leagueId: string): string => {
  const league = getPreferences().favoriteLeagues.find((item) => item.id === leagueId);
  return league?.name ?? leagueId;
};

export const setFavoriteLeagues = (leagues: FavoriteLeagueRef[]): void => {
  const current = getPreferences();
  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify({
      ...current,
      favoriteLeagueIds: leagues.map((league) => league.id),
      favoriteLeagues: leagues,
    }),
  );
};

export const setFavoriteLeagueIds = (ids: string[]): void => {
  const current = getPreferences();
  const leagues = current.favoriteLeagues.filter((league) => ids.includes(league.id));
  localStorage.setItem(
    PREFERENCES_KEY,
    JSON.stringify({
      ...current,
      favoriteLeagueIds: ids,
      favoriteLeagues: leagues,
    }),
  );
};

export const setFavoriteClubIds = (ids: string[]): void => {
  const current = getPreferences();
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...current, favoriteClubIds: ids }));
};

export const isOnboardingComplete = (): boolean => {
  const prefs = getPreferences();
  return prefs.favoriteLeagueIds.length > 0 && prefs.favoriteClubIds.length > 0;
};
