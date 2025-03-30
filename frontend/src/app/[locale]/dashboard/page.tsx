'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { t } from '@/i18n';

import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
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
      <section className="max-w-[140vh] mx-auto px-4 py-10 flex text-algin items-center gap-6">
        <Sidebar />
        <h1 className="text-2xl font-semibold">{t(locale, 'welcomeDashboard')}</h1>
      </section>
      <Footer />
    </div>
  );
}
