'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { t } from '@/i18n';
import { toast } from 'react-toastify';

export default function SignOutButton() {
  const { signout } = useAuth();
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      const res = await signout();
      toast.info(res.message);
      setOpen(false);
      router.push(`/${locale}`);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button className="w-full px-2 py-2 rounded text-sm text-left text-red-600 font-medium hover:bg-red-50" onClick={() => setOpen(true)}>{t(locale, 'signout')}</button>
      <ConfirmModal
        open={open}
        onClose={() => !pending && setOpen(false)}
        onConfirm={handleConfirm}
        loading={pending}
        titleKey="signout"
        descKey="confirmSignout"
        confirmKey="confirm"
        cancelKey="cancel"
      />
    </>
  );
}
