const ACCESS_TOKEN_COOKIE = 'fp_access_token';
const REFRESH_TOKEN_COOKIE = 'fp_refresh_token';

/** Access token — короткий TTL; refresh — дольше. Точные сроки задаёт бэкенд при выдаче JWT. */
const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 15;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const isSecureContext = (): boolean =>
  typeof window !== 'undefined' && window.location.protocol === 'https:';

const writeCookie = (name: string, value: string, maxAgeSeconds: number): void => {
  const secure = isSecureContext() ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
};

const readCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const deleteCookie = (name: string): void => {
  const secure = isSecureContext() ? '; Secure' : '';
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
};

export const readAuthTokensFromCookies = (): AuthTokens | null => {
  const accessToken = readCookie(ACCESS_TOKEN_COOKIE);
  const refreshToken = readCookie(REFRESH_TOKEN_COOKIE);

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
};

export const saveAuthTokensToCookies = (tokens: AuthTokens): void => {
  writeCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, ACCESS_TOKEN_MAX_AGE_SECONDS);
  writeCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, REFRESH_TOKEN_MAX_AGE_SECONDS);
};

export const clearAuthCookies = (): void => {
  deleteCookie(ACCESS_TOKEN_COOKIE);
  deleteCookie(REFRESH_TOKEN_COOKIE);
};
