import type { League } from '@/shared/types/league';

export const mockLeagues: League[] = [
  {
    id: 'league_la_liga',
    name: 'Ла Лига',
    countryName: 'Испания',
    countryCode: 'ES',
    isActive: true,
    crestEmoji: '🇪🇸',
  },
  {
    id: 'league_premier',
    name: 'АПЛ',
    countryName: 'Англия',
    countryCode: 'GB',
    isActive: true,
    crestEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  },
  {
    id: 'league_ucl',
    name: 'Лига чемпионов',
    countryName: 'Европа',
    countryCode: 'EU',
    isActive: true,
    crestEmoji: '⭐',
  },
  {
    id: 'league_serie_a',
    name: 'Серия A',
    countryName: 'Италия',
    countryCode: 'IT',
    isActive: true,
    crestEmoji: '🇮🇹',
  },
  {
    id: 'league_bundesliga',
    name: 'Бундеслига',
    countryName: 'Германия',
    countryCode: 'DE',
    isActive: true,
    crestEmoji: '🇩🇪',
  },
  {
    id: 'league_kg',
    name: 'Кыргызстан',
    countryName: 'Кыргызстан',
    countryCode: 'KG',
    isActive: false,
    crestEmoji: '🇰🇬',
  },
];

export const getMockLeagues = (): League[] => mockLeagues;
