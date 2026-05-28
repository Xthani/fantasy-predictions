import { useCallback, useMemo, useState } from 'react';
import { fetchMatches, getMatchesLoadErrorMessage } from '@/features/match-feed';
import {
  fetchMyPredictions,
  getPredictionSaveErrorMessage,
  savePrediction,
  type PredictionDto,
} from '@/features/quick-prediction';
import { onboardingStorage, useOnboarding } from '@/features/onboarding';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { Match } from '@/shared/types/match';
import type { PaginationMeta } from '@/shared/types/pagination';
import type { QuickPrediction } from '@/shared/types/quickPrediction';

const toQuickPrediction = (dto: PredictionDto): QuickPrediction => ({
  matchId: dto.matchId,
  homeScore: dto.homeScore,
  awayScore: dto.awayScore,
  savedAt: dto.savedAt,
});

const DEFAULT_MATCHES_LIMIT = 10;

export const useMatchesPage = () => {
  const { favoriteLeagues, favoriteClubIds } = useOnboarding();
  const [matchesList, setMatchesList] = useState<Match[]>([]);
  const [predictionsByMatchId, setPredictionsByMatchId] = useState<Record<string, QuickPrediction>>(
    {},
  );
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const leagueIds = useMemo(() => favoriteLeagues.map((league) => league.id), [favoriteLeagues]);

  const loadMatchesFeed = useCallback(async (): Promise<Match[]> => {
    if (leagueIds.length === 0 || favoriteClubIds.length === 0) {
      setPagination({ offset: 0, limit: DEFAULT_MATCHES_LIMIT, total: 0, hasMore: false });
      setMatchesList([]);
      setPredictionsByMatchId({});
      return [];
    }

    setLoadMoreError(null);
    const { matches, pagination: meta } = await fetchMatches({
      leagueIds,
      clubIds: favoriteClubIds,
      offset: 0,
      limit: DEFAULT_MATCHES_LIMIT,
    });
    setPagination(meta);
    setMatchesList(matches);

    if (matches.length === 0) {
      setPredictionsByMatchId({});
      return matches;
    }

    const predictions = await fetchMyPredictions(matches.map((match) => match.id));
    const nextMap: Record<string, QuickPrediction> = {};
    for (const prediction of predictions) {
      nextMap[prediction.matchId] = toQuickPrediction(prediction);
    }
    setPredictionsByMatchId(nextMap);

    return matches;
  }, [favoriteClubIds, leagueIds]);

  const { status: loadStatus, error: loadError, retry: retryLoad } = useAsyncRequest({
    request: loadMatchesFeed,
    mapError: getMatchesLoadErrorMessage,
  });

  const matchList = useMemo(() => matchesList, [matchesList]);

  const hasMoreMatches = pagination?.hasMore ?? false;

  const loadMoreMatches = useCallback(async () => {
    if (loadStatus !== 'success') return;
    if (isLoadingMore) return;
    if (!pagination?.hasMore) return;

    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const { matches: nextMatches, pagination: nextMeta } = await fetchMatches({
        leagueIds,
        clubIds: favoriteClubIds,
        offset: pagination.offset + pagination.limit,
        limit: pagination.limit,
      });

      if (nextMatches.length === 0) {
        setPagination(nextMeta);
        return;
      }

      setMatchesList((current) => [...current, ...nextMatches]);

      const newMatchIds = nextMatches
        .map((match) => match.id)
        .filter((id) => !predictionsByMatchId[id]);

      if (newMatchIds.length > 0) {
        const predictions = await fetchMyPredictions(newMatchIds);
        setPredictionsByMatchId((current) => {
          const next = { ...current };
          for (const prediction of predictions) {
            next[prediction.matchId] = toQuickPrediction(prediction);
          }
          return next;
        });
      }

      setPagination(nextMeta);
    } catch (error) {
      setLoadMoreError(getMatchesLoadErrorMessage(error));
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    favoriteClubIds,
    isLoadingMore,
    leagueIds,
    loadStatus,
    pagination,
    predictionsByMatchId,
  ]);

  const activeMatch = useMemo(
    () => matchList.find((match) => match.id === activeMatchId) ?? null,
    [activeMatchId, matchList],
  );

  const activePrediction = activeMatchId ? (predictionsByMatchId[activeMatchId] ?? null) : null;

  const openMatch = (matchId: string) => {
    setSaveError(null);
    setActiveMatchId(matchId);
  };

  const closeSheet = () => {
    setSaveError(null);
    setActiveMatchId(null);
  };

  const saveMatchPrediction = async (homeScore: number, awayScore: number) => {
    if (!activeMatchId) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const saved = await savePrediction({
        matchId: activeMatchId,
        homeScore,
        awayScore,
      });
      setPredictionsByMatchId((current) => ({
        ...current,
        [activeMatchId]: toQuickPrediction(saved),
      }));
      onboardingStorage.writeHasAnyPrediction(true);
      setActiveMatchId(null);
    } catch (error) {
      setSaveError(getPredictionSaveErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const isFavoriteClub = useCallback(
    (clubId: string) => favoriteClubIds.includes(clubId),
    [favoriteClubIds],
  );

  const hasAnyPrediction = useMemo(
    () => Object.keys(predictionsByMatchId).length > 0 || onboardingStorage.readHasAnyPrediction(),
    [predictionsByMatchId],
  );

  return {
    hasLeagues: favoriteLeagues.length > 0,
    hasClubs: favoriteClubIds.length > 0,
    matches: matchList,
    loadStatus,
    loadError,
    retryLoad,
    predictionsByMatchId,
    hasAnyPrediction,
    hasMoreMatches,
    loadMoreMatches,
    isLoadingMore,
    loadMoreError,
    activeMatch,
    activePrediction,
    openMatch,
    closeSheet,
    saveMatchPrediction,
    saveError,
    isSaving,
    isFavoriteClub,
  };
};
