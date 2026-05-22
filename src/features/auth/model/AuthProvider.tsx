import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  getCurrentUser,
  loginWithEmailPassword,
  loginWithGoogle,
  logout as requestLogout,
  normalizeAuthResponse,
  signupWithEmailPassword,
} from '@/features/auth/api/auth';
import {
  clearAuthSession,
  getStoredAuthSession,
  readStoredAuthSessionSync,
  saveAuthSession,
} from '@/features/auth/lib/authStorage';
import { AuthContext, type AuthContextValue } from '@/features/auth/model/authContext';
import type {
  AuthResponse,
  AuthState,
  AuthUser,
  LoginInput,
  SignupInput,
} from '@/features/auth/model/auth.types';
import { ApiError, configureAuthClient } from '@/shared/api/httpClient';

type AuthAction =
  | { type: 'loading' }
  | { type: 'authenticated'; payload: AuthResponse }
  | {
      type: 'sessionRestored';
      payload: { user: AuthUser; accessToken: string; refreshToken: string };
    }
  | { type: 'unauthenticated' }
  | { type: 'error'; payload: string }
  | { type: 'clearError' };

const storedSession = readStoredAuthSessionSync();

const initialState: AuthState = storedSession
  ? {
      user: storedSession.user,
      accessToken: storedSession.accessToken,
      refreshToken: storedSession.refreshToken,
      status: 'authenticated',
      error: null,
    }
  : {
      user: null,
      accessToken: null,
      refreshToken: null,
      status: 'unauthenticated',
      error: null,
    };

const getFriendlyAuthError = (error: unknown): string => {
  if (error instanceof ApiError) {
    if (error.status === 0) return error.message;
    if (error.status === 401) return 'Неверный email, логин или пароль.';
    if (error.status === 409) {
      const code = error.code?.toUpperCase();
      if (code?.includes('EMAIL')) return 'Аккаунт с таким email уже существует.';
      if (code?.includes('LOGIN')) return 'Такой логин уже занят.';
      return 'Аккаунт с такими данными уже существует.';
    }
    if (error.status >= 500) return 'Сервер временно недоступен. Попробуй позже.';
    return error.message;
  }

  return 'Что-то пошло не так. Попробуй ещё раз.';
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'loading':
      return { ...state, status: 'loading', error: null };
    case 'authenticated':
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        status: 'authenticated',
        error: null,
      };
    case 'sessionRestored':
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        status: 'authenticated',
        error: null,
      };
    case 'unauthenticated':
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        status: 'unauthenticated',
        error: null,
      };
    case 'error':
      return {
        ...state,
        status: state.user ? 'authenticated' : 'unauthenticated',
        error: action.payload,
      };
    case 'clearError':
      return { ...state, error: null };
  }
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    configureAuthClient({
      getAccessToken: () => readStoredAuthSessionSync()?.accessToken ?? null,
      getRefreshToken: () => readStoredAuthSessionSync()?.refreshToken ?? null,
      onSessionRefreshed: async (session) => {
        const nextSession = normalizeAuthResponse(session);
        await saveAuthSession(nextSession);
        dispatch({ type: 'authenticated', payload: nextSession });
      },
      onAuthExpired: async () => {
        await clearAuthSession();
        dispatch({ type: 'unauthenticated' });
      },
    });
  }, []);

  const persistAuth = useCallback(async (response: AuthResponse) => {
    await saveAuthSession(response);
    dispatch({ type: 'authenticated', payload: response });
  }, []);

  const runAuthAction = useCallback(
    async (action: () => Promise<AuthResponse>) => {
      dispatch({ type: 'loading' });
      try {
        await persistAuth(await action());
      } catch (error) {
        dispatch({ type: 'error', payload: getFriendlyAuthError(error) });
        throw error;
      }
    },
    [persistAuth],
  );

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      await runAuthAction(() => loginWithGoogle(idToken));
    },
    [runAuthAction],
  );

  const signInWithEmailPassword = useCallback(
    async (input: LoginInput) => {
      await runAuthAction(() => loginWithEmailPassword(input));
    },
    [runAuthAction],
  );

  const signUpWithEmailPassword = useCallback(
    async (input: SignupInput) => {
      await runAuthAction(() => signupWithEmailPassword(input));
    },
    [runAuthAction],
  );

  const restoreSession = useCallback(async () => {
    dispatch({ type: 'loading' });
    const session = await getStoredAuthSession();

    if (!session) {
      dispatch({ type: 'unauthenticated' });
      return;
    }

    try {
      const user = await getCurrentUser();
      const restoredSession = { ...session, user };
      await saveAuthSession(restoredSession);
      dispatch({ type: 'sessionRestored', payload: restoredSession });
    } catch {
      dispatch({ type: 'sessionRestored', payload: session });
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = readStoredAuthSessionSync()?.refreshToken;

    if (refreshToken) {
      try {
        await requestLogout(refreshToken);
      } catch {
        // Local logout must succeed even while backend logout is still being wired.
      }
    }

    await clearAuthSession();
    dispatch({ type: 'unauthenticated' });
  }, []);

  const clearAuthError = useCallback(() => {
    dispatch({ type: 'clearError' });
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signInWithGoogle,
      signInWithEmailPassword,
      signUpWithEmailPassword,
      restoreSession,
      logout,
      clearAuthError,
    }),
    [
      state,
      signInWithGoogle,
      signInWithEmailPassword,
      signUpWithEmailPassword,
      restoreSession,
      logout,
      clearAuthError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
