import { apiRequest } from '@/lib/api';
import { saveTokens, clearTokens, getAccessToken } from '@/utils/token';
import { User } from '@/lib/services/user.service';

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
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

export interface UpdateProfileResponse {
  status: number;
  message?: string;
  user: User;
}

export interface ChangePasswordResponse {
  status: number;
  message?: string;
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

  async updateProfile(data: {
    name: string;
    phone: string;
    avatar?: string;
    address?: {
      province?: string;
      ward?: string;
      street?: string;
    };
    removeAvatar?: boolean;
  }) : Promise<UpdateProfileResponse> {
    const res = await apiRequest<UpdateProfileResponse>('/auth/profile', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
    return res;
  },

  async changePassword(data: { oldPassword: string; newPassword: string }) : Promise<ChangePasswordResponse> {
    const res = await apiRequest<ChangePasswordResponse>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
    return res;
  }

};
