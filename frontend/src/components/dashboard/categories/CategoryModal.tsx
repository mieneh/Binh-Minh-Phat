'use client';

import Modal from '@/components/common/Modal';
import { t } from '@/i18n';
import CategoryForm from './CategoryForm';

interface CategoryModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: {
    name: string;
    description: string;
  };
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: { 
    name: string; 
    description: string;
  }) => Promise<void> | void;
}

export default function CategoryModal({
  locale,
  open,
  mode,
  submitting,
  initialValues,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const title = mode === 'edit' ? t(locale, 'editCategory') : t(locale, 'createCategory');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
      <CategoryForm
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
