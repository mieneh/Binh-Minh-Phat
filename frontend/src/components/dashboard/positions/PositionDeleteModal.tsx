'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface PositionDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PositionDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: PositionDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deletePosition"
      descKey="confirmDeletePosition"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
