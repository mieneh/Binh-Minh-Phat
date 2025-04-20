'use client';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { t } from '@/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PersonalCard from '@/components/auth/PersonalCard';

export default function ProfilePage() {
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

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <section className="max-w-7xl mx-auto p-5 mb-7 py-5 md:py-8">
        <h1 className="text-2xl font-bold py-5">{t(locale, 'profileTitle')}</h1>
        <PersonalCard user={user} t={t} locale={locale} />
      </section>
      <Footer />
    </div>
  );
}
