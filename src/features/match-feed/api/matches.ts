import { apiRequest } from '@/shared/api/httpClient';
import type { Match } from '@/shared/types/match';

type MatchesResponse = {
  matches: Match[];
};

export const fetchMatches = async (params: {
  leagueIds: string[];
  clubIds: string[];
  limit?: number;
}): Promise<Match[]> => {
  const response = await apiRequest<MatchesResponse>('/api/matches', {
    query: {
      leagueIds: params.leagueIds,
      clubIds: params.clubIds,
      limit: params.limit ?? 10,
    },
  });

  return response.matches ?? [];
};
