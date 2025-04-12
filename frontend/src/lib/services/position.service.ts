import { apiRequest } from '@/lib/api';
import { Department } from './department.service';

export interface Position {
  _id: string;
  code: string;
  name: string;
  departmentId: Department;
  description?: string;
  requirement?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PositionListResponse {
  status: number;
  data: Position[];
}

export interface PositionDetailResponse {
  status: number;
  data: Position;
}

export interface PositionMutationResponse {
  status: number;
  message?: string;
  data: Position;
}

export const positionService = {
  async getAll(): Promise<PositionListResponse> {
    return apiRequest('/positions', {
      method: 'GET',
      auth: true,
    });
  },

  async getOne(id: string): Promise<PositionDetailResponse> {
    return apiRequest(`/positions/${id}`, {
      method: 'GET',
      auth: true,
    });
  },

  async create(data: {
    code: string;
    name: string;
    departmentId: string;
    description?: string;
    requirement?: string;
  }): Promise<PositionMutationResponse> {
    return apiRequest('/positions', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
  },

  async update(
    id: string,
    data: {
      code?: string;
      name?: string;
      departmentId?: string;
      description?: string;
      requirement?: string;
    },
  ): Promise<PositionMutationResponse> {
    return apiRequest(`/positions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
  },

  async remove(id: string): Promise<{ status: number; message?: string }> {
    return apiRequest(`/positions/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
