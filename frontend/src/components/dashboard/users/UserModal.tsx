'use client';

import Modal from '@/components/common/Modal';
import { t } from '@/i18n';
import UserForm from './UserForm';
import type { User } from '@/lib/services/user.service';
import { Image } from 'lucide-react';

interface UserModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  initialValues?: {
    email: string;
    name: string;
    phone: string;
    avatar: string;
    province: string;
    ward: string;
    street: string;
    role: 'admin' | 'employee';
    removeAvatar?: boolean;
  };
  user?: User;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    email: string;
    name: string;
    phone: string;
    avatar: string;
    province: string;
    ward: string;
    street: string;
    role: 'admin' | 'employee';
    removeAvatar?: boolean;
  }) => Promise<void> | void;
  onSwitchToEdit?: () => void;
}

export default function UserModal({
  locale,
  open,
  mode,
  initialValues,
  user,
  submitting,
  onClose,
  onSubmit,
  onSwitchToEdit,
}: UserModalProps) {
  const isDetail = mode === 'detail';

  const title = mode === 'edit' ? t(locale, 'editUser') : mode === 'detail' ? t(locale, 'detailUser') : t(locale, 'createUser');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  if (isDetail && user) {
    return (
      <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-14 w-14 rounded-lg object-cover border" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400"><Image /></div>
            )}
            <div>
              <div className="font-semibold text-base">{user.name}</div>
              <div className="text-xs text-gray-500">{t(locale, user.role)}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-gray-400">Email</div>
              <div className="mt-1 text-sm">{user.email || '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'phone')}</div>
              <div className="mt-1 text-sm">{user.phone || '—'}</div>
            </div>
          </div>
          
          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'address')}</div>
            <div className="mt-1 text-sm">
              {[
                user.address?.street,
                user.address?.ward,
                user.address?.province,
              ]
                .filter(Boolean)
                .join(', ') || '—'}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
            >
              {t(locale, 'close')}
            </button>
            {onSwitchToEdit && (
              <button
                type="button"
                onClick={onSwitchToEdit}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
              >
                {t(locale, 'edit')}
              </button>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={open} onClose={handleCancel} title={title}>
      <UserForm
        locale={locale}
        mode={mode === 'edit' ? 'edit' : 'create'}
        initialValues={initialValues}
        submitting={submitting}
        onSubmit={onSubmit}
        onCancel={handleCancel}
      />
    </Modal>
  );
}
