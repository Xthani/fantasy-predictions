import { ApiError } from '@/shared/api/httpClient';
import { getApiErrorMessage } from '@/shared/lib/getApiErrorMessage';

const PROFILE_ERROR_MESSAGES: Record<string, string> = {
  LEAGUES_REQUIRED: 'Выбери хотя бы одну лигу.',
  CLUBS_REQUIRED: 'Выбери хотя бы один клуб.',
  CLUB_LEAGUE_MISMATCH: 'Клуб не относится к выбранным лигам.',
  UNKNOWN_ID: 'Неизвестный id в списке избранного.',
};

export const getProfileSaveErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError && PROFILE_ERROR_MESSAGES[error.code]) {
    return PROFILE_ERROR_MESSAGES[error.code];
  }

  return getApiErrorMessage(error, 'Не удалось сохранить профиль. Попробуй ещё раз.');
};
