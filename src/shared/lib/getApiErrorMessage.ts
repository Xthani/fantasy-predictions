import { ApiError } from '@/shared/api/httpClient';

type GetApiErrorMessageOptions = {
  serverUnavailableMessage?: string;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
  options?: GetApiErrorMessageOptions,
): string => {
  if (error instanceof ApiError) {
    if (error.status === 0) return error.message;
    if (error.status >= 500) {
      return (
        options?.serverUnavailableMessage ?? 'Сервер временно недоступен. Попробуй позже.'
      );
    }
    return error.message;
  }

  return fallback;
};
