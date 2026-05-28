const TOKEN_KEY = 'fp_accessToken';

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export type ApiErrorBody = {
  code: string;
  message: string | string[];
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string | string[],
  ) {
    super(Array.isArray(message) ? message.join(', ') : message);
    this.name = 'ApiError';
  }
}

const getBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
  if (!baseUrl) {
    throw new ApiError(
      0,
      'CONFIG_ERROR',
      'Не задан VITE_API_BASE_URL. Скопируй .env.example в .env.local',
    );
  }
  return baseUrl;
};

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | string[] | undefined>;
};

const buildUrl = (path: string, query?: RequestOptions['query']): string => {
  const url = new URL(`${getBaseUrl()}${path}`);
  if (!query) return url.toString();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
      return;
    }
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, auth = true, query } = options;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAccessToken();
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Нет токена');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let payload: ApiErrorBody = { code: 'UNKNOWN', message: response.statusText };
    try {
      payload = (await response.json()) as ApiErrorBody;
    } catch {
      /* ignore */
    }
    throw new ApiError(response.status, payload.code, payload.message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
