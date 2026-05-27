import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  fetchMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from '@/features/auth/api/auth';
import { getAuthErrorMessage } from '@/features/auth/lib/authErrors';
import { AuthContext, type AuthContextValue } from '@/features/auth/model/authContext';
import type {
  AuthState,
  AuthUser,
  LoginInput,
  RegisterInput,
} from '@/features/auth/model/auth.types';
import { getAccessToken } from '@/shared/api/httpClient';

type AuthAction =
  | { type: 'loading' }
  | { type: 'authenticated'; payload: AuthUser }
  | { type: 'unauthenticated' }
  | { type: 'error'; payload: string }
  | { type: 'clearError' };

const initialState = (): AuthState => ({
  user: null,
  status: getAccessToken() ? 'idle' : 'unauthenticated',
  error: null,
});

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'loading':
      return { ...state, status: 'loading', error: null };
    case 'authenticated':
      return { user: action.payload, status: 'authenticated', error: null };
    case 'unauthenticated':
      return { user: null, status: 'unauthenticated', error: null };
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
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  const restoreSession = useCallback(async () => {
    if (!getAccessToken()) {
      dispatch({ type: 'unauthenticated' });
      return;
    }

    try {
      const user = await fetchMe();
      dispatch({ type: 'authenticated', payload: user });
    } catch {
      logoutRequest();
      dispatch({ type: 'unauthenticated' });
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const runAuthAction = useCallback(async (action: () => Promise<AuthUser>) => {
    dispatch({ type: 'loading' });
    try {
      const user = await action();
      dispatch({ type: 'authenticated', payload: user });
    } catch (error) {
      dispatch({ type: 'error', payload: getAuthErrorMessage(error) });
      throw error;
    }
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      await runAuthAction(async () => {
        const response = await loginRequest(input);
        return response.user;
      });
    },
    [runAuthAction],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      await runAuthAction(async () => {
        const response = await registerRequest(input);
        return response.user;
      });
    },
    [runAuthAction],
  );

  const logout = useCallback(() => {
    logoutRequest();
    dispatch({ type: 'unauthenticated' });
  }, []);

  const clearAuthError = useCallback(() => {
    dispatch({ type: 'clearError' });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearAuthError,
    }),
    [state, login, register, logout, clearAuthError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
