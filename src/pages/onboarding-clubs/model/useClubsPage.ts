import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchClubs, getClubsLoadErrorMessage, useOnboarding } from '@/features/onboarding';
import { getProfileSaveErrorMessage, patchMyProfile } from '@/features/profile';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { FavoriteClub } from '@/shared/types/favoriteClub';
import type { PaginationMeta } from '@/shared/types/pagination';

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_LEAGUE_LIMIT = 2;
const SEARCH_LIMIT = 20;

type LeagueClubsState = {
  clubs: FavoriteClub[];
  pagination: PaginationMeta | null;
  status: 'loading' | 'error' | 'success';
  error: string | null;
  isLoadingMore: boolean;
  loadMoreError: string | null;
};

const emptyLeagueState = (): LeagueClubsState => ({
  clubs: [],
  pagination: null,
  status: 'loading',
  error: null,
  isLoadingMore: false,
  loadMoreError: null,
});

export const useClubsPage = () => {
  const { favoriteLeagues, favoriteClubIds: savedClubIds, setFavoriteClubIds } = useOnboarding();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => savedClubIds);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [clubsByLeagueId, setClubsByLeagueId] = useState<Record<string, LeagueClubsState>>({});

  const leagueIds = useMemo(() => favoriteLeagues.map((league) => league.id), [favoriteLeagues]);
  const isSearchActive = debouncedSearch.trim().length > 0;
  const limit = isSearchActive ? SEARCH_LIMIT : DEFAULT_LEAGUE_LIMIT;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  const requestClubs = useCallback(async () => {
    if (leagueIds.length === 0) return {};

    const initial: Record<string, LeagueClubsState> = {};
    for (const leagueId of leagueIds) initial[leagueId] = emptyLeagueState();
    setClubsByLeagueId(initial);

    const results = await Promise.all(
      leagueIds.map(async (leagueId) => {
        try {
          const { clubs, pagination } = await fetchClubs({
            leagueIds: [leagueId],
            search: debouncedSearch,
            offset: 0,
            limit,
          });
          return { leagueId, clubs, pagination, error: null as string | null };
        } catch (error) {
          return {
            leagueId,
            clubs: [] as FavoriteClub[],
            pagination: null as PaginationMeta | null,
            error: getClubsLoadErrorMessage(error),
          };
        }
      }),
    );

    const failedResults = results.filter((item) => item.error);
    if (failedResults.length === results.length) {
      throw new Error(failedResults[0]?.error ?? getClubsLoadErrorMessage(null));
    }

    const next: Record<string, LeagueClubsState> = {};
    for (const item of results) {
      next[item.leagueId] = {
        clubs: item.clubs,
        pagination: item.pagination,
        status: item.error ? 'error' : 'success',
        error: item.error,
        isLoadingMore: false,
        loadMoreError: null,
      };
    }
    return next;
  }, [debouncedSearch, leagueIds, limit]);

  const {
    status: loadStatus,
    error: loadError,
    retry: retryLoad,
  } = useAsyncRequest({
    request: requestClubs,
    mapError: getClubsLoadErrorMessage,
    onSuccess: (data) => setClubsByLeagueId(data),
  });

  // Гидрация выборов делается в `RequireOnboarding` (из профиля), чтобы избежать гонок.

  const clubsInLeagues = useMemo(
    () => Object.values(clubsByLeagueId).flatMap((state) => state.clubs),
    [clubsByLeagueId],
  );

  const groupedByLeague = useMemo(() => {
    const groups = favoriteLeagues.map((league) => {
      const state = clubsByLeagueId[league.id];

      return {
        leagueId: league.id,
        leagueName: league.name,
        clubs: state?.clubs ?? [],
        error: state?.error ?? null,
        canLoadMore:
          (state?.status ?? 'loading') === 'success' && (state?.pagination?.hasMore ?? false),
        isLoadingMore: state?.isLoadingMore ?? false,
        loadMoreError: state?.loadMoreError ?? null,
      };
    });

    if (!isSearchActive) return groups;

    return groups.filter((group) => group.clubs.length > 0 || group.error);
  }, [clubsByLeagueId, favoriteLeagues, isSearchActive]);

  const isCatalogUnavailable =
    loadStatus === 'success' &&
    !isSearchActive &&
    leagueIds.length > 0 &&
    clubsInLeagues.length === 0;

  const isSearchEmpty = loadStatus === 'success' && isSearchActive && groupedByLeague.length === 0;

  const loadMoreForLeague = useCallback(
    async (leagueId: string) => {
      const state = clubsByLeagueId[leagueId];
      if (!state) return;
      if (state.status !== 'success') return;
      if (state.isLoadingMore) return;
      if (!state.pagination?.hasMore) return;

      setClubsByLeagueId((current) => ({
        ...current,
        [leagueId]: { ...state, isLoadingMore: true, loadMoreError: null },
      }));

      try {
        const { clubs: nextClubs, pagination: nextPagination } = await fetchClubs({
          leagueIds: [leagueId],
          search: debouncedSearch,
          offset: state.pagination.offset + state.pagination.limit,
          limit,
        });

        setClubsByLeagueId((current) => {
          const currentState = current[leagueId];
          if (!currentState) return current;
          return {
            ...current,
            [leagueId]: {
              ...currentState,
              clubs: [...currentState.clubs, ...nextClubs],
              pagination: nextPagination,
              isLoadingMore: false,
              loadMoreError: null,
            },
          };
        });
      } catch (error) {
        const message = getClubsLoadErrorMessage(error);
        setClubsByLeagueId((current) => {
          const currentState = current[leagueId];
          if (!currentState) return current;
          return {
            ...current,
            [leagueId]: { ...currentState, isLoadingMore: false, loadMoreError: message },
          };
        });
      }
    },
    [clubsByLeagueId, debouncedSearch, limit],
  );

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
    setFavoriteClubIds(selectedIds);
    setSaveStatus('idle');

    void (async () => {
      try {
        await patchMyProfile({ favoriteClubIds: selectedIds });
      } catch (error) {
        setSaveStatus('error');
        setSaveError(getProfileSaveErrorMessage(error));
      }
    })();

    return true;
  };

  const canContinue = loadStatus === 'success' && selectedIds.length > 0 && saveStatus !== 'saving';

  return {
    leagueCount: favoriteLeagues.length,
    search,
    setSearch,
    selectedIds,
    toggleClub,
    groupedByLeague,
    loadMoreForLeague,
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
