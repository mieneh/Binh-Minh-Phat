import { apiRequest } from '@/lib/api';

export enum NotificationType {
  APPLICANT = 'APPLICANT',
  CONTACT = 'CONTACT',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  _id: string;
  title: string;
  message?: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  status: number;
  data: Notification[];
}

export interface UnreadCountResponse {
  status: number;
  data: number;
}

export const notificationService = {
  async getAll(type?: NotificationType): Promise<NotificationListResponse> {
    const res = await apiRequest<NotificationListResponse>(`/notifications${type ? `?type=${type}` : ''}`, {
      auth: true,
    });
    return res;
  },

  async unreadCount(): Promise<UnreadCountResponse> {
    const res = await apiRequest<UnreadCountResponse>('/notifications/unread-count', { 
      auth: true 
    });
    return res;
  },

  async markAsRead(id: string): Promise<{ status: number; message?: string }> {
    const res = await apiRequest<{ status: number; message?: string }>(`/notifications/${id}/read`, {
      method: 'PATCH',
      auth: true,
    });
    return res;
  },

  async markAllRead(): Promise<{ status: number; message?: string }> {
    const res = await apiRequest<{ status: number; message?: string }>('/notifications/read-all', {
      method: 'PATCH',
      auth: true,
    });
    return res;
  },

  async removeOne(id: string): Promise<{ status: number; message?: string }> {
    const res = await apiRequest<{ status: number; message?: string }>(`/notifications/${id}`, {
      method: 'DELETE',
      auth: true,
    });
    return res;
  },

  async removeAll(): Promise<{ status: number; message?: string }> {
    const res = await apiRequest<{ status: number; message?: string }>('/notifications', {
      method: 'DELETE',
      auth: true,
    });
    return res;
  },
};
