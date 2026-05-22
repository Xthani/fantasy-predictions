import { useCallback, useState } from 'react';
import { setSession } from '@/features/auth/lib/sessionStorage';

type SignInState = 'idle' | 'loading' | 'error';

export const useMockGoogleSignIn = () => {
  const [state, setState] = useState<SignInState>('idle');
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setSession({
        userId: 'mock_player_1',
        displayName: 'Игрок',
        provider: 'google',
      });
      setState('idle');
      return true;
    } catch {
      setError('Не удалось войти. Попробуй ещё раз.');
      setState('error');
      return false;
    }
  }, []);

  return { signInWithGoogle, state, error, isLoading: state === 'loading' };
};
