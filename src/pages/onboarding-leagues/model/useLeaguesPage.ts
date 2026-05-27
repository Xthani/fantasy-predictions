import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchLeagues,
  getLeaguesLoadErrorMessage,
  resolveLeagueSelection,
  splitLeaguesByActive,
  useOnboarding,
} from '@/features/onboarding';
import { getProfileSaveErrorMessage, patchMyProfile } from '@/features/profile';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { League } from '@/shared/types/league';
import type { PaginationMeta } from '@/shared/types/pagination';

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_LIMIT = 6;

export const useLeaguesPage = () => {
  const { favoriteLeagues, setFavoriteLeagues } = useOnboarding();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [leaguesList, setLeaguesList] = useState<League[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

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
    },
    [favoriteLeagues],
  );

  const loadLeagues = useCallback(async () => {
    setLoadMoreError(null);
    const { leagues, pagination } = await fetchLeagues({
      search: debouncedSearch,
      offset: 0,
      limit: DEFAULT_LIMIT,
    });
    setPagination(pagination);
    setLeaguesList(leagues);
    return leagues;
  }, [debouncedSearch]);

  const {
    status: loadStatus,
    error: loadError,
    retry: retryLoad,
  } = useAsyncRequest({
    request: loadLeagues,
    mapError: getLeaguesLoadErrorMessage,
    onSuccess: syncSelectionWithCatalog,
  });

  const leagues = useMemo(() => leaguesList, [leaguesList]);

  const hasMoreLeagues = pagination?.hasMore ?? false;
  const isSearchActive = debouncedSearch.trim().length > 0;

  const loadMoreLeagues = useCallback(async () => {
    if (loadStatus !== 'success') return;
    if (!pagination?.hasMore) return;
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const { leagues: next, pagination: nextPagination } = await fetchLeagues({
        search: debouncedSearch,
        offset: pagination.offset + pagination.limit,
        limit: pagination.limit,
      });
      setLeaguesList((current) => [...current, ...next]);
      setPagination(nextPagination);
    } catch (error) {
      setLoadMoreError(getLeaguesLoadErrorMessage(error));
    } finally {
      setIsLoadingMore(false);
    }
  }, [debouncedSearch, isLoadingMore, loadStatus, pagination]);

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
    setFavoriteLeagues(selectedLeagues);
    setSaveStatus('idle');

    void (async () => {
      try {
        await patchMyProfile({
          favoriteLeagueIds: selectedLeagues.map((league) => league.id),
        });
      } catch (error) {
        setSaveStatus('error');
        setSaveError(getProfileSaveErrorMessage(error));
      }
    })();

    return true;
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
    hasMoreLeagues,
    isSearchActive,
    isLoadingMore,
    loadMoreError,
    loadMoreLeagues,
  };
};
