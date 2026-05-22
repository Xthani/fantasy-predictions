import { ApiError } from '@/shared/api/httpClient';
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

const getConflictMessage = (code: string | null): string => {
  const normalizedCode = code?.toUpperCase() ?? '';
  if (normalizedCode.includes('EMAIL')) return 'Аккаунт с таким email уже существует.';
  if (normalizedCode.includes('LOGIN')) return 'Такой логин уже занят.';
  return 'Аккаунт с такими данными уже существует.';
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Неверный email, логин или пароль.';
    if (error.status === 409) return getConflictMessage(error.code);
  }

  return getApiErrorMessage(error, 'Что-то пошло не так. Попробуй ещё раз.');
};
