import { ApiError } from '@/shared/api/httpClient';

export const getFriendsFeatureErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    if (error.status === 404) return 'Друзья пока не подключены на бэкенде';
    if (error.status === 401) return 'Нужна авторизация';
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

