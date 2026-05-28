import { apiRequest } from '@/shared/api/httpClient';
import type { Match } from '@/shared/types/match';
import type { PaginationMeta } from '@/shared/types/pagination';

type MatchesResponse = {
  matches: Match[];
  pagination: PaginationMeta;
};

export const fetchMatches = async (params: {
  leagueIds: string[];
  clubIds: string[];
  offset?: number;
  limit?: number;
}): Promise<MatchesResponse> => {
  const response = await apiRequest<MatchesResponse>('/api/matches', {
    query: {
      leagueIds: params.leagueIds,
      clubIds: params.clubIds,
      offset: params.offset ?? 0,
      limit: params.limit ?? 10,
    },
  });

  return {
    matches: response.matches ?? [],
    pagination: response.pagination,
  };
};
