'use client';

import { ConfirmModal } from '@/components/common/ConfirmModal';

interface DepartmentDeleteModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DepartmentDeleteModal({
  open,
  loading,
  onClose,
  onConfirm,
}: DepartmentDeleteModalProps) {
  return (
    <ConfirmModal
      open={open}
      onClose={() => !loading && onClose()}
      onConfirm={onConfirm}
      loading={loading}
      titleKey="deleteDepartment"
      descKey="confirmDeleteDepartment"
      confirmKey="delete"
      cancelKey="cancel"
    />
  );
}
