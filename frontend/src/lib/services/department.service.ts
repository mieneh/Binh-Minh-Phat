import { apiRequest } from '@/lib/api';

export interface Department {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentListResponse {
  status: number;
  data: Department[];
}

export interface DepartmentDetailResponse {
  status: number;
  data: Department;
}

export interface DepartmentMutationResponse {
  status: number;
  message?: string;
  data: Department;
}

export const departmentService = {
  async getAll(): Promise<DepartmentListResponse> {
    return apiRequest('/departments', {
      method: 'GET',
      auth: true,
    });
  },

  async getOne(id: string): Promise<DepartmentDetailResponse> {
    return apiRequest(`/departments/${id}`, {
      method: 'GET',
      auth: true,
    });
  },

  async create(data: {
    name: string;
    description?: string;
  }): Promise<DepartmentMutationResponse> {
    return apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
  },

  async update(
    id: string,
    data: { name?: string; description?: string },
  ): Promise<DepartmentMutationResponse> {
    return apiRequest(`/departments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
  },

  async remove(id: string): Promise<{ status: number; message?: string }> {
    return apiRequest(`/departments/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
