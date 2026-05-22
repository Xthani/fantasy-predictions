import { useMemo, useState } from 'react';
import { getMockLeagues } from '@/shared/mocks/leagues';
import { getPreferences, setFavoriteLeagueIds } from '@/features/onboarding/lib/preferencesStorage';

const normalize = (value: string) => value.trim().toLowerCase();

export const useLeaguesPage = () => {
  const allLeagues = useMemo(() => getMockLeagues(), []);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => getPreferences().favoriteLeagueIds,
  );

  const activeLeagues = useMemo(() => allLeagues.filter((league) => league.isActive), [allLeagues]);

  const inactiveLeagues = useMemo(
    () => allLeagues.filter((league) => !league.isActive),
    [allLeagues],
  );

  const query = normalize(search);

  const filteredActive = useMemo(() => {
    if (!query) return activeLeagues;
    return activeLeagues.filter(
      (l) => normalize(l.name).includes(query) || normalize(l.countryName).includes(query),
    );
  }, [activeLeagues, query]);

  const filteredInactive = useMemo(() => {
    if (!query) return inactiveLeagues;
    return inactiveLeagues.filter(
      (l) => normalize(l.name).includes(query) || normalize(l.countryName).includes(query),
    );
  }, [inactiveLeagues, query]);

  const isEmpty = filteredActive.length === 0 && filteredInactive.length === 0;

  const toggleLeague = (leagueId: string) => {
    setSelectedIds((prev) =>
      prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId],
    );
  };

  const saveAndContinue = () => {
    setFavoriteLeagueIds(selectedIds);
    return true;
  };

  const canContinue = selectedIds.length > 0;

  return {
    search,
    setSearch,
    selectedIds,
    toggleLeague,
    filteredActive,
    filteredInactive,
    isEmpty,
    canContinue,
    saveAndContinue,
    selectedCount: selectedIds.length,
  };
};
