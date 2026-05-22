import { httpRequest } from '@/shared/api/httpClient';
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  SignupInput,
  UserRole,
} from '@/features/auth/model/auth.types';

type RawAuthUser = Partial<AuthUser> & {
  name?: string | null;
  avatar?: string | null;
  image?: string | null;
};

type RawAuthResponse = {
  user: unknown;
  accessToken: string;
  refreshToken: string;
};

const isRawAuthUser = (user: unknown): user is RawAuthUser =>
  Boolean(user && typeof user === 'object');

const normalizeRole = (role: unknown): UserRole => {
  if (role === 'ADMIN' || role === 'BOT' || role === 'USER') return role;
  return 'USER';
};

const mapAuthUser = (user: unknown): AuthUser => {
  const rawUser = isRawAuthUser(user) ? user : {};

  return {
    id: String(rawUser.id ?? ''),
    email: rawUser.email ?? null,
    login: rawUser.login ?? null,
    displayName: rawUser.displayName ?? rawUser.name ?? null,
    avatarUrl: rawUser.avatarUrl ?? rawUser.avatar ?? rawUser.image ?? null,
    role: normalizeRole(rawUser.role),
  };
};

export const normalizeAuthResponse = (response: RawAuthResponse): AuthResponse => ({
  user: mapAuthUser(response.user),
  accessToken: response.accessToken,
  refreshToken: response.refreshToken,
});

export const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
  const response = await httpRequest<RawAuthResponse>('/api/auth/google', {
    method: 'POST',
    body: { idToken },
    auth: false,
  });

  return normalizeAuthResponse(response);
};

export const signupWithEmailPassword = async (input: SignupInput): Promise<AuthResponse> => {
  const response = await httpRequest<RawAuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: input,
    auth: false,
  });

  return normalizeAuthResponse(response);
};

export const loginWithEmailPassword = async (input: LoginInput): Promise<AuthResponse> => {
  const response = await httpRequest<RawAuthResponse>('/api/auth/login', {
    method: 'POST',
    body: {
      identifier: input.emailOrLogin,
      password: input.password,
    },
    auth: false,
  });

  return normalizeAuthResponse(response);
};

export const refreshAuth = async (refreshToken: string): Promise<AuthResponse> => {
  // TODO: Keep this endpoint aligned with the backend once /api/auth/refresh is implemented.
  const response = await httpRequest<RawAuthResponse>('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
    skipAuthRetry: true,
  });

  return normalizeAuthResponse(response);
};

export const logout = async (refreshToken: string): Promise<void> => {
  // TODO: If backend logout is unavailable, this may return 404/501; callers still clear local auth.
  await httpRequest<null>('/api/auth/logout', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
    skipAuthRetry: true,
  });
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  // TODO: Keep this endpoint aligned with the backend once /api/auth/me is implemented.
  const response = await httpRequest<unknown>('/api/auth/me');

  return mapAuthUser(response);
};
