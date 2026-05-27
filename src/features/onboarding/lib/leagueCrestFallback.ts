import type { League } from '@/shared/types/league';

const LEAGUE_CREST_EMOJI: Record<string, string> = {
  league_la_liga: '🇪🇸',
  league_premier: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  league_ucl: '⭐',
  league_serie_a: '🇮🇹',
  league_bundesliga: '🇩🇪',
  league_kg: '🇰🇬',
};

export const withLeagueCrestFallback = (league: League): League => ({
  ...league,
  crestEmoji: league.crestEmoji ?? LEAGUE_CREST_EMOJI[league.id],
});

export const withLeaguesCrestFallback = (leagues: League[]): League[] =>
  leagues.map(withLeagueCrestFallback);
