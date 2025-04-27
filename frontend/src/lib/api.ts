import { getAccessToken } from '@/utils/token';
import { getDefaultLocale } from '@/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

type FetchOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
  auth?: boolean;
};

export async function apiRequest<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let locale = getDefaultLocale();
  if (typeof window !== 'undefined') {
    const seg = window.location.pathname.split('/')[1];
    if (seg === 'vi' || seg === 'en') {
      locale = seg;
    }
  }
  headers['Accept-Language'] = locale;

  if (options.auth) {
    const token = getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
  }

  if (!res.ok) {
    const message: string = (Array.isArray(data?.message) ? data.message[0] : data?.message) || data?.error;
    const error: any = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
