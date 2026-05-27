import { withLeaguesCrestFallback } from '@/features/onboarding/lib/leagueCrestFallback';
import { apiRequest } from '@/shared/api/httpClient';
import type { League } from '@/shared/types/league';
import type { PaginationMeta } from '@/shared/types/pagination';

type LeaguesResponse = {
  leagues: League[];
  pagination: PaginationMeta;
};

export const fetchLeagues = async (params?: {
  search?: string;
  offset?: number;
  limit?: number;
}): Promise<LeaguesResponse> => {
  const response = await apiRequest<LeaguesResponse>('/api/leagues', {
    query: {
      offset: params?.offset ?? 0,
      ...(params?.search?.trim() ? { search: params.search.trim() } : {}),
      ...(params?.limit ? { limit: params.limit } : {}),
    },
  });

  return {
    leagues: withLeaguesCrestFallback(response.leagues ?? []),
    pagination: response.pagination,
  };
};
