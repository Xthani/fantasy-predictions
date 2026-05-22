import { useCallback, useMemo, useState } from 'react';
import { fetchLeagues } from '@/features/onboarding/api/leagues';
import { filterLeaguesBySearch, splitLeaguesByActive } from '@/features/onboarding/lib/filterLeagues';
import { getLeaguesLoadErrorMessage } from '@/features/onboarding/lib/onboardingErrors';
import { resolveLeagueSelection } from '@/features/onboarding/lib/leagueSelection';
import {
  getPreferences,
  setFavoriteLeagues,
} from '@/features/onboarding/lib/preferencesStorage';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { League } from '@/shared/types/league';

export const useLeaguesPage = () => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => getPreferences().favoriteLeagueIds,
  );

  const syncSelectionWithCatalog = useCallback((leagues: League[]) => {
    setSelectedIds((currentIds) =>
      resolveLeagueSelection(currentIds, leagues, getPreferences().favoriteLeagueIds),
    );
  }, []);

  const {
    data: allLeagues,
    status: loadStatus,
    error: loadError,
    retry: retryLoad,
  } = useAsyncRequest({
    request: fetchLeagues,
    mapError: getLeaguesLoadErrorMessage,
    onSuccess: syncSelectionWithCatalog,
  });

  const leagues = useMemo(() => allLeagues ?? [], [allLeagues]);

  const { active: activeLeagues, inactive: inactiveLeagues } = useMemo(
    () => splitLeaguesByActive(leagues),
    [leagues],
  );

  const filteredActive = useMemo(
    () => filterLeaguesBySearch(activeLeagues, search),
    [activeLeagues, search],
  );

  const filteredInactive = useMemo(
    () => filterLeaguesBySearch(inactiveLeagues, search),
    [inactiveLeagues, search],
  );

  const isListEmpty =
    loadStatus === 'success' && filteredActive.length === 0 && filteredInactive.length === 0;

  const toggleLeague = (leagueId: string) => {
    setSelectedIds((prev) =>
      prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId],
    );
  };

  const saveAndContinue = () => {
    const selectedLeagues = leagues
      .filter((league) => selectedIds.includes(league.id))
      .map((league) => ({ id: league.id, name: league.name }));

    setFavoriteLeagues(selectedLeagues);
    return true;
  };

  const canContinue = loadStatus === 'success' && selectedIds.length > 0;

  return {
    search,
    setSearch,
    selectedIds,
    toggleLeague,
    filteredActive,
    filteredInactive,
    isListEmpty,
    canContinue,
    saveAndContinue,
    selectedCount: selectedIds.length,
    loadStatus,
    loadError,
    retryLoad,
  };
};
