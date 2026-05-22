import type { FavoriteClub } from '@/shared/types/favoriteClub';

export const mockFavoriteClubs: FavoriteClub[] = [
  {
    id: 'club_real_madrid',
    name: 'Real Madrid',
    shortName: 'RMA',
    leagueId: 'league_la_liga',
    crestEmoji: '👑',
  },
  {
    id: 'club_barcelona',
    name: 'Barcelona',
    shortName: 'BAR',
    leagueId: 'league_la_liga',
    crestEmoji: '🔵',
  },
  {
    id: 'club_atletico',
    name: 'Atlético Madrid',
    shortName: 'ATM',
    leagueId: 'league_la_liga',
    crestEmoji: '🔴',
  },
  {
    id: 'club_sevilla',
    name: 'Sevilla',
    shortName: 'SEV',
    leagueId: 'league_la_liga',
    crestEmoji: '⚪',
  },
  {
    id: 'club_man_city',
    name: 'Manchester City',
    shortName: 'MCI',
    leagueId: 'league_premier',
    crestEmoji: '🌙',
  },
  {
    id: 'club_arsenal',
    name: 'Arsenal',
    shortName: 'ARS',
    leagueId: 'league_premier',
    crestEmoji: '🔴',
  },
  {
    id: 'club_liverpool',
    name: 'Liverpool',
    shortName: 'LIV',
    leagueId: 'league_premier',
    crestEmoji: '🔴',
  },
  {
    id: 'club_chelsea',
    name: 'Chelsea',
    shortName: 'CHE',
    leagueId: 'league_premier',
    crestEmoji: '🔵',
  },
  {
    id: 'club_bayern',
    name: 'Bayern Munich',
    shortName: 'BAY',
    leagueId: 'league_bundesliga',
    crestEmoji: '🔴',
  },
  {
    id: 'club_dortmund',
    name: 'Borussia Dortmund',
    shortName: 'BVB',
    leagueId: 'league_bundesliga',
    crestEmoji: '🟡',
  },
  {
    id: 'club_inter',
    name: 'Inter',
    shortName: 'INT',
    leagueId: 'league_serie_a',
    crestEmoji: '🔵',
  },
  {
    id: 'club_milan',
    name: 'Milan',
    shortName: 'MIL',
    leagueId: 'league_serie_a',
    crestEmoji: '🔴',
  },
  {
    id: 'club_juventus',
    name: 'Juventus',
    shortName: 'JUV',
    leagueId: 'league_serie_a',
    crestEmoji: '⚫',
  },
  {
    id: 'club_psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    leagueId: 'league_ucl',
    crestEmoji: '🔵',
  },
  {
    id: 'club_benfica',
    name: 'Benfica',
    shortName: 'BEN',
    leagueId: 'league_ucl',
    crestEmoji: '🦅',
  },
];

export const getMockFavoriteClubs = (): FavoriteClub[] => mockFavoriteClubs;

export const getClubsByLeagueIds = (leagueIds: string[]): FavoriteClub[] =>
  mockFavoriteClubs.filter((club) => leagueIds.includes(club.leagueId));
