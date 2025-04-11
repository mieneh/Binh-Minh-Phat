import { apiRequest } from '@/lib/api';

export interface Product {
    _id: string;
    lot: string;
    name: string;
    description?: string;
    image?: string;
    quantity?: number;
    categoryId?: string;
    partnerId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductListResponse {
  status: number;
  data: Product[];
}

export interface ProductDetailResponse {
  status: number;
  data: Product;
}

export interface ProductMutationResponse {
  status: number;
  message?: string;
  data: Product;
}

export const productService = {
    async getAll(): Promise<ProductListResponse> {
        const res = await apiRequest<ProductListResponse>('/products', {
            method: 'GET',
            auth: true,
        });
        return res;
    },

    async getOne(id: string): Promise<ProductDetailResponse> {
        const res = await apiRequest<ProductDetailResponse>(`/products/${id}`, {
          method: 'GET',
          auth: true,
        });
        return res;
    },

    async create(data: {
        lot: string;
        name: string;
        description?: string;
        image?: string;
        quantity?: number;
        categoryId?: string;
        partnerId?: string;
    }): Promise<ProductMutationResponse> {
        const res = await apiRequest<ProductMutationResponse>('/products', {
            method: 'POST',
            body: JSON.stringify(data),
            auth: true,
        });
        return res;
    },

    async update(
        id: string, 
        data: {
            lot?: string;
            name?: string;
            description?: string;
            image?: string;
            quantity?: number;
            categoryId?: string;
            partnerId?: string;
            removeImage?: boolean;
        },
    ): Promise<ProductMutationResponse> {
        const res = await apiRequest<ProductMutationResponse>(`/products/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            auth: true,
        });
        return res;
    },

    async remove(id: string): Promise<{ status: number; message?: string }> {
        const res = await apiRequest<{ status: number; message?: string }>(`/products/${id}`, {
            method: 'DELETE',
            auth: true,
        });
        return res;
    },
};
