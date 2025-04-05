'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from '@/i18n';
import { CircleUserRound, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import SignOutButton from '@/components/auth/SignOutButton';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  const pathname = usePathname();
  const router = useRouter();
  const homePath = useMemo(() => `/${locale}`, [locale]);
  const isOnHome = pathname === homePath;

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const links = [
    { name: '', label: t(locale, 'home') },
    { name: 'about', label: t(locale, 'about') },
    { name: 'services', label: t(locale, 'services') },
    { name: 'products', label: t(locale, 'products') },
    { name: 'capabilities', label: t(locale, 'capabilities') },
    { name: 'partners', label: t(locale, 'partners') },
    { name: 'careers', label: 'Careers' },
    { name: 'contact', label: t(locale, 'contact') },
  ];

  const privateLinks = [
    { href: `/${locale}/dashboard`, label: t(locale, 'dashboard') },
    { href: `/${locale}/profile`, label: t(locale, 'profile') },
  ];

  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (!isOnHome) return;
    const apply = () => setActiveSection(window.location.hash.replace('#', ''));
    apply();
    const onHash = () => apply();
    const onPop = () => apply();
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onPop);
    };
  }, [isOnHome]);

  const goToScope = useCallback(
    (name: string) => {
      setActiveSection(name || '');
      const hash = name ? `#${name}` : '';
      router.push(`${homePath}${hash}`);
      setOpenMobile(false);
    },
    [router, homePath]
  );

  const isActive = useCallback(
    (nameOrHref: string) => {
      if (!nameOrHref.startsWith('/')) {
        if (!isOnHome) return false;
        if (!nameOrHref) return activeSection === '';
        return activeSection === nameOrHref;
      }
      return pathname === nameOrHref;
    },
    [pathname, isOnHome, activeSection]
  );

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-10 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <img src="/logo.png" alt="Bình Minh Phát" className="h-16 w-auto" />
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <div key={link.name}>
              <button
                onClick={() => goToScope(link.name)}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.name)
                    ? 'text-emerald-700 border-b-2 border-emerald-700 pb-1'
                    : 'text-slate-700 hover:text-emerald-700'
                }`}
              >
                {link.label}
              </button>
            </div>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LanguageSwitcher locales={['vi', 'en']} currentLocale={locale} />
          {!loading && user && (
            <div className="relative hidden lg:block">
              <button
                onClick={() => setOpenDropdown((v) => !v)}
                className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-slate-700 hover:bg-slate-100"
                aria-haspopup="menu"
                aria-expanded={openDropdown}
              >
                <CircleUserRound />
              </button>
              {openDropdown && (
                <div className="absolute right-0 w-48 px-2 pb-2 mt-2 bg-white border rounded shadow-md z-50">
                  <ul className="flex flex-col gap-1 mt-2">
                    {privateLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpenDropdown(false)}
                          className={`block px-2 py-2 rounded text-sm ${
                            isActive(link.href)
                              ? 'bg-emerald-50 text-emerald-700 font-medium'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li className="border-t pt-1">
                      <SignOutButton />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => setOpenMobile((p) => !p)}
            className="lg:hidden p-2 rounded hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {openMobile ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {openMobile && (
        <div className="lg:hidden px-4 pb-4 border-t">
          <ul className="flex flex-col gap-1 mt-2">
            {links.map((item) => (
              <li key={`m-${item.name}`}>
                <button
                  onClick={() => goToScope(item.name)}
                  className={`w-full text-left block px-2 py-2 rounded text-sm font-medium ${
                    isActive(item.name)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            {!loading && user && (
              <>
                {privateLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenMobile(false)}
                      className={`block px-2 py-2 rounded text-sm font-medium ${
                        isActive(item.href)
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <SignOutButton />
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
