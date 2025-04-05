import { apiRequest } from '@/lib/api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListResponse {
  status: number;
  data: Category[];
}

export interface CategoryDetailResponse {
  status: number;
  data: Category;
}

export interface CategoryMutationResponse {
  status: number;
  message?: string;
  data: Category;
}

export const categoryService = {
  async getAll(): Promise<CategoryListResponse> {
    const res = await apiRequest<CategoryListResponse>('/categories', {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async getOne(id: string): Promise<CategoryDetailResponse> {
    const res = await apiRequest<CategoryDetailResponse>(`/categories/${id}`, {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async create(data: { 
    name: string; 
    description?: string 
  }): Promise<CategoryMutationResponse> {
    const res = await apiRequest<CategoryMutationResponse>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
    return res;
  },

  async update(
    id: string,
    data: { 
      name?: string; 
      description?: string 
    },
  ): Promise<CategoryMutationResponse> {
    const res = await apiRequest<CategoryMutationResponse>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
    return res;
  },

  async remove(id: string): Promise<{ status: number; message?: string }> {
    const res = await apiRequest<{ status: number; message?: string }>(`/categories/${id}`, {
      method: 'DELETE',
      auth: true,
    });
    return res;
  },
};
