import { apiRequest } from '@/shared/api/httpClient';

export type Profile = {
  userId: string;
  login: string;
  displayName: string;
  favoriteLeagueIds: string[];
  favoriteClubIds: string[];
};

export type PatchProfileInput = {
  favoriteLeagueIds?: string[];
  favoriteClubIds?: string[];
};

export const getMyProfile = (): Promise<Profile> => apiRequest<Profile>('/api/profiles/me');

export const patchMyProfile = (payload: PatchProfileInput): Promise<Profile> =>
  apiRequest<Profile>('/api/profiles/me', {
    method: 'PATCH',
    body: payload,
  });
