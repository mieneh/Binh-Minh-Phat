'use client';

import Modal from '@/components/common/Modal';
import AddressForm from './AddressForm';
import { t } from '@/i18n';
import { Address } from '@/lib/services/address.service';

interface AddressModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  initialValues?: {
    branchName: string;
    province: string;
    ward: string;
    street: string;
    hotline: string;
    note: string;
  };
  address?: Address;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    branchName: string;
    province: string;
    ward: string;
    street: string;
    hotline: string;
    note: string;
  }) => Promise<void> | void;
  onSwitchToEdit?: () => void;
}

export default function AddressModal({
  locale,
  open,
  mode,
  initialValues,
  address,
  submitting,
  onClose,
  onSubmit,
  onSwitchToEdit,
}: AddressModalProps) {
  const isDetail = mode === 'detail';

  const title = mode === 'edit' ? t(locale, 'editAddress') : mode === 'detail' ? t(locale, 'detailAddress') : t(locale, 'createAddress');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  }

  if (isDetail && address) {
    return (
      <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
        <div className="space-y-4 text-sm">
          <div className="font-semibold text-base">{address.branchName}</div>
          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'address')}</div>
            <div className="mt-1 text-sm">
              {[
                address.location?.street,
                address.location?.ward,
                address.location?.province,
              ]
                .filter(Boolean)
                .join(', ') || '—'}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'hotline')}</div>
            <div className="mt-1 text-sm">{address.hotline || '—'}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'note')}</div>
            <div className="mt-1 text-sm">{address.note || '—'}</div>
          </div>

          <div className="sticky bottom-0 border-t mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border px-4 py-2 mt-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              {t(locale, 'close')}
            </button>
            {onSwitchToEdit && (
              <button
                type="button"
                onClick={onSwitchToEdit}
                className="rounded-md bg-emerald-600 px-4 py-2 mt-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
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
      <AddressForm
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
