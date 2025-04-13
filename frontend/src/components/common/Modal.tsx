'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass =
    size === 'sm'
      ? 'max-w-sm'
      : size === 'lg'
      ? 'max-w-2xl'
      : size === 'xl'
      ? 'max-w-4xl'
      : 'max-w-lg';

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) onClose();
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleOverlayClick}>
      <div
        className={`w-full ${sizeClass} rounded-2xl bg-white shadow-xl border border-gray-100 max-h-[90vh] flex flex-col`}
        onClick={stopPropagation}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
            <div>
              {title && (
                <h2 className="text-base font-semibold text-gray-900">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-xs text-gray-500">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-end gap-2">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}