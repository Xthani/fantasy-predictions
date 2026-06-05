import type { PredictionStyle } from '@/shared/types/quickPrediction';

export type { PredictionStyle };

export type PredictionComponents = {
  matchOutcome: 'home' | 'draw' | 'away';
  doubleChance: string;
  totalGoals: 'over25' | 'under25';
  btts: 'yes' | 'no';
  homeIndividualTotal: number;
  awayIndividualTotal: number;
  goalDifference: number;
  exactTotalGoals: number;
  teamGoals: { home: number; away: number };
  exactScore: { home: number; away: number };
};

export type ComponentResult = {
  component: string;
  energy: number;
  multiplier: number;
  correct: boolean;
  points: number;
};

export type PredictionPreview = {
  components: PredictionComponents;
  energyByComponent: Record<string, number>;
  maxPoints: number;
};

export type SavePredictionPayload = {
  matchId: string;
  homeScore: number;
  awayScore: number;
  style: PredictionStyle;
  isOfficial: boolean;
};
