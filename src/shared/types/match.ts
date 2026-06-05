export type MatchStatus = 'open' | 'locked' | 'finished';

export type MatchScoringPeriod = 'regularTime';

export type MatchResultDuration = 'regular' | 'extraTime' | 'penaltyShootout';

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeClubId: string;
  awayClubId: string;
  kickoffAt: string;
  status: MatchStatus;
  competition: string;
  leagueId: string;
  week: number;
  homeResultScore?: number | null;
  awayResultScore?: number | null;
  scoringPeriod?: MatchScoringPeriod;
  mayHaveExtraTime?: boolean;
  resultDuration?: MatchResultDuration | null;
};
