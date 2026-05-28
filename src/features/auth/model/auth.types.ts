export type AuthUser = {
  id: string;
  login: string;
  displayName: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type LoginInput = {
  login: string;
  password: string;
};

export type RegisterInput = {
  login: string;
  password: string;
  displayName?: string;
};

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
};
