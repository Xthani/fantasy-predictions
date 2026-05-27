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
  clearAuthCookies,
  readAuthTokensFromCookies,
  saveAuthTokensToCookies,
} from '@/features/auth/lib/authCookies';
import { AuthContext, type AuthContextValue } from '@/features/auth/model/authContext';
import type {
  AuthResponse,
  AuthState,
  AuthUser,
  LoginInput,
  SignupInput,
} from '@/features/auth/model/auth.types';
import { getAuthErrorMessage } from '@/features/auth/lib/authErrors';
import { configureAuthClient } from '@/shared/api/httpClient';

type AuthAction =
  | { type: 'loading' }
  | { type: 'authenticated'; payload: { user: AuthUser; accessToken: string; refreshToken: string } }
  | { type: 'unauthenticated' }
  | { type: 'error'; payload: string }
  | { type: 'clearError' };

const createInitialState = (): AuthState => {
  const tokens = readAuthTokensFromCookies();

  if (tokens) {
    return {
      user: null,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      status: 'idle',
      error: null,
    };
  }

  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    status: 'unauthenticated',
    error: null,
  };
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
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  useEffect(() => {
    configureAuthClient({
      getAccessToken: () => readAuthTokensFromCookies()?.accessToken ?? null,
      getRefreshToken: () => readAuthTokensFromCookies()?.refreshToken ?? null,
      onSessionRefreshed: async (session) => {
        const nextSession = normalizeAuthResponse(session);
        saveAuthTokensToCookies({
          accessToken: nextSession.accessToken,
          refreshToken: nextSession.refreshToken,
        });
        dispatch({
          type: 'authenticated',
          payload: {
            user: nextSession.user,
            accessToken: nextSession.accessToken,
            refreshToken: nextSession.refreshToken,
          },
        });
      },
      onAuthExpired: async () => {
        clearAuthCookies();
        dispatch({ type: 'unauthenticated' });
      },
    });
  }, []);

  const persistAuth = useCallback(async (response: AuthResponse) => {
    saveAuthTokensToCookies({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    dispatch({
      type: 'authenticated',
      payload: {
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      },
    });
  }, []);

  const runAuthAction = useCallback(
    async (action: () => Promise<AuthResponse>) => {
      dispatch({ type: 'loading' });
      try {
        await persistAuth(await action());
      } catch (error) {
        dispatch({ type: 'error', payload: getAuthErrorMessage(error) });
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
    const tokens = readAuthTokensFromCookies();

    if (!tokens) {
      dispatch({ type: 'unauthenticated' });
      return;
    }

    // Do not dispatch `loading` here: RequireAuth unmounts children, which remounts
    // data pages and repeats API calls (e.g. GET /api/leagues twice on reload).
    try {
      const user = await getCurrentUser();
      dispatch({
        type: 'authenticated',
        payload: { user, ...tokens },
      });
    } catch {
      clearAuthCookies();
      dispatch({ type: 'unauthenticated' });
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = readAuthTokensFromCookies()?.refreshToken;

    if (refreshToken) {
      try {
        await requestLogout(refreshToken);
      } catch {
        // Local logout must succeed even while backend logout is still being wired.
      }
    }

    clearAuthCookies();
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
