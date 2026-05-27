import { httpRequest } from '@/shared/api/httpClient';
import type { FavoriteClub } from '@/shared/types/favoriteClub';

type RawTeam = {
  team_key: string;
  team_name: string;
  team_badge?: string;
};

type TeamsResponse = {
  teams: RawTeam[];
};

const trimUrl = (value?: string): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const toShortName = (name: string): string => {
  const letters = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return letters.slice(0, 3) || '???';
};

const mapTeam = (raw: RawTeam, leagueId: string): FavoriteClub => ({
  id: String(raw.team_key),
  name: raw.team_name,
  shortName: toShortName(raw.team_name),
  leagueId,
  crestUrl: trimUrl(raw.team_badge),
});

const buildTeamsPath = (leagueIds: string[], search?: string): string => {
  const params = new URLSearchParams();
  for (const leagueId of leagueIds) {
    params.append('leagueIds', leagueId);
  }
  const query = search?.trim();
  if (query) params.set('name', query);
  return `/api/teams?${params.toString()}`;
};

const fetchTeamsForLeague = async (
  leagueId: string,
  search?: string,
): Promise<FavoriteClub[]> => {
  const response = await httpRequest<TeamsResponse>(buildTeamsPath([leagueId], search));
  return (response.teams ?? []).map((team) => mapTeam(team, leagueId));
};

/**
 * Клубы для онбординга: по одному запросу на лигу (2 команды на лигу в league mode).
 * `ids` в API — это id команд, не лиг; для нашего флоу нужен `leagueIds`.
 */
export const fetchTeamsByLeagueIds = async (
  leagueIds: string[],
  search?: string,
): Promise<FavoriteClub[]> => {
  if (leagueIds.length === 0) return [];

  const batches = await Promise.all(
    leagueIds.map((leagueId) => fetchTeamsForLeague(leagueId, search)),
  );

  return batches.flat();
};
