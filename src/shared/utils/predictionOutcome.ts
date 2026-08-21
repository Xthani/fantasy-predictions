import type { Match } from '@/shared/types/match';

export type PredictionOutcome = 'pending' | 'exact' | 'miss';

export const hasMatchResult = (match: Match): boolean =>
  match.status === 'finished' && match.homeResultScore != null && match.awayResultScore != null;

export const getPredictionOutcome = (
  homeScore: number,
  awayScore: number,
  match: Match,
): PredictionOutcome => {
  if (!hasMatchResult(match)) return 'pending';
  return homeScore === match.homeResultScore && awayScore === match.awayResultScore
    ? 'exact'
    : 'miss';
};
