import { apiRequest } from '@/shared/api/httpClient';
import type { Match } from '@/shared/types/match';
import type {
  ComponentResult,
  PredictionComponents,
  PredictionPreview,
  PredictionStyle,
  SavePredictionPayload,
} from '@/features/quick-prediction/types/prediction';

export type PredictionDto = {
  id: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  style: PredictionStyle;
  energyByComponent: Record<string, number>;
  components: PredictionComponents;
  isOfficial: boolean;
  totalPoints: number | null;
  componentResults: ComponentResult[] | null;
  gradedAt: string | null;
  savedAt: string;
  match: Match;
};

type PredictionsResponse = {
  predictions: PredictionDto[];
};

export const previewPrediction = (payload: {
  homeScore: number;
  awayScore: number;
  style: PredictionStyle;
}): Promise<PredictionPreview> =>
  apiRequest<PredictionPreview>('/api/predictions/preview', {
    method: 'POST',
    body: payload,
  });

export const savePrediction = (payload: SavePredictionPayload): Promise<PredictionDto> =>
  apiRequest<PredictionDto>('/api/predictions', {
    method: 'POST',
    body: payload,
  });

export const patchPredictionOfficial = (
  predictionId: string,
  isOfficial: boolean,
): Promise<PredictionDto> =>
  apiRequest<PredictionDto>(`/api/predictions/${predictionId}/official`, {
    method: 'PATCH',
    body: { isOfficial },
  });

export const fetchMyPredictions = (matchIds?: string[]): Promise<PredictionDto[]> =>
  apiRequest<PredictionsResponse>('/api/predictions/me', {
    query: matchIds?.length ? { matchIds } : undefined,
  }).then((response) => response.predictions ?? []);
