import { apiRequest } from '@/shared/api/httpClient';
import type { Match } from '@/shared/types/match';
import type { PredictionStyle } from '@/shared/types/quickPrediction';
import type { PublicUser } from './friends';

export type DuelPredictionSide = {
  homeScore: number;
  awayScore: number;
  style: PredictionStyle;
  totalPoints: number | null;
};

export type DuelOutcome = 'win' | 'loss' | 'draw' | 'pending';

export type FriendDuelItem = {
  match: Match;
  me: DuelPredictionSide;
  friend: DuelPredictionSide;
  outcome: DuelOutcome;
};

export type FriendDuelsSummary = {
  sharedMatches: number;
  finishedDuels: number;
  myWins: number;
  friendWins: number;
  draws: number;
  pending: number;
  myTotalPoints: number;
  friendTotalPoints: number;
};

export type FriendDuelsResponse = {
  friend: PublicUser;
  summary: FriendDuelsSummary;
  duels: FriendDuelItem[];
};

export const fetchFriendDuels = (friendUserId: string): Promise<FriendDuelsResponse> =>
  apiRequest<FriendDuelsResponse>(`/api/friends/${friendUserId}/duels`);
