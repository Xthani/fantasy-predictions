import type { League } from '@/shared/types/league';

const sanitizeIds = (ids: string[], validIds: Set<string>): string[] =>
  ids.filter((id) => validIds.has(id));

export const resolveLeagueSelection = (
  currentIds: string[],
  leagues: League[],
  storedIds: string[],
): string[] => {
  const validIds = new Set(leagues.map((league) => league.id));
  const sanitizedStored = sanitizeIds(storedIds, validIds);

  if (sanitizedStored.length > 0) return sanitizedStored;

  return sanitizeIds(currentIds, validIds);
};
