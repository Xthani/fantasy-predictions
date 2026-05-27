import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

export const getProfileLoadErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, 'Не удалось загрузить профиль.');

export const getProfileSaveErrorMessage = (error: unknown): string =>
  getApiErrorMessage(error, 'Не удалось сохранить выбор. Попробуй ещё раз.');
