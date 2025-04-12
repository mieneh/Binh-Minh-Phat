import { apiRequest } from '@/lib/api';
import { AddressLocation } from './address.service'

export type UserRole = 'admin' | 'employee';

export interface User {
    _id: string;
    email: string;
    name?: string;
    phone?: string;
    avatar?: string;
    address?: AddressLocation;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserListResponse {
    status: number;
    data: User[];
}

export interface UserDetailResponse {
    status: number;
    data: User;
}

export interface UserMutationResponse {
    status: number;
    message?: string;
    data: User;
}

export interface ResetPasswordResponse {
    status: number;
    message?: string;
    data: {
        userId: string;
        email: string;
        newPassword: string;
    };
}

export const userService = {
    async getAll(): Promise<UserListResponse> {
        return apiRequest('/users', {
            method: 'GET',
            auth: true,
        });
    },

    async getOne(id: string): Promise<UserDetailResponse> {
        return apiRequest(`/users/${id}`, {
        method: 'GET',
        auth: true,
        });
    },

    async create(data: {
        email: string;
        name?: string;
        phone?: string;
        avatar?: string;
        address?: AddressLocation;
        role?: UserRole;
    }): Promise<UserMutationResponse> {
        return apiRequest<UserMutationResponse>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
            auth: true,
        });
    },

    async update(
        id: string,
        data: {
            name?: string;
            phone?: string;
            avatar?: string;
            address?: AddressLocation;
            role?: UserRole;
            removeAvatar?: boolean;
        },
    ): Promise<UserMutationResponse> {
        return apiRequest(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            auth: true,
        });
    },

    async remove(id: string): Promise<{ status: number; message?: string }> {
        return apiRequest(`/users/${id}`, {
            method: 'DELETE',
            auth: true,
        });
    },

    async resetPassword(
        id: string,
        data?: { newPassword?: string },
    ): Promise<ResetPasswordResponse> {
        return apiRequest(`/users/${id}/reset-password`, {
            method: 'POST',
            body: JSON.stringify(data ?? {}),
            auth: true,
        });
    },
};
