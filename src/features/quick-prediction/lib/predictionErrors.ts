import { ApiError } from '@/shared/api/httpClient';
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

const PREDICTION_ERROR_MESSAGES: Record<string, string> = {
  MATCH_NOT_FOUND: 'Матч не найден.',
  MATCH_NOT_OPEN: 'На этот матч больше нельзя ставить прогноз.',
  MATCH_NOT_IN_SCOPE: 'Матч не входит в твои лиги и клубы.',
  INVALID_SCORE: 'Счёт должен быть от 0 до 9.',
  INVALID_ENERGY: 'Проверь распределение энергии.',
  INVALID_STYLE: 'Неизвестный стиль прогноза.',
  OFFICIAL_LIMIT_REACHED: 'Лимит официальных прогнозов на этот тур исчерпан (10).',
  OFFICIAL_DEADLINE_PASSED: 'Официальный прогноз можно менять только за 4 часа до старта.',
  PREDICTION_NOT_FOUND: 'Прогноз не найден.',
};

export const getPredictionSaveErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError && PREDICTION_ERROR_MESSAGES[error.code]) {
    return PREDICTION_ERROR_MESSAGES[error.code];
  }

  return getApiErrorMessage(error, 'Не удалось сохранить прогноз. Попробуй ещё раз.');
};
