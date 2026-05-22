import { createContext, useContext } from 'react';
import type { AuthState, LoginInput, SignupInput } from '@/features/auth/model/auth.types';

export type AuthContextValue = AuthState & {
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInWithEmailPassword: (input: LoginInput) => Promise<void>;
  signUpWithEmailPassword: (input: SignupInput) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
