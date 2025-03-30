import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/useAuth';
import { t } from '@/i18n';

export async function generateMetadata({ params }: {
    params: Promise<{ locale: 'vi' | 'en' }>;
}): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: t(locale, 'title'),
        description: t(locale, 'description'),
    };
}

export default async function LocaleLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <main>{children}</main>
        </AuthProvider>
    );
}