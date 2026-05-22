import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery';
import type { League } from '@/shared/types/league';

export const splitLeaguesByActive = (leagues: League[]) => ({
  active: leagues.filter((league) => league.isActive),
  inactive: leagues.filter((league) => !league.isActive),
});

const matchesLeagueSearch = (league: League, query: string): boolean => {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return true;

  return (
    normalizeSearchQuery(league.name).includes(normalizedQuery) ||
    normalizeSearchQuery(league.countryName).includes(normalizedQuery)
  );
};

export const filterLeaguesBySearch = (leagues: League[], query: string): League[] => {
  if (!normalizeSearchQuery(query)) return leagues;
  return leagues.filter((league) => matchesLeagueSearch(league, query));
};
