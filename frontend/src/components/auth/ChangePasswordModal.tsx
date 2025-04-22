'use client';

import Modal from '@/components/common/Modal';
import { FormEvent, useState } from 'react';
import { t } from '@/i18n';
import { toast } from 'react-toastify';

interface ChangePasswordModalProps {
  open: boolean;
  locale: 'vi' | 'en';
  submitting?: boolean;
  onSubmit: (values: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  locale,
  submitting,
  onSubmit,
  onClose,
}: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error(t(locale, 'pleaseFillAllRequiredFields'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t(locale, 'passwordNotMatch'));
      return;
    }
    await onSubmit({ oldPassword, newPassword });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title={t(locale, 'changePassword')} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'oldPassword')} <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder={t(locale, 'oldPasswordPlaceholder')}
            required
          />
        </div>
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'newPassword')} <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t(locale, 'newPasswordPlaceholder')}
            required
          />
        </div>
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'confirmPassword')} <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t(locale, 'confirmPasswordPlaceholder')}
            required
          />
        </div>
        <div className="sticky bottom-0 border-t mt-6 flex justify-end gap-2">
          <button 
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 mt-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            {t(locale, 'cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-emerald-600 px-4 py-2 mt-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? t(locale, 'saving') : t(locale, 'save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
