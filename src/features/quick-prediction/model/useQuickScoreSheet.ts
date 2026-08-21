import { useEffect, useState } from 'react';
import { previewPrediction } from '@/features/quick-prediction/api/predictions';
import type {
  PredictionPreview,
  PredictionStyle,
} from '@/features/quick-prediction/types/prediction';

const clampScore = (value: number) => Math.min(9, Math.max(0, value));

type UseQuickScoreSheetParams = {
  initialHome: number;
  initialAway: number;
  initialStyle?: PredictionStyle;
  initialIsOfficial?: boolean;
};

export const useQuickScoreSheet = ({
  initialHome,
  initialAway,
  initialStyle = 'balanced',
  initialIsOfficial = false,
}: UseQuickScoreSheetParams) => {
  const [home, setHome] = useState(initialHome);
  const [away, setAway] = useState(initialAway);
  const [style, setStyle] = useState<PredictionStyle>(initialStyle);
  const [isOfficial, setIsOfficial] = useState(initialIsOfficial);
  const [preview, setPreview] = useState<PredictionPreview | null>(null);
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const changeHome = (delta: number) => setHome((value) => clampScore(value + delta));
  const changeAway = (delta: number) => setAway((value) => clampScore(value + delta));
  const setHomeScore = (value: number) => setHome(clampScore(value));
  const setAwayScore = (value: number) => setAway(clampScore(value));

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      setPreviewStatus('loading');
      previewPrediction({ homeScore: home, awayScore: away, style })
        .then((result) => {
          if (cancelled) return;
          setPreview(result);
          setPreviewStatus('idle');
        })
        .catch(() => {
          if (cancelled) return;
          setPreview(null);
          setPreviewStatus('error');
        });
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [home, away, style]);

  return {
    home,
    away,
    style,
    isOfficial,
    preview,
    previewStatus,
    changeHome,
    changeAway,
    setHomeScore,
    setAwayScore,
    setStyle,
    setIsOfficial,
  };
};
