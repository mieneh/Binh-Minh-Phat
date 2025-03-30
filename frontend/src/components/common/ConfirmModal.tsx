'use client';

import React from 'react';
import { t } from '@/i18n';
import { useParams } from 'next/navigation';

interface ConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  titleKey?: string;
  descKey?: string;
  confirmKey?: string;
  cancelKey?: string;
}

export function ConfirmModal({
  open,
  onConfirm,
  onClose,
  loading = false,
  titleKey = 'title',
  descKey = 'desc',
  confirmKey = 'confirm',
  cancelKey = 'cancel',
}: ConfirmModalProps) {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-xl font-semibold mb-3">{t(locale, titleKey)}</h2>
        <p className="text-sm text-gray-600 mb-5">{t(locale, descKey)}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            {t(locale, cancelKey)}
          </button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? t(locale, 'loading') : t(locale, confirmKey)}
          </button>
        </div>
      </div>
    </div>
  );
}
