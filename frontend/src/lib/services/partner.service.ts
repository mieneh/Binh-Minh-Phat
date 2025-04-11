import { apiRequest } from '@/lib/api';

export interface PartnerContact {
  phone?: string;
  email?: string;
  hotline?: string;
}

export interface Partner {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  address?: string;
  contact?: PartnerContact;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartnerListResponse {
  status: number;
  data: Partner[];
}

export interface PartnerDetailResponse {
  status: number;
  data: Partner;
}

export interface PartnerMutationResponse {
  status: number;
  message?: string;
  data: Partner;
}

export const partnerService = {
  async getAll(): Promise<PartnerListResponse> {
    const res = await apiRequest<PartnerListResponse>('/partners', {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async getOne(id: string): Promise<PartnerDetailResponse> {
    const res = await apiRequest<PartnerDetailResponse>(`/partners/${id}`, {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async create(data: {
    name: string;
    logo?: string;
    website?: string;
    address?: string;
    contact?: PartnerContact;
    note?: string;
  }): Promise<PartnerMutationResponse> {
    const res = await apiRequest<PartnerMutationResponse>('/partners', {
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
      logo?: string;
      website?: string;
      address?: string;
      contact?: PartnerContact;
      note?: string;
      removeLogo?: boolean;
    },
  ): Promise<PartnerMutationResponse> {
    const res = await apiRequest<PartnerMutationResponse>(`/partners/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      auth: true,
    });
    return res;
  },

  async remove(id: string): Promise<{ status: number; message?: string }> {
    const res = await apiRequest<{ status: number; message?: string }>(`/partners/${id}`,{
      method: 'DELETE',
      auth: true,
    });
    return res;
  },
};
