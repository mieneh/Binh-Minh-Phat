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

  async getOne(code: string): Promise<PositionDetailResponse> {
    return apiRequest(`/positions/${code}`, {
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
    code: string,
    data: {
      code?: string;
      name?: string;
      departmentId?: string;
      description?: string;
      requirement?: string;
    },
  ): Promise<PositionMutationResponse> {
    return apiRequest(`/positions/${code}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
  },

  async remove(code: string): Promise<{ status: number; message?: string }> {
    return apiRequest(`/positions/${code}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
