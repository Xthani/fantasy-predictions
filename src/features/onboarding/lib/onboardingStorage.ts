import type { FavoriteLeagueRef } from '@/features/onboarding/model/onboardingContext';

const KEY_LEAGUES = 'fp_favoriteLeagues';
const KEY_CLUB_IDS = 'fp_favoriteClubIds';
const KEY_HAS_PREDICTION = 'fp_hasAnyPrediction';

const safeParse = <T>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const onboardingStorage = {
  readLeagues(): FavoriteLeagueRef[] {
    const data = safeParse<FavoriteLeagueRef[]>(localStorage.getItem(KEY_LEAGUES));
    return Array.isArray(data) ? data.filter((x) => x && typeof x.id === 'string') : [];
  },

  writeLeagues(leagues: FavoriteLeagueRef[]): void {
    localStorage.setItem(KEY_LEAGUES, JSON.stringify(leagues));
  },

  readClubIds(): string[] {
    const data = safeParse<string[]>(localStorage.getItem(KEY_CLUB_IDS));
    return Array.isArray(data) ? data.filter((x) => typeof x === 'string') : [];
  },

  writeClubIds(ids: string[]): void {
    localStorage.setItem(KEY_CLUB_IDS, JSON.stringify(ids));
  },

  readHasAnyPrediction(): boolean {
    return localStorage.getItem(KEY_HAS_PREDICTION) === 'true';
  },

  writeHasAnyPrediction(value: boolean): void {
    localStorage.setItem(KEY_HAS_PREDICTION, value ? 'true' : 'false');
  },

  clear(): void {
    localStorage.removeItem(KEY_LEAGUES);
    localStorage.removeItem(KEY_CLUB_IDS);
    localStorage.removeItem(KEY_HAS_PREDICTION);
  },
};
