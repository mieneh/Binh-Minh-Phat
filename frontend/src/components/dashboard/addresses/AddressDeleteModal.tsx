'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface AddressDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AddressDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: AddressDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deleteAddress"
      descKey="confirmDeleteAddress"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
