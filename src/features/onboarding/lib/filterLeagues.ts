import type { League } from '@/shared/types/league';

export const splitLeaguesByActive = (leagues: League[]) => ({
  active: leagues.filter((league) => league.isActive),
  inactive: leagues.filter((league) => !league.isActive),
});
