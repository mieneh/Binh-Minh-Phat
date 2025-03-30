'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import React, { useCallback } from 'react';

export default function LanguageSwitcher({ locales = ['vi', 'en'], currentLocale }: { locales?: string[]; currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = useCallback(() => {
    const currentIndex = locales.indexOf(currentLocale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];
    const segments = pathname.split('/');
    if (segments.length > 1) {
      segments[1] = nextLocale;
    }
    const newPath = segments.join('/') || `/${nextLocale}`;
    router.push(newPath);
  }, [pathname, router, currentLocale, locales]);

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2 py-2 text-gray-700 hover:text-emerald-700 transition-colors"
      aria-label="Change language"
    >
      <Globe />
      <span className="uppercase">{currentLocale}</span>
    </button>
  );
}
