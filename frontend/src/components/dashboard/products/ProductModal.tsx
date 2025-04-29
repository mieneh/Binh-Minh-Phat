'use client';

import Modal from '@/components/common/Modal';
import ProductForm from './ProductForm';
import { t } from '@/i18n';
import Image from 'next/image'
import { Product } from '@/lib/services/product.service';
import { Phone, Mail, Flame } from 'lucide-react';

interface ProductModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  initialValues?: {
    lot: string;
    name: string;
    description: string;
    image: string;
    quantity: number;
    categoryId: string;
    partnerId: string;
    removeImage?: boolean;
  };
  product?: Product;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    lot: string;
    name: string;
    description: string;
    image?: string;
    quantity: number;
    categoryId: string;
    partnerId: string;
    removeImage?: boolean;
  }) => Promise<void> | void;
  onSwitchToEdit?: () => void;
}

export default function ProductModal({
  locale,
  open,
  mode,
  initialValues,
  product,
  submitting,
  onClose,
  onSubmit,
  onSwitchToEdit,
}: ProductModalProps) {
  const isDetail = mode === 'detail';

  const title = mode === 'edit' ? t(locale, 'editProduct') : mode === 'detail' ? t(locale, 'detailProduct') : t(locale, 'createProduct');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  if (isDetail && product) {
    return (
      <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-4">
            {product.image ? (
              <Image src={product.image} alt={product.name} className="h-14 w-14 rounded-lg object-cover border" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">....</div>
            )}
            <div>
              <div className="font-semibold text-base">{product.name}</div>
              {product.categoryId && typeof product.categoryId !== 'string' && (
                <div className="text-xs text-gray-500">{product.categoryId.name}</div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'productLot')}</div>
              <div className="mt-1 text-sm">{product.lot || '—'}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'quantity')}</div>
              <div className="mt-1 text-sm">{product.quantity || '—'}</div>
            </div>
          </div>
          
          {product.partnerId && typeof product.partnerId !== 'string' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase text-gray-400">{t(locale, 'partners')}</div>
                <div className="text-sm">{product.partnerId.name || '—'}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400">{t(locale, 'website')}</div>
                <div className="text-sm">
                  {product.partnerId.website && (
                    <a
                      href={product.partnerId.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 underline underline-offset-2"
                    >
                      {product.partnerId.website || '—'}
                    </a>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-400">{t(locale, 'contact')}</div>
                <div className="mt-1 space-y-1 text-sm">
                  {product.partnerId.contact?.phone && <div className="flex items-center gap-1"><Phone size={14} /> {product.partnerId.contact.phone}</div>}
                  {product.partnerId.contact?.email && <div className="flex items-center gap-1"><Mail size={14} /> {product.partnerId.contact.email}</div>}
                  {product.partnerId.contact?.hotline && <div className="flex items-center gap-1"><Flame size={14} /> {product.partnerId.contact.hotline}</div>}
                  {!product.partnerId.contact?.phone && !product.partnerId.contact?.email && !product.partnerId.contact?.hotline && <div>—</div>}
                </div>
              </div>  
              <div>
                <div className="text-xs uppercase text-gray-400">{t(locale, 'address')}</div>
                <div className="mt-1 text-sm">{product.partnerId.address || '—'}</div>
              </div>
            </div>
          )}
          
          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'descriptionProduct')}</div>
            <div className="mt-1 whitespace-pre-wrap text-sm">{product.description || '—'}</div>
          </div>

          <div className="sticky bottom-0 border-t mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border px-4 py-2 mt-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
            >
              {t(locale, 'close')}
            </button>
            {onSwitchToEdit && (
              <button
                type="button"
                onClick={onSwitchToEdit}
                className="rounded-md bg-emerald-600 px-4 py-2 mt-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {t(locale, 'edit')}
              </button>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
      <ProductForm
        locale={locale}
        mode={mode === 'edit' ? 'edit' : 'create'}
        initialValues={initialValues}
        submitting={submitting}
        onSubmit={onSubmit}
        onCancel={handleCancel}
      />
    </Modal>
  );
}
