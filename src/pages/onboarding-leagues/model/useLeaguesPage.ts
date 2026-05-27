import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchLeagues } from '@/features/onboarding/api/leagues';
import { filterLeaguesBySearch, splitLeaguesByActive } from '@/features/onboarding/lib/filterLeagues';
import { getLeaguesLoadErrorMessage } from '@/features/onboarding/lib/onboardingErrors';
import { resolveLeagueSelection } from '@/features/onboarding/lib/leagueSelection';
import { useOnboarding } from '@/features/onboarding/model/onboardingContext';
import { getMyProfile, patchMyProfile } from '@/features/profile/api/profile';
import { getProfileSaveErrorMessage } from '@/features/profile/lib/profileErrors';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { League } from '@/shared/types/league';

export const useLeaguesPage = () => {
  const { setFavoriteLeagues, setFavoriteClubIds } = useOnboarding();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const applyProfileLeagues = useCallback((leagues: League[], favoriteLeagueIds: string[]) => {
    const validIds = resolveLeagueSelection(favoriteLeagueIds, leagues);
    setSelectedIds(validIds);
    setFavoriteLeagues(
      leagues
        .filter((league) => validIds.includes(league.id))
        .map((league) => ({ id: league.id, name: league.name })),
    );
  }, [setFavoriteLeagues]);

  const syncSelectionWithCatalog = useCallback(
    (leagues: League[]) => {
      setSelectedIds((currentIds) => resolveLeagueSelection(currentIds, leagues));
    },
    [],
  );

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

  useEffect(() => {
    if (loadStatus !== 'success' || leagues.length === 0) return;

    let cancelled = false;

    const hydrateFromProfile = async () => {
      try {
        const profile = await getMyProfile();
        if (cancelled) return;
        if (profile.favoriteLeagueIds.length > 0) {
          applyProfileLeagues(leagues, profile.favoriteLeagueIds);
        }
        if (profile.favoriteClubIds.length > 0) {
          setFavoriteClubIds(profile.favoriteClubIds);
        }
      } catch {
        // Новый пользователь или профиль ещё не создан — оставляем пустой выбор.
      }
    };

    void hydrateFromProfile();

    return () => {
      cancelled = true;
    };
  }, [applyProfileLeagues, leagues, loadStatus, setFavoriteClubIds]);

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

  const canContinue =
    loadStatus === 'success' && selectedIds.length > 0 && saveStatus !== 'saving';

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
    saveStatus,
    saveError,
  };
};
