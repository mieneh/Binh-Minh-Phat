'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface RecruitmentCloseModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RecruitmentCloseModal({
  open,
  loading,
  onClose,
  onConfirm,
}: RecruitmentCloseModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="closeRecruitment"
      descKey="confirmCloseRecruitment"
      confirmKey="close"
      cancelKey="cancel"
    />
  );
}
