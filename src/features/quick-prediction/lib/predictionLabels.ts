import type { PredictionComponents, PredictionStyle } from '@/features/quick-prediction/types/prediction';

export const STYLE_OPTIONS: PredictionStyle[] = ['defensive', 'balanced', 'aggressive'];

export const STYLE_LABELS: Record<PredictionStyle, string> = {
  defensive: 'Оборонительный',
  balanced: 'Сбалансированный',
  aggressive: 'Атакующий',
  manual: 'Ручной',
};

export const COMPONENT_LABELS: Record<string, string> = {
  doubleChance: 'Двойной шанс',
  matchOutcome: 'Исход',
  totalGoals: 'Тотал',
  btts: 'Обе забьют',
  homeIndividualTotal: 'Тотал хозяев',
  awayIndividualTotal: 'Тотал гостей',
  goalDifference: 'Фора',
  exactTotalGoals: 'Точный тотал',
  teamGoals: 'Голы команд',
  exactScore: 'Точный счёт',
};

export const formatOutcome = (outcome: PredictionComponents['matchOutcome']): string => {
  if (outcome === 'home') return 'П1';
  if (outcome === 'away') return 'П2';
  return 'Ничья';
};

export const formatTotalGoals = (line: PredictionComponents['totalGoals']): string =>
  line === 'over25' ? 'Больше 2.5' : 'Меньше 2.5';

export const formatBtts = (value: PredictionComponents['btts']): string =>
  value === 'yes' ? 'Да' : 'Нет';
