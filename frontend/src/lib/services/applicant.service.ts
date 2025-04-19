import { apiRequest } from '@/lib/api';
import { Recruitment } from './recruitment.service';
import { AddressLocation } from './address.service';

export type ApplicantStatus = 'NEW' | 'REVIEWED' | 'PASS' | 'FAIL';

export interface Applicant {
  _id: string;
  recruitmentId: Recruitment;
  fullName: string;
  dateOfBirth?: string;
  phone: string;
  address: AddressLocation;
  yearsOfExperience?: number;
  shortProfile?: string;
  cvLink?: string;
  positionCodeSnapshot: string;
  status: ApplicantStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicantListResponse {
  status: number;
  data: Applicant[];
}

export interface ApplicantDetailResponse {
  status: number;
  data: Applicant;
}

export interface ApplicantMutationResponse {
  status: number;
  message?: string;
  data: Applicant;
}

export const applicantService = {
  async getAll(): Promise<ApplicantListResponse> {
    const res = await apiRequest<ApplicantListResponse>('/applicants', {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async getOne(id: string): Promise<ApplicantDetailResponse> {
    const res = await apiRequest<ApplicantDetailResponse>(`/applicants/${id}`, {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async create(data: {
    recruitmentId: string;
    fullName: string;
    dateOfBirth?: string;
    phone: string;
    address: {
      province: string;
      ward: string;
      street: string;
    };
    yearsOfExperience?: number;
    shortProfile?: string;
    cvLink?: string;
    positionCodeSnapshot: string;
  }): Promise<ApplicantMutationResponse> {
    const res = await apiRequest<ApplicantMutationResponse>('/applicants', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    });
    return res;
  },

  async update(
    id: string,
    data: {
      fullName?: string;
      dateOfBirth?: string;
      phone?: string;
      address?: {
        province?: string;
        ward?: string;
        street?: string;
      };
      yearsOfExperience?: number;
      shortProfile?: string;
      cvLink?: string;
      status?: ApplicantStatus;
    },
  ): Promise<ApplicantMutationResponse> {
    const res = await apiRequest<ApplicantMutationResponse>(`/applicants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
    return res;
  },

  async remove(id: string): Promise<{ status: number; message?: string }> {
    const res = await apiRequest<{ status: number; message?: string }>(`/applicants/${id}`,{
      method: 'DELETE',
      auth: true,
    });
    return res;
  },
};
