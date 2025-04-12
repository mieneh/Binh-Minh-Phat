'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface UserDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UserDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: UserDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deleteUser"
      descKey="confirmDeleteUser"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
