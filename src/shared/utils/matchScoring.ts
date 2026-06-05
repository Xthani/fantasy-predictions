import type { Match, MatchResultDuration } from '@/shared/types/match';

const RESULT_DURATION_LABELS: Record<MatchResultDuration, string> = {
  regular: 'основное время',
  extraTime: 'доп. время',
  penaltyShootout: 'серия пенальти',
};

export const getScoringPeriodLabel = (): string => 'основное время (90 мин)';

export const getResultDurationNote = (duration: MatchResultDuration | null | undefined): string | null => {
  if (!duration || duration === 'regular') return null;
  return `Матч решён в ${RESULT_DURATION_LABELS[duration]} · зачёт по основному времени`;
};

export const getExtraTimeHint = (match: Match): string | null => {
  if (!match.mayHaveExtraTime || match.status !== 'open') return null;
  return 'Возможны доп. время и пенальти · прогноз только на 90 мин';
};
