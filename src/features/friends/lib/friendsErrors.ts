import { ApiError } from '@/shared/api/httpClient';

const FRIENDS_ERROR_MESSAGES: Record<string, string> = {
  NOT_FRIENDS: 'Сравнение прогнозов доступно только для друзей.',
};

export const getFriendsFeatureErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    if (FRIENDS_ERROR_MESSAGES[error.code]) return FRIENDS_ERROR_MESSAGES[error.code];
    if (error.status === 404) return 'Друзья пока не подключены на бэкенде';
    if (error.status === 401) return 'Нужна авторизация';
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

