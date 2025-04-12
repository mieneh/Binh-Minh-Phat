'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ResetPasswordModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ResetPasswordModal({
  open,
  loading,
  onClose,
  onConfirm,
}: ResetPasswordModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="resetPassword"
      descKey="confirmResetPassword"
      confirmKey="reset"
      cancelKey="cancel"
    />
  );
}
