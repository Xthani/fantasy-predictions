import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

export const getLeaguesLoadErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, 'Не удалось загрузить лиги. Попробуй ещё раз.');
