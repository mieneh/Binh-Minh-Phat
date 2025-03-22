import { t } from '@/i18n';

export default async function HomePage({ params }: {
  params: Promise<{ locale: 'vi' | 'en' }>;
}) {
  const { locale } = await params;
  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold">{t(locale, 'welcome')}</h1>
    </section>
  );
}
