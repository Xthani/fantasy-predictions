import { ApiError } from '@/shared/api/httpClient';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
