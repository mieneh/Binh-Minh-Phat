import { getAccessToken } from "@/utils/token";
import { getDefaultLocale } from "@/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  auth?: boolean;
};

export async function apiRequest<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  let locale = getDefaultLocale();
  if (typeof window !== "undefined") {
    const seg = window.location.pathname.split("/")[1];
    if (seg === "vi" || seg === "en") {
      locale = seg;
    }
  }
  headers["Accept-Language"] = locale;

  if (options.auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  let data: unknown = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const dataObj = data as Record<string, unknown>;
    const message: string =
      (Array.isArray(dataObj?.message)
        ? dataObj.message[0]
        : dataObj?.message) ||
      dataObj?.error ||
      "Unknown error";
    const error = new Error(message) as Error & {
      status: number;
      data: unknown;
    };
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}
