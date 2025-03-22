export const KEYS = {
  access: 'accessToken',
  refresh: 'refreshToken',
  maxAgeDays: 7,
};

function setCookie(name: string, value: string, days = KEYS.maxAgeDays) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Expires=${expires}`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function saveTokens(accessToken: string, refreshToken?: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.access, accessToken);
    if (refreshToken) localStorage.setItem(KEYS.refresh, refreshToken);
  }
  setCookie(KEYS.access, accessToken);
  if (refreshToken) setCookie(KEYS.refresh, refreshToken);
}

export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    const ls = localStorage.getItem(KEYS.access);
    if (ls) return ls;
  }
  return getCookie(KEYS.access);
}

export function clearTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
  }
  document.cookie = `${KEYS.access}=; Max-Age=0; path=/`;
  document.cookie = `${KEYS.refresh}=; Max-Age=0; path=/`;
}
