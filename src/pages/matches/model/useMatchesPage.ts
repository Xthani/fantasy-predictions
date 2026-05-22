import { useMemo, useState } from 'react';
import { getLeagueNameById, getPreferences } from '@/features/onboarding/lib/preferencesStorage';
import {
  getQuickPredictions,
  saveQuickPrediction,
} from '@/features/quick-prediction/lib/predictionsStorage';
import type { LeagueFilterOption } from '@/features/match-feed/ui/LeagueFilterChips';
import { getMatchesByLeagueIds } from '@/shared/mocks/matches';
import type { Match } from '@/shared/types/match';

const ALL_FILTER = 'all';

export const useMatchesPage = () => {
  const { favoriteLeagueIds, favoriteClubIds } = getPreferences();
  const [leagueFilter, setLeagueFilter] = useState(ALL_FILTER);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [predictions, setPredictions] = useState(() => getQuickPredictions());
  const [toast, setToast] = useState<string | null>(null);

  const allMatches = useMemo(() => getMatchesByLeagueIds(favoriteLeagueIds), [favoriteLeagueIds]);

  const predictionByMatchId = useMemo(() => {
    const map = new Map(predictions.map((p) => [p.matchId, p]));
    return (matchId: string) => map.get(matchId) ?? null;
  }, [predictions]);

  const filterOptions: LeagueFilterOption[] = useMemo(() => {
    const leagueChips = favoriteLeagueIds.map((id) => ({
      id,
      label: getLeagueNameById(id),
    }));
    return [{ id: ALL_FILTER, label: 'Все' }, ...leagueChips];
  }, [favoriteLeagueIds]);

  const visibleMatches = useMemo(() => {
    if (leagueFilter === ALL_FILTER) return allMatches;
    return allMatches.filter((match) => match.leagueId === leagueFilter);
  }, [allMatches, leagueFilter]);

  const activeMatch: Match | null =
    activeMatchId != null ? (allMatches.find((m) => m.id === activeMatchId) ?? null) : null;

  const isFavoriteMatch = (match: Match) =>
    favoriteClubIds.includes(match.homeClubId) || favoriteClubIds.includes(match.awayClubId);

  const openMatch = (matchId: string) => setActiveMatchId(matchId);
  const closeSheet = () => setActiveMatchId(null);

  const saveScore = (homeScore: number, awayScore: number) => {
    if (!activeMatchId) return;
    saveQuickPrediction(activeMatchId, homeScore, awayScore);
    setPredictions(getQuickPredictions());
    setActiveMatchId(null);
    setToast('Прогноз сохранён');
    window.setTimeout(() => setToast(null), 2500);
  };

  const activePrediction = activeMatch
    ? (predictions.find((p) => p.matchId === activeMatch.id) ?? null)
    : null;

  const hasLeagues = favoriteLeagueIds.length > 0;
  const isEmpty = visibleMatches.length === 0;

  return {
    hasLeagues,
    isEmpty,
    filterOptions,
    leagueFilter,
    setLeagueFilter,
    visibleMatches,
    predictionByMatchId,
    isFavoriteMatch,
    openMatch,
    closeSheet,
    saveScore,
    activeMatch,
    activePrediction,
    toast,
  };
};
