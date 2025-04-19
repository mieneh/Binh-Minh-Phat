'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ApplicantDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ApplicantDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: ApplicantDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deleteApplicant"
      descKey="confirmDeleteApplicant"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
