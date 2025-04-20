'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { t } from '@/i18n';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      const restPath = pathname.replace(`/${locale}`, '') || '/';
      router.push(`/${locale}/signin?next=${encodeURIComponent(restPath)}`);
    }
  }, [user, loading, locale, router, pathname]);

  if (loading) return <p className="text-center p-4">{t(locale, 'loading')}</p>;

  return (
    <div>
      <Navbar />
      <section className="max-w-7xl mx-auto flex py-5 md:py-8">
        <Sidebar />
        <div className="flex-1 min-w-0 p-5">
          {children}
        </div>
      </section>
      <Footer />
    </div>
  );
}
