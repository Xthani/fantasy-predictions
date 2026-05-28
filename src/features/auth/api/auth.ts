import { apiRequest, clearAccessToken, setAccessToken } from '@/shared/api/httpClient';
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
} from '@/features/auth/model/auth.types';

export const register = async (payload: RegisterInput): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    auth: false,
    body: payload,
  });
  setAccessToken(data.accessToken);
  return data;
};

export const login = async (payload: LoginInput): Promise<AuthResponse> => {
  const data = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    auth: false,
    body: payload,
  });
  setAccessToken(data.accessToken);
  return data;
};

export const fetchMe = (): Promise<AuthUser> => apiRequest<AuthUser>('/api/auth/me');

export const logout = (): void => {
  clearAccessToken();
};
