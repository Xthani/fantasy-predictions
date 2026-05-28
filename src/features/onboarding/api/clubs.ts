import { apiRequest } from '@/shared/api/httpClient';
import type { FavoriteClub } from '@/shared/types/favoriteClub';
import type { PaginationMeta } from '@/shared/types/pagination';

type ClubsResponse = {
  clubs: FavoriteClub[];
  pagination: PaginationMeta;
};

export const fetchClubs = async (params: {
  leagueIds: string[];
  search?: string;
  offset?: number;
  limit?: number;
}): Promise<ClubsResponse> => {
  if (params.leagueIds.length === 0) {
    return {
      clubs: [],
      pagination: { offset: 0, limit: params.limit ?? 0, total: 0, hasMore: false },
    };
  }

  const response = await apiRequest<ClubsResponse>('/api/clubs', {
    query: {
      leagueIds: params.leagueIds,
      offset: params.offset ?? 0,
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      ...(params.limit ? { limit: params.limit } : {}),
    },
  });

  return {
    clubs: response.clubs ?? [],
    pagination: response.pagination,
  };
};
