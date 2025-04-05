'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ProductDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ProductDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: ProductDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deleteProduct"
      descKey="confirmDeleteProduct"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
