import { withLeaguesCrestFallback } from '@/features/onboarding/lib/leagueCrestFallback';
import { apiRequest } from '@/shared/api/httpClient';
import type { League } from '@/shared/types/league';

type LeaguesResponse = {
  leagues: League[];
};

export const fetchLeagues = async (search?: string): Promise<League[]> => {
  const response = await apiRequest<LeaguesResponse>('/api/leagues', {
    query: search?.trim() ? { search: search.trim() } : undefined,
  });

  return withLeaguesCrestFallback(response.leagues ?? []);
};
