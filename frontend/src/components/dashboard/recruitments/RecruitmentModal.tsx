'use client';

import Modal from '@/components/common/Modal';
import RecruitmentForm from './RecruitmentForm';
import { t } from '@/i18n';
import { Recruitment } from '@/lib/services/recruitment.service';

interface RecruitmentModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  submitting: boolean;
  initialValues?: {
    positionId: string;
    address: string
    quantity: number;
    startDate: string
    deadline: string;
    experience?: number;
  };
  recruitment?: Recruitment;
  onClose: () => void;
  onSubmit: (values: {
    positionId: string;
    address: string
    quantity: number;
    startDate: string
    deadline: string;
    experience?: number;
  }) => Promise<void> | void;
  onSwitchToEdit?: () => void;
}

export default function RecruitmentModal({
  locale,
  open,
  mode,
  submitting,
  initialValues,
  recruitment,
  onClose,
  onSubmit,
  onSwitchToEdit
}: RecruitmentModalProps) {
  const isDetail = mode === 'detail';

  const title = mode === 'edit' ? t(locale, 'editRecruitment') : mode === 'detail' ? t(locale, 'detailRecruitment') : t(locale, 'createRecruitment');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  if (isDetail && recruitment) {
    return (
      <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="font-semibold text-base text-red-500">{recruitment.positionId.code}</div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'positionName')}</div>
              <div className="mt-1 text-sm">{recruitment.positionId.name || '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'quantity')}</div>
              <div className="mt-1 text-sm">{recruitment.quantity || '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'startDate')}</div>
              <div className="mt-1 text-sm">{recruitment.startDate || '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'deadline')}</div>
              <div className="mt-1 text-sm">{recruitment.deadline || '—'}</div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'address')}</div>
            <div className="mt-1 text-sm">{recruitment.address || '—'}</div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'positionDescription')}</div>
            <div className="mt-1 text-sm">{recruitment.positionId.description || '—'}</div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'positionRequirement')}</div>
            <div className="mt-1 text-sm">{recruitment.positionId.requirement || '—'}</div>
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
    <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
      <RecruitmentForm
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
