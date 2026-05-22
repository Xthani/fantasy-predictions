import { useMemo, useState } from 'react';
import { getPreferences, setFavoriteClubIds } from '@/features/onboarding/lib/preferencesStorage';
import { getClubsByLeagueIds } from '@/shared/mocks/favoriteClubs';
import { getMockLeagues } from '@/shared/mocks/leagues';

const normalize = (value: string) => value.trim().toLowerCase();

export const useClubsPage = () => {
  const { favoriteLeagueIds, favoriteClubIds: savedClubIds } = getPreferences();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(savedClubIds);

  const leagueNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const league of getMockLeagues()) {
      map.set(league.id, league.name);
    }
    return map;
  }, []);

  const clubsInLeagues = useMemo(() => getClubsByLeagueIds(favoriteLeagueIds), [favoriteLeagueIds]);

  const query = normalize(search);

  const filteredClubs = useMemo(() => {
    if (!query) return clubsInLeagues;
    return clubsInLeagues.filter(
      (club) => normalize(club.name).includes(query) || normalize(club.shortName).includes(query),
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
        leagueName: leagueNameById.get(leagueId) ?? leagueId,
        clubs: groups.get(leagueId) ?? [],
      }));
  }, [filteredClubs, favoriteLeagueIds, leagueNameById]);

  const isEmpty = filteredClubs.length === 0;
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
    isEmpty,
    hasLeagues,
    canContinue,
    saveAndContinue,
    selectedCount: selectedIds.length,
    leagueCount: favoriteLeagueIds.length,
  };
};
