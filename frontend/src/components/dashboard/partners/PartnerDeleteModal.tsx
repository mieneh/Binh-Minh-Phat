'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface PartnerDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PartnerDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: PartnerDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deletePartner"
      descKey="confirmDeletePartner"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
