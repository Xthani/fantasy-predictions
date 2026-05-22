import { useMemo, useState } from 'react';
import {
  getLeagueNameById,
  getPreferences,
  setFavoriteClubIds,
} from '@/features/onboarding/lib/preferencesStorage';
import { normalizeSearchQuery } from '@/shared/lib/normalizeSearchQuery';
import { getClubsByLeagueIds } from '@/shared/mocks/favoriteClubs';

export const useClubsPage = () => {
  const { favoriteLeagueIds, favoriteClubIds: savedClubIds } = getPreferences();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(savedClubIds);

  const clubsInLeagues = useMemo(() => getClubsByLeagueIds(favoriteLeagueIds), [favoriteLeagueIds]);

  const query = normalizeSearchQuery(search);

  const filteredClubs = useMemo(() => {
    if (!query) return clubsInLeagues;
    return clubsInLeagues.filter(
      (club) =>
        normalizeSearchQuery(club.name).includes(query) ||
        normalizeSearchQuery(club.shortName).includes(query),
    );
  }, [clubsInLeagues, query]);

  const groupedByLeague = useMemo(() => {
    const groups = new Map<string, typeof filteredClubs>();
    for (const club of filteredClubs) {
      const list = groups.get(club.leagueId) ?? [];
      list.push(club);
      groups.set(club.leagueId, list);
    }
    return favoriteLeagueIds
      .filter((id) => groups.has(id))
      .map((leagueId) => ({
        leagueId,
        leagueName: getLeagueNameById(leagueId),
        clubs: groups.get(leagueId) ?? [],
      }));
  }, [filteredClubs, favoriteLeagueIds]);

  const isCatalogUnavailable = clubsInLeagues.length === 0;
  const isSearchEmpty = !isCatalogUnavailable && filteredClubs.length === 0;
  const hasLeagues = favoriteLeagueIds.length > 0;

  const toggleClub = (clubId: string) => {
    setSelectedIds((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId],
    );
  };

  const saveAndContinue = () => {
    setFavoriteClubIds(selectedIds);
    return true;
  };

  const canContinue = selectedIds.length > 0;

  return {
    search,
    setSearch,
    selectedIds,
    toggleClub,
    groupedByLeague,
    isCatalogUnavailable,
    isSearchEmpty,
    hasLeagues,
    canContinue,
    saveAndContinue,
    selectedCount: selectedIds.length,
    leagueCount: favoriteLeagueIds.length,
  };
};
