export type MatchStatus = 'open' | 'locked' | 'finished';

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
};
