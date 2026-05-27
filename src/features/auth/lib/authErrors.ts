import { ApiError } from '@/shared/api/httpClient';
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  LOGIN_TAKEN: 'Этот логин уже занят. Выбери другой.',
  INVALID_CREDENTIALS: 'Неверный логин или пароль.',
  VALIDATION_ERROR: 'Проверь логин и пароль.',
  UNAUTHORIZED: 'Сессия истекла. Войди снова.',
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }

  return getApiErrorMessage(error, 'Не удалось выполнить вход. Попробуй ещё раз.');
};
