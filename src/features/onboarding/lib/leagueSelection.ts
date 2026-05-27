import type { League } from '@/shared/types/league';

const sanitizeIds = (ids: string[], validIds: Set<string>): string[] =>
  ids.filter((id) => validIds.has(id));

export const resolveLeagueSelection = (currentIds: string[], leagues: League[]): string[] => {
  const validIds = new Set(leagues.map((league) => league.id));
  return sanitizeIds(currentIds, validIds);
};
