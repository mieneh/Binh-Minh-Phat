'use client';

import Modal from '@/components/common/Modal';
import PositionForm from './PositionForm';
import { t } from '@/i18n';
import { Position } from '@/lib/services/position.service';

interface PositionModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  submitting: boolean;
  initialValues?: {
    code: string;
    name: string;  
    departmentId: string;
    description: string;
    requirement: string;
  };
  position?: Position;
  onClose: () => void;
  onSubmit: (values: {
    code: string;
    name: string;
    departmentId: string;
    description: string;
    requirement: string;
  }) => Promise<void> | void;
  onSwitchToEdit?: () => void;
}

export default function PositionModal({
  locale,
  open,
  mode,
  submitting,
  initialValues,
  position,
  onClose,
  onSubmit,
  onSwitchToEdit,
}: PositionModalProps) {
  const isDetail = mode === 'detail';

  const title = mode === 'edit' ? t(locale, 'editPosition') : mode === 'detail' ? t(locale, 'detailPosition') : t(locale, 'createPosition');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };
  
  if (isDetail && position) {
    return (
      <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="font-semibold text-base text-red-500">{position.code}</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'positionName')}</div>
              <div className="mt-1 text-sm">{position.name || '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'positionDepartment')}</div>
              <div className="mt-1 text-sm">{position.departmentId && typeof position.departmentId !== 'string' ? position.departmentId.name : '—'}</div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'positionDescription')}</div>
            <div
              className="prose max-w-none mt-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
              dangerouslySetInnerHTML={{
                __html: position.description || '<p>—</p>',
              }}
            />
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'positionRequirement')}</div>
            <div
              className="prose max-w-none mt-2 text-sm focus:outline-none [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1"
              dangerouslySetInnerHTML={{
                __html: position.requirement || '<p>—</p>',
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
      <PositionForm
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
