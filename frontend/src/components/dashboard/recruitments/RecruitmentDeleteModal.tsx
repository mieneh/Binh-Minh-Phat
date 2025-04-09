'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface RecruitmentDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RecruitmentDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: RecruitmentDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deleteRecruitment"
      descKey="confirmDeleteRecruitment"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
