export type UserRole = 'USER' | 'ADMIN' | 'BOT';

export type AuthUser = {
  id: string;
  email: string | null;
  login: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type SignupInput = {
  email: string;
  login: string;
  password: string;
  displayName: string;
};

export type LoginInput = {
  emailOrLogin: string;
  password: string;
};

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  error: string | null;
};
