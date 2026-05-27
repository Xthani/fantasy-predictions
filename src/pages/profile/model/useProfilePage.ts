import { useCallback } from 'react';
import { fetchClubs, fetchLeagues } from '@/features/onboarding';
import { getMyProfile } from '@/features/profile';
import { fetchMyPredictions } from '@/features/quick-prediction';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { FavoriteClub } from '@/shared/types/favoriteClub';
import type { League } from '@/shared/types/league';

const LEAGUES_LIMIT = 50;
const CLUBS_LIMIT = 50;

const getProfileLoadErrorMessage = () => 'Не удалось загрузить профиль';

const loadLeaguesByIds = async (leagueIds: string[]): Promise<League[]> => {
  if (leagueIds.length === 0) return [];

  const wanted = new Set(leagueIds);
  const result = new Map<string, League>();

  let offset = 0;
  let hasMore = true;
  while (hasMore && result.size < wanted.size) {
    const page = await fetchLeagues({ offset, limit: LEAGUES_LIMIT });
    for (const league of page.leagues) {
      if (wanted.has(league.id)) result.set(league.id, league);
    }
    hasMore = page.pagination.hasMore;
    offset += page.pagination.limit;
    if (page.leagues.length === 0) break;
  }

  return leagueIds.map((id) => result.get(id)).filter(Boolean) as League[];
};

const loadClubsByIds = async (leagueIds: string[], clubIds: string[]): Promise<FavoriteClub[]> => {
  if (leagueIds.length === 0 || clubIds.length === 0) return [];

  const wanted = new Set(clubIds);
  const result = new Map<string, FavoriteClub>();

  for (const leagueId of leagueIds) {
    let offset = 0;
    let hasMore = true;

    while (hasMore && result.size < wanted.size) {
      const page = await fetchClubs({ leagueIds: [leagueId], offset, limit: CLUBS_LIMIT });
      for (const club of page.clubs) {
        if (wanted.has(club.id)) result.set(club.id, club);
      }
      hasMore = page.pagination.hasMore;
      offset += page.pagination.limit;
      if (page.clubs.length === 0) break;
    }
  }

  return clubIds.map((id) => result.get(id)).filter(Boolean) as FavoriteClub[];
};

export const useProfilePage = () => {
  const loadProfileData = useCallback(async () => {
    const [profile, predictions] = await Promise.all([getMyProfile(), fetchMyPredictions()]);
    const [leagues, clubs] = await Promise.all([
      loadLeaguesByIds(profile.favoriteLeagueIds),
      loadClubsByIds(profile.favoriteLeagueIds, profile.favoriteClubIds),
    ]);

    return { profile, leagues, clubs, predictions };
  }, []);

  return useAsyncRequest({
    request: loadProfileData,
    mapError: getProfileLoadErrorMessage,
  });
};
