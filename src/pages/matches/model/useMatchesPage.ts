import { useCallback, useMemo, useState } from 'react';
import { fetchMatches } from '@/features/match-feed/api/matches';
import { useOnboarding } from '@/features/onboarding/model/onboardingContext';
import {
  fetchMyPredictions,
  savePrediction,
  type PredictionDto,
} from '@/features/quick-prediction/api/predictions';
import { getMatchesLoadErrorMessage } from '@/features/match-feed/lib/matchErrors';
import { getPredictionSaveErrorMessage } from '@/features/quick-prediction/lib/predictionErrors';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';
import type { Match } from '@/shared/types/match';
import type { QuickPrediction } from '@/shared/types/quickPrediction';

const toQuickPrediction = (dto: PredictionDto): QuickPrediction => ({
  matchId: dto.matchId,
  homeScore: dto.homeScore,
  awayScore: dto.awayScore,
  savedAt: dto.savedAt,
});

export const useMatchesPage = () => {
  const { favoriteLeagues, favoriteClubIds } = useOnboarding();
  const [predictionsByMatchId, setPredictionsByMatchId] = useState<Record<string, QuickPrediction>>(
    {},
  );
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const leagueIds = useMemo(() => favoriteLeagues.map((league) => league.id), [favoriteLeagues]);

  const loadMatchesFeed = useCallback(async (): Promise<Match[]> => {
    const matches = await fetchMatches({
      leagueIds,
      clubIds: favoriteClubIds,
      limit: 10,
    });

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

  const {
    data: matches,
    status: loadStatus,
    error: loadError,
    retry: retryLoad,
  } = useAsyncRequest({
    request: loadMatchesFeed,
    mapError: getMatchesLoadErrorMessage,
  });

  const matchList = useMemo(() => matches ?? [], [matches]);

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

  return {
    hasLeagues: favoriteLeagues.length > 0,
    hasClubs: favoriteClubIds.length > 0,
    matches: matchList,
    loadStatus,
    loadError,
    retryLoad,
    predictionsByMatchId,
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
