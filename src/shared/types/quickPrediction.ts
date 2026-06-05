export type PredictionStyle = 'defensive' | 'balanced' | 'aggressive' | 'manual';

export type QuickPrediction = {
  matchId: string;
  homeScore: number;
  awayScore: number;
  savedAt: string;
  style?: PredictionStyle;
  isOfficial?: boolean;
};
