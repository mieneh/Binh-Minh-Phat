'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { t } from '@/i18n';
import { authService } from '@/lib/services/auth.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PersonalCard from '@/components/auth/PersonalCard';
import EditProfileModal from '@/components/auth/EditProfileModal';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  const router = useRouter();
  const pathname = usePathname();

  const [submitting, setSubmitting] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      const restPath = pathname.replace(`/${locale}`, '') || '/';
      router.push(`/${locale}/signin?next=${encodeURIComponent(restPath)}`);
    }
  }, [user, loading, locale, router, pathname]);

  const handleSubmit = async (values: {
    name: string;
    phone: string;
    avatar?: string;
    province: string;
    ward: string;
    street: string;
    removeAvatar?: boolean;
  }) => {
    try {
      setSubmitting(true);
      const payload = {
        name: values.name.trim(),
        phone: values.phone.trim() || '',
        address: {
          province: values.province || '',
          ward: values.ward || '',
          street: values.street || '',
        },
        avatar: values.avatar,
        removeAvatar: values.removeAvatar === true ? true : undefined,
      };

      const res = await authService.updateProfile(payload);
      await refreshUser();
      toast.success(res.message);
      setOpenEdit(false);
    } catch (e: any) {
      toast.error(e?.message || t(locale, 'updateProfileFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      setSubmitting(true);
      const res = await authService.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      await refreshUser();
      toast.success(res.message);
      setOpenPassword(false);
    } catch (e: any) {
      toast.error(e?.message || t(locale, 'changePasswordFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center p-4">{t(locale, 'loading')}</p>;

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <section className="max-w-7xl mx-auto p-5 mb-7 py-5 md:py-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold">{t(locale, 'profileTitle')}</h1>

          <div className="flex gap-2">
            <button
              onClick={() => setOpenEdit(true)}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
            >
              {t(locale, 'editProfile')}
            </button>
            <button
              onClick={() => setOpenPassword(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              {t(locale, 'changePassword')}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <PersonalCard user={user} t={t} locale={locale} />
        </div>
      </section>

      <EditProfileModal
        open={openEdit}
        locale={locale}
        user={user}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => setOpenEdit(false)}
      />

      <ChangePasswordModal
        open={openPassword}
        locale={locale}
        submitting={submitting}
        onSubmit={handleChangePassword}
        onClose={() => setOpenPassword(false)}
      />
      <Footer />
    </div>
  );
}
