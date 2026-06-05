import { apiRequest } from '@/shared/api/httpClient';
import type { Match } from '@/shared/types/match';
import type { QuickPrediction } from '@/shared/types/quickPrediction';

export type PredictionDto = QuickPrediction & {
  id: string;
  match: Match;
};

type PredictionsResponse = {
  predictions: PredictionDto[];
};

export const savePrediction = (payload: {
  matchId: string;
  homeScore: number;
  awayScore: number;
}): Promise<PredictionDto> =>
  apiRequest<PredictionDto>('/api/predictions', {
    method: 'POST',
    body: payload,
  });

export const fetchMyPredictions = (matchIds?: string[]): Promise<PredictionDto[]> =>
  apiRequest<PredictionsResponse>('/api/predictions/me', {
    query: matchIds?.length ? { matchIds } : undefined,
  }).then((response) => response.predictions ?? []);
