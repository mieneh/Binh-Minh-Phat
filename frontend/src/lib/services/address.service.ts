import { apiRequest } from '@/lib/api';

export interface AddressLocation {
    province: string;
    ward?: string;
    street?: string;
}

export interface Address {
    _id: string;
    branchName: string;
    location: AddressLocation;
    hotline?: string;
    note?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddressListResponse {
    status: number;
    data: Address[];
}

export interface AddressDetailResponse {
    status: number;
    data: Address;
}

export interface AddressMutationResponse {
    status: number;
    message?: string;
    data: Address;
}

export const addressService = {
    async getAll(): Promise<AddressListResponse> {
        return apiRequest('/addresses', {
            method: 'GET',
            auth: true,
        });
    },

    async getOne(id: string): Promise<AddressDetailResponse> {
        return apiRequest(`/addresses/${id}`, {
            method: 'GET',
            auth: true,
        });
    },

    async create(data: {
        branchName: string;
        location: AddressLocation;
        hotline?: string;
        note?: string;
    }): Promise<AddressMutationResponse> {
        return apiRequest('/addresses', {
            method: 'POST',
            body: JSON.stringify(data),
            auth: true,
        });
    },

    async update(
        id: string,
        data: {
            branchName?: string;
            location?: AddressLocation;
            hotline?: string;
            note?: string;
        },
    ): Promise<AddressMutationResponse> {
        return apiRequest(`/addresses/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            auth: true,
        });
    },

    async remove(id: string): Promise<{ status: number; message?: string }> {
        return apiRequest(`/addresses/${id}`, {
            method: 'DELETE',
            auth: true,
        });
    },
};
