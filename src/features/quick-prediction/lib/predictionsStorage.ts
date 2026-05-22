import type { QuickPrediction } from '@/shared/types/quickPrediction';

const PREDICTIONS_KEY = 'fp_quick_predictions';

export const getQuickPredictions = (): QuickPrediction[] => {
  try {
    const raw = localStorage.getItem(PREDICTIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuickPrediction[];
  } catch {
    return [];
  }
};

export const getQuickPredictionByMatchId = (matchId: string): QuickPrediction | null =>
  getQuickPredictions().find((p) => p.matchId === matchId) ?? null;

export const saveQuickPrediction = (
  matchId: string,
  homeScore: number,
  awayScore: number,
): QuickPrediction => {
  const list = getQuickPredictions().filter((p) => p.matchId !== matchId);
  const entry: QuickPrediction = {
    matchId,
    homeScore,
    awayScore,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify([...list, entry]));
  return entry;
};
