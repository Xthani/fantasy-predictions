const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;
  skipAuthRetry?: boolean;
};

type AuthClientSession = {
  accessToken: string;
  refreshToken: string;
  user: unknown;
};

type AuthClientConfig = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  onSessionRefreshed: (session: AuthClientSession) => void | Promise<void>;
  onAuthExpired: () => void | Promise<void>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly details: unknown;

  constructor(
    message: string,
    status: number,
    code: string | null = null,
    details: unknown = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let authClientConfig: AuthClientConfig | null = null;

export const configureAuthClient = (config: AuthClientConfig): void => {
  authClientConfig = config;
};

const resolveUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

const parseJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('Сервер вернул некорректный JSON.', response.status);
  }
};

const getErrorMessage = (payload: unknown, fallback: string): string => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
    if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
      return message.join(', ');
    }
  }

  return fallback;
};

const getErrorCode = (payload: unknown): string | null => {
  if (payload && typeof payload === 'object' && 'code' in payload) {
    const code = (payload as { code: unknown }).code;
    if (typeof code === 'string') return code;
  }

  return null;
};

const isNgrokApiHost = /ngrok-free\.dev/i.test(API_BASE_URL);

const requestRaw = async (path: string, options: RequestOptions = {}): Promise<Response> => {
  const headers = new Headers({ Accept: 'application/json' });

  if (isNgrokApiHost) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth !== false) {
    const accessToken = authClientConfig?.getAccessToken();
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return fetch(resolveUrl(path), {
    method: options.method ?? 'GET',
    headers,
    credentials: 'include',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
};

const refreshSession = async (): Promise<AuthClientSession | null> => {
  const refreshToken = authClientConfig?.getRefreshToken();
  if (!refreshToken) return null;

  const response = await requestRaw('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
    skipAuthRetry: true,
  });

  if (!response.ok) return null;

  return (await parseJson(response)) as AuthClientSession;
};

export const httpRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  let response: Response;

  try {
    response = await requestRaw(path, options);
  } catch {
    throw new ApiError(
      'Не удалось подключиться к серверу. Проверь интернет и попробуй ещё раз.',
      0,
    );
  }

  if (
    response.status === 401 &&
    options.auth !== false &&
    !options.skipAuthRetry &&
    authClientConfig
  ) {
    const refreshedSession = await refreshSession();

    if (refreshedSession) {
      await authClientConfig.onSessionRefreshed(refreshedSession);
      response = await requestRaw(path, { ...options, skipAuthRetry: true });
    } else {
      await authClientConfig.onAuthExpired();
    }
  }

  if (!response.ok) {
    const payload = await parseJson(response);
    throw new ApiError(
      getErrorMessage(payload, 'Сервер отклонил запрос. Попробуй ещё раз.'),
      response.status,
      getErrorCode(payload),
      payload,
    );
  }

  return (await parseJson(response)) as T;
};
