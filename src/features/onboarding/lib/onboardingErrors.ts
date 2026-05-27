import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

export const getLeaguesLoadErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, 'Не удалось загрузить лиги. Попробуй ещё раз.');

export const getTeamsLoadErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, 'Не удалось загрузить клубы. Попробуй ещё раз.');
