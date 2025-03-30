import { apiRequest } from '@/lib/api';
import { saveTokens, clearTokens, getAccessToken } from '@/utils/token';

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  role?: 'admin' | 'employee';
  createdAt?: string;
  updatedAt?: string;
}

export interface SigninResponse {
  status: number;
  message?: string;
  tokens: Tokens;
  user: User;
}

export interface SignoutResponse {
  status: number;
  message?: string;
}

export interface MeResponse {
  status: number;
  user: User;
}

export const authService = {
  async signin(data: { email: string; password: string }): Promise<SigninResponse> {
    const res = await apiRequest<SigninResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.tokens?.accessToken) {
      saveTokens(res.tokens.accessToken, res.tokens.refreshToken);
    }

    return res;
  },

  async signout(): Promise<SignoutResponse> {
    const res = await apiRequest<SignoutResponse>('/auth/signout', { method: 'POST', auth: true });
    clearTokens();
    return res;
  },

  async getMe(): Promise<User | null> {
    const token = getAccessToken();
    if (!token) return null;
    const res = await apiRequest<MeResponse>('/auth/me', { auth: true });
    return res.user;
  },
};
