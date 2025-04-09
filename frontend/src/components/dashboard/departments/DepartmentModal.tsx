'use client';

import Modal from '@/components/common/Modal';
import { t } from '@/i18n';
import DepartmentForm from './DepartmentForm';

interface DepartmentModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit';
  submitting: boolean;
  initialValues?: {
    name: string;
    description: string;
  };
  onClose: () => void;
  onSubmit: (values: { 
    name: string; 
    description: string;
  }) => Promise<void> | void;
}

export default function DepartmentModal({
  locale,
  open,
  mode,
  submitting,
  initialValues,
  onClose,
  onSubmit,
}: DepartmentModalProps) {
  const title = mode === 'edit' ? t(locale, 'editDepartment') : t(locale, 'createDepartment');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
      <DepartmentForm
        locale={locale}
        mode={mode}
        initialValues={initialValues}
        submitting={submitting}
        onSubmit={onSubmit}
        onCancel={handleCancel}
      />
    </Modal>
  );
}
