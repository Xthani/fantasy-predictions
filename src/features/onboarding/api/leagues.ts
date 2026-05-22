import { httpRequest } from '@/shared/api/httpClient';
import type { League } from '@/shared/types/league';

type RawLeague = {
  league_id: string;
  country_id: string;
  country_logo?: string;
  country_name: string;
  league_logo?: string;
  league_name: string;
  league_season?: string;
  display_order?: number;
  is_active: boolean;
};

type LeaguesResponse = {
  leagues: RawLeague[];
};

const trimUrl = (value?: string): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const pickCrestUrl = (raw: RawLeague): string | undefined =>
  trimUrl(raw.league_logo) ?? trimUrl(raw.country_logo);

const mapLeague = (raw: RawLeague): League => ({
  id: String(raw.league_id),
  name: raw.league_name,
  countryName: raw.country_name,
  countryCode: String(raw.country_id),
  isActive: Boolean(raw.is_active),
  crestUrl: pickCrestUrl(raw),
  season: raw.league_season,
});

const sortRawLeagues = (leagues: RawLeague[]): RawLeague[] =>
  leagues.slice().sort((a, b) => {
    const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.league_name.localeCompare(b.league_name);
  });

export const fetchLeagues = async (): Promise<League[]> => {
  const response = await httpRequest<LeaguesResponse>('/api/leagues', { auth: false });
  return sortRawLeagues(response.leagues ?? []).map(mapLeague);
};
