import { apiRequest } from '@/lib/api';
import { Position } from './position.service';
import { Address } from './address.service';

export interface Recruitment {
  _id: string;
  positionId: Position;
  addressId: Address;
  quantity: number;
  startDate: string;
  deadline: string;
  experience?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecruitmentListResponse {
  status: number;
  data: Recruitment[];
}

export interface RecruitmentDetailResponse {
  status: number;
  data: Recruitment;
}

export interface RecruitmentMutationResponse {
  status: number;
  message?: string;
  data: Recruitment;
}

export const recruitmentService = {
  async getAll(): Promise<RecruitmentListResponse> {
    return apiRequest('/recruitment', {
      method: 'GET',
      auth: true,
    });
  },

  async getActive(): Promise<RecruitmentListResponse> {
    return apiRequest('/recruitment/active', {
      method: 'GET',
      auth: false,
    });
  },

  async getOne(id: string): Promise<RecruitmentDetailResponse> {
    return apiRequest(`/recruitment/${id}`, {
      method: 'GET',
      auth: true,
    });
  },

  async create(data: {
    positionId: string;
    addressId: string;
    quantity: number;
    startDate: string;
    deadline: string;
    experience?: number;
  }): Promise<RecruitmentMutationResponse> {
    return apiRequest('/recruitment', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: true,
    });
  },

  async update(
    id: string,
    data: {
      positionId?: string;
      addressId?: string;
      quantity?: number;
      startDate?: string;
      deadline?: string;
      experience?: number;
      isActive?: boolean;
    },
  ): Promise<RecruitmentMutationResponse> {
    return apiRequest(`/recruitment/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
  },

  async close(id: string): Promise<RecruitmentMutationResponse> {
    return apiRequest(`/recruitment/${id}/close`, {
      method: 'PATCH',
      auth: true,
    });
  },

  async remove(id: string): Promise<{ status: number; message?: string }> {
    return apiRequest(`/recruitment/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
