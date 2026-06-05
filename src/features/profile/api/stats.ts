import { apiRequest } from '@/shared/api/httpClient';

export type StatsBucket = {
  predictionsCount: number;
  gradedCount: number;
  pendingCount: number;
  totalPoints: number;
  averagePoints: number | null;
  averageEfficiency: number | null;
};

export type PlayerStats = {
  officialRating: number;
  form: number | null;
  official: StatsBucket;
  shadow: StatsBucket;
};

export const getMyStats = (): Promise<PlayerStats> => apiRequest<PlayerStats>('/api/stats/me');
