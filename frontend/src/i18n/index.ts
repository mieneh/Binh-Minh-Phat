import en from '@/translations/en.json';
import vi from '@/translations/vi.json';

export type Locale = 'en' | 'vi';

const dict: Record<Locale, Record<string, string>> = { en, vi };

export function getSupportedLocales(): Locale[] {
  const env = process.env.SUPPORTED_LOCALES || 'vi,en';
  return env.split(',').map(s => s.trim()).filter(Boolean) as Locale[];
}

export function getDefaultLocale(): Locale {
  const env = process.env.DEFAULT_LOCALE as Locale | undefined;
  if (env && ['vi', 'en'].includes(env)) return env;
  return 'vi';
}

export function t(locale: Locale, key: string, vars?: Record<string, string | number>) {
  const table = dict[locale] || dict[getDefaultLocale()];
  let text = table[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
    });
  }
  return text;
}
