import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

export const getMatchesLoadErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, 'Не удалось загрузить матчи. Попробуй ещё раз.');
