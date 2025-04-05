'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface CategoryDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CategoryDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: CategoryDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deleteCategory"
      descKey="confirmDeleteCategory"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
