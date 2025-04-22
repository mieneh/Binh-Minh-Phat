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
    addressId: string
    quantity: number;
    startDate: string
    deadline: string;
    experience?: number;
  };
  recruitment?: Recruitment;
  onClose: () => void;
  onSubmit: (values: {
    positionId: string;
    addressId: string
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
            <div className="mt-1 text-sm">{recruitment.addressId ? `${recruitment.addressId.branchName} (${recruitment.addressId.location.street}, ${recruitment.addressId.location.ward}, ${recruitment.addressId.location.province})` : '—'}</div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'positionDescription')}</div>
            <div
              className="prose max-w-none mt-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
              dangerouslySetInnerHTML={{
                __html: recruitment.positionId.description || '<p>—</p>',
              }}
            />
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'positionRequirement')}</div>
            <div
              className="prose max-w-none mt-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
              dangerouslySetInnerHTML={{
                __html: recruitment.positionId.requirement || '<p>—</p>',
              }}
            />
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
