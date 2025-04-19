'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { t } from '@/i18n';

export default function Sidebar() {
  const { user } = useAuth();
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const privateLinks = [
    { href: `/${locale}/dashboard/users`, label: t(locale, 'users') },
    { href: `/${locale}/dashboard/addresses`, label: t(locale, 'addresses') },
  ];

  const links = [
    { href: `/${locale}/dashboard/categories`, label: t(locale, 'categories') },
    { href: `/${locale}/dashboard/products`, label: t(locale, 'products') },
    { href: `/${locale}/dashboard/partners`, label: t(locale, 'partners') },
    { href: `/${locale}/dashboard/recruitment`, label: t(locale, 'recruitment') },
    { href: `/${locale}/dashboard/applicant`, label: t(locale, 'applicant') },
    { href: `/${locale}/dashboard/contact`, label: t(locale, 'contact') },
  ];

  return (
    <aside className="w-50 bg-white border-r h-full px-2 sticky top-16">
      <ul className="flex flex-col gap-1 mt-2">
        {user?.role == "admin" && (
          <>
            {privateLinks.map((link) => {
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded px-2 py-2 text-sm transition ${
                      isActive(link.href)
                        ? 'bg-emerald-50 text-emerald-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </>
        )}
        {links.map((link) => {
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded px-2 py-2 text-sm transition ${
                  isActive(link.href)
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
