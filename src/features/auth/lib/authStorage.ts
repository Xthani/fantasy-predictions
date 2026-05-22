import type { AuthUser } from '@/features/auth/model/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export type StoredAuthSession = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export interface AuthStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const webAuthStorage: AuthStorage = {
  async getItem(key) {
    return localStorage.getItem(key);
  },
  async setItem(key, value) {
    localStorage.setItem(key, value);
  },
  async removeItem(key) {
    localStorage.removeItem(key);
  },
};

const readUser = (rawUser: string | null): AuthUser | null => {
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
};

export const readStoredAuthSessionSync = (): StoredAuthSession | null => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const user = readUser(localStorage.getItem(USER_KEY));

  if (!accessToken || !refreshToken || !user) return null;

  return { accessToken, refreshToken, user };
};

export const getStoredAuthSession = async (): Promise<StoredAuthSession | null> => {
  const [accessToken, refreshToken, rawUser] = await Promise.all([
    webAuthStorage.getItem(ACCESS_TOKEN_KEY),
    webAuthStorage.getItem(REFRESH_TOKEN_KEY),
    webAuthStorage.getItem(USER_KEY),
  ]);
  const user = readUser(rawUser);

  if (!accessToken || !refreshToken || !user) return null;

  return { accessToken, refreshToken, user };
};

export const saveAuthSession = async (session: StoredAuthSession): Promise<void> => {
  // TODO: For production web, consider moving refreshToken to an httpOnly Secure SameSite cookie.
  await Promise.all([
    webAuthStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken),
    webAuthStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken),
    webAuthStorage.setItem(USER_KEY, JSON.stringify(session.user)),
  ]);
};

export const clearAuthSession = async (): Promise<void> => {
  await Promise.all([
    webAuthStorage.removeItem(ACCESS_TOKEN_KEY),
    webAuthStorage.removeItem(REFRESH_TOKEN_KEY),
    webAuthStorage.removeItem(USER_KEY),
  ]);
};
