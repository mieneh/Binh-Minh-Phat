'use client';

import { useParams } from 'next/navigation';
import { t } from '@/i18n';

export default function CategoriesPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold">{t(locale, 'welcomeDashboard')}</h1>
    </div>
  );
}
