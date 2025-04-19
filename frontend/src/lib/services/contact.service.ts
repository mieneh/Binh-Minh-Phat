import { apiRequest } from '@/lib/api';

export interface Contact {
  _id: string;
  fullName: string;
  email: string;
  company?: string;
  country?: string;
  volume?: string;
  message: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactListResponse {
  status: number;
  data: Contact[];
}

export interface ContactDetailResponse {
  status: number;
  data: Contact;
}

export interface ContactMutationResponse {
  status: number;
  message?: string;
  data: Contact;
}

export const contactService = {
  async create(data: {
    fullName: string;
    email: string;
    company?: string;
    country?: string;
    volume?: string;
    message: string;
  }): Promise<ContactMutationResponse> {
    const res = await apiRequest<ContactMutationResponse>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
      auth: false,
    });
    return res;
  },

  async getAll(): Promise<ContactListResponse> {
    const res = await apiRequest<ContactListResponse>('/contacts', {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async getOne(id: string): Promise<ContactDetailResponse> {
    const res = await apiRequest<ContactDetailResponse>(`/contacts/${id}`, {
      method: 'GET',
      auth: true,
    });
    return res;
  },

  async markAsRead(id: string): Promise<ContactMutationResponse> {
    const res = await apiRequest<ContactMutationResponse>(`/contacts/${id}/read`, {
      method: 'PATCH',
      auth: true,
    });
    return res;
  },
};
