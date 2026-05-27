import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchLeagues } from '@/features/onboarding/api/leagues';
import { splitLeaguesByActive } from '@/features/onboarding/lib/filterLeagues';
import { getLeaguesLoadErrorMessage } from '@/features/onboarding/lib/onboardingErrors';
import { resolveLeagueSelection } from '@/features/onboarding/lib/leagueSelection';
import { useOnboarding } from '@/features/onboarding/model/onboardingContext';
import { getMyProfile, patchMyProfile } from '@/features/profile/api/profile';
import { getProfileSaveErrorMessage } from '@/features/profile/lib/profileErrors';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { League } from '@/shared/types/league';

const SEARCH_DEBOUNCE_MS = 300;

export const useLeaguesPage = () => {
  const { favoriteLeagues, setFavoriteLeagues, setFavoriteClubIds } = useOnboarding();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  const applyProfileSelection = useCallback(
    (loadedLeagues: League[], favoriteLeagueIds: string[], favoriteClubIds: string[]) => {
      const validIds = resolveLeagueSelection(favoriteLeagueIds, loadedLeagues);
      setSelectedIds(validIds);
      setFavoriteLeagues(
        loadedLeagues
          .filter((league) => validIds.includes(league.id))
          .map((league) => ({ id: league.id, name: league.name })),
      );
      if (favoriteClubIds.length > 0) {
        setFavoriteClubIds(favoriteClubIds);
      }
    },
    [setFavoriteClubIds, setFavoriteLeagues],
  );

  const syncSelectionWithCatalog = useCallback(
    (loadedLeagues: League[]) => {
      setSelectedIds((currentIds) => {
        const fromCurrent = resolveLeagueSelection(currentIds, loadedLeagues);
        if (fromCurrent.length > 0) return fromCurrent;

        if (favoriteLeagues.length === 0) return fromCurrent;

        return resolveLeagueSelection(
          favoriteLeagues.map((league) => league.id),
          loadedLeagues,
        );
      });

      void (async () => {
        try {
          const profile = await getMyProfile();
          if (profile.favoriteLeagueIds.length > 0) {
            applyProfileSelection(
              loadedLeagues,
              profile.favoriteLeagueIds,
              profile.favoriteClubIds,
            );
          }
        } catch {
          // Профиль ещё пустой — нормально для нового пользователя.
        }
      })();
    },
    [applyProfileSelection, favoriteLeagues],
  );

  const loadLeagues = useCallback(() => fetchLeagues(debouncedSearch), [debouncedSearch]);

  const {
    data: allLeagues,
    status: loadStatus,
    error: loadError,
    retry: retryLoad,
  } = useAsyncRequest({
    request: loadLeagues,
    mapError: getLeaguesLoadErrorMessage,
    onSuccess: syncSelectionWithCatalog,
  });

  const leagues = useMemo(() => allLeagues ?? [], [allLeagues]);

  const { active: activeLeagues, inactive: inactiveLeagues } = useMemo(
    () => splitLeaguesByActive(leagues),
    [leagues],
  );

  const isListEmpty =
    loadStatus === 'success' && activeLeagues.length === 0 && inactiveLeagues.length === 0;

  const toggleLeague = (leagueId: string) => {
    setSaveError(null);
    setSelectedIds((prev) =>
      prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId],
    );
  };

  const saveAndContinue = async (): Promise<boolean> => {
    const selectedLeagues = leagues
      .filter((league) => selectedIds.includes(league.id))
      .map((league) => ({ id: league.id, name: league.name }));

    if (selectedLeagues.length === 0) return false;

    setSaveStatus('saving');
    setSaveError(null);

    try {
      await patchMyProfile({
        favoriteLeagueIds: selectedLeagues.map((league) => league.id),
      });
      setFavoriteLeagues(selectedLeagues);
      setSaveStatus('idle');
      return true;
    } catch (error) {
      setSaveStatus('error');
      setSaveError(getProfileSaveErrorMessage(error));
      return false;
    }
  };

  const canContinue = loadStatus === 'success' && selectedIds.length > 0 && saveStatus !== 'saving';

  return {
    search,
    setSearch,
    selectedIds,
    toggleLeague,
    filteredActive: activeLeagues,
    filteredInactive: inactiveLeagues,
    isListEmpty,
    canContinue,
    saveAndContinue,
    selectedCount: selectedIds.length,
    loadStatus,
    loadError,
    retryLoad,
    saveStatus,
    saveError,
  };
};
