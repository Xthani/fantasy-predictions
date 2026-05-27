import { httpRequest } from '@/shared/api/httpClient';

export type ProfilePatchInput = {
  displayName?: string;
  countryCode?: string;
  avatarAssetId?: string;
  favoriteLeagueIds?: string[];
  favoriteClubIds?: string[];
};

export type UserProfile = {
  displayName: string | null;
  countryCode: string | null;
  avatarAssetId: string | null;
  favoriteLeagueIds: string[];
  favoriteClubIds: string[];
};

type RawProfile = {
  displayName?: string | null;
  display_name?: string | null;
  countryCode?: string | null;
  country_code?: string | null;
  avatarAssetId?: string | null;
  avatar_asset_id?: string | null;
  favoriteLeagueIds?: string[] | null;
  favorite_league_ids?: string[] | null;
  favoriteClubIds?: string[] | null;
  favorite_club_ids?: string[] | null;
};

const readString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const readStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
};

const mapProfile = (raw: RawProfile): UserProfile => ({
  displayName: readString(raw.displayName ?? raw.display_name),
  countryCode: readString(raw.countryCode ?? raw.country_code),
  avatarAssetId: readString(raw.avatarAssetId ?? raw.avatar_asset_id),
  favoriteLeagueIds: readStringArray(raw.favoriteLeagueIds ?? raw.favorite_league_ids),
  favoriteClubIds: readStringArray(raw.favoriteClubIds ?? raw.favorite_club_ids),
});

export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await httpRequest<RawProfile>('/api/profiles/me');
  return mapProfile(response);
};

export const patchMyProfile = async (input: ProfilePatchInput): Promise<UserProfile> => {
  const response = await httpRequest<RawProfile>('/api/profiles/me', {
    method: 'PATCH',
    body: input,
  });
  return mapProfile(response);
};
