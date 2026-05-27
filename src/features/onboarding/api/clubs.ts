import { apiRequest } from '@/shared/api/httpClient';
import type { FavoriteClub } from '@/shared/types/favoriteClub';

type ClubsResponse = {
  clubs: FavoriteClub[];
};

export const fetchClubs = async (leagueIds: string[], search?: string): Promise<FavoriteClub[]> => {
  if (leagueIds.length === 0) return [];

  const response = await apiRequest<ClubsResponse>('/api/clubs', {
    query: {
      leagueIds,
      ...(search?.trim() ? { search: search.trim() } : {}),
    },
  });

  return response.clubs ?? [];
};
