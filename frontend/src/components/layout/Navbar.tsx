'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { getSupportedLocales, t } from '@/i18n';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  const pathname = usePathname();
  const locales = getSupportedLocales();
  const [openLang, setOpenLang] = useState(false);
  const links = [
    { href: `/${locale}`, label: t(locale, 'home') },
    { href: `/${locale}/products`, label: t(locale, 'products') },
    { href: `/${locale}/contact`, label: t(locale, 'contact') },
    { href: `/${locale}/recruitment`, label: t(locale, 'recruitment') },
  ];

  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href={`/${locale}`} className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">Binh Minh Phat</Link>
        <ul className="flex items-center gap-6">
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700 hover:text-blue-500'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="relative">
            <button onClick={() => setOpenLang(!openLang)} className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">
              {locale.toUpperCase()} <ChevronDown className="w-4 h-4" />
            </button>
            {openLang && (
              <ul className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-md z-50">
                {locales.map(l => (
                  <li key={l}>
                    <Link
                      href={`/${l}`}
                      onClick={() => setOpenLang(false)}
                      className={`block px-3 py-1.5 text-sm ${
                        l === locale
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {l.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
