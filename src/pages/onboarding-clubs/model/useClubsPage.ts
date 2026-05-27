import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchTeamsByLeagueIds } from '@/features/onboarding/api/teams';
import { getTeamsLoadErrorMessage } from '@/features/onboarding/lib/onboardingErrors';
import { useOnboarding } from '@/features/onboarding/model/onboardingContext';
import { getMyProfile, patchMyProfile } from '@/features/profile/api/profile';
import { getProfileSaveErrorMessage } from '@/features/profile/lib/profileErrors';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { FavoriteClub } from '@/shared/types/favoriteClub';

const SEARCH_DEBOUNCE_MS = 300;

export const useClubsPage = () => {
  const { favoriteLeagues, favoriteClubIds: savedClubIds, setFavoriteClubIds } = useOnboarding();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(savedClubIds);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const leagueIds = useMemo(() => favoriteLeagues.map((league) => league.id), [favoriteLeagues]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadTeams = useCallback(
    () => fetchTeamsByLeagueIds(leagueIds, debouncedSearch),
    [debouncedSearch, leagueIds],
  );

  const {
    data: clubs,
    status: loadStatus,
    error: loadError,
    retry: retryLoad,
  } = useAsyncRequest({
    request: loadTeams,
    mapError: getTeamsLoadErrorMessage,
  });

  useEffect(() => {
    if (leagueIds.length === 0) return;

    let cancelled = false;

    const hydrateFromProfile = async () => {
      try {
        const profile = await getMyProfile();
        if (cancelled || profile.favoriteClubIds.length === 0) return;
        setSelectedIds(profile.favoriteClubIds);
        setFavoriteClubIds(profile.favoriteClubIds);
      } catch {
        // Профиль без клубов — нормально для первого прохода.
      }
    };

    void hydrateFromProfile();

    return () => {
      cancelled = true;
    };
  }, [leagueIds, setFavoriteClubIds]);

  const clubsInLeagues = useMemo(() => clubs ?? [], [clubs]);

  const groupedByLeague = useMemo(() => {
    const groups = new Map<string, FavoriteClub[]>();
    for (const club of clubsInLeagues) {
      const list = groups.get(club.leagueId) ?? [];
      list.push(club);
      groups.set(club.leagueId, list);
    }

    return favoriteLeagues
      .filter((league) => groups.has(league.id))
      .map((league) => ({
        leagueId: league.id,
        leagueName: league.name,
        clubs: groups.get(league.id) ?? [],
      }));
  }, [clubsInLeagues, favoriteLeagues]);

  const isCatalogUnavailable =
    loadStatus === 'success' && leagueIds.length > 0 && clubsInLeagues.length === 0;

  const isSearchEmpty =
    loadStatus === 'success' && !isCatalogUnavailable && groupedByLeague.length === 0;

  const toggleClub = (clubId: string) => {
    setSaveError(null);
    setSelectedIds((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId],
    );
  };

  const saveAndContinue = async (): Promise<boolean> => {
    if (selectedIds.length === 0) return false;

    setSaveStatus('saving');
    setSaveError(null);

    try {
      await patchMyProfile({ favoriteClubIds: selectedIds });
      setFavoriteClubIds(selectedIds);
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
    hasLeagues: favoriteLeagues.length > 0,
    leagueCount: favoriteLeagues.length,
    search,
    setSearch,
    selectedIds,
    toggleClub,
    groupedByLeague,
    isCatalogUnavailable,
    isSearchEmpty,
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
