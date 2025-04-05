'use client';

import Modal from '@/components/common/Modal';
import { t } from '@/i18n';
import PartnerForm from './PartnerForm';
import type { Partner } from '@/lib/services/partner.service';
import { Phone, Mail, Flame } from 'lucide-react';

interface PartnerModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  initialValues?: {
    name: string;
    logo: string;
    website: string;
    address: string;
    phone: string;
    email: string;
    hotline: string;
    note: string;
  };
  partner?: Partner;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: {
    name: string;
    logo: string;
    website: string;
    address: string;
    phone: string;
    email: string;
    hotline: string;
    note: string;
  }) => Promise<void> | void;
  onSwitchToEdit?: () => void;
}

export default function PartnerModal({
  locale,
  open,
  mode,
  initialValues,
  partner,
  submitting,
  onClose,
  onSubmit,
  onSwitchToEdit,
}: PartnerModalProps) {
  const isDetail = mode === 'detail';

  const title = mode === 'edit' ? t(locale, 'editPartner') : mode === 'detail' ? t(locale, 'detailPartner') : t(locale, 'createPartner');

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  if (isDetail && partner) {
    return (
      <Modal isOpen={open} onClose={handleCancel} title={title} size="lg">
        <div className="space-y-4 text-sm">
          {partner.logo && (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border bg-gray-50">
                <img src={partner.logo} alt={partner.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="font-semibold">{partner.name}</div>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-700 underline underline-offset-2"
                  >
                    {partner.website}
                  </a>
                )}
              </div>
            </div>
          )}
          {!partner.logo && (
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'partnerName')}</div>
              <div className="text-sm font-semibold">{partner.name}</div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'contact')}</div>
              <div className="mt-1 space-y-1 text-sm">
                {partner.contact?.phone && <div className="flex items-center gap-1"><Phone size={14} /> {partner.contact.phone}</div>}
                {partner.contact?.email && <div className="flex items-center gap-1"><Mail size={14} /> {partner.contact.email}</div>}
                {partner.contact?.hotline && <div className="flex items-center gap-1"><Flame size={14} /> {partner.contact.hotline}</div>}
                {!partner.contact?.phone && !partner.contact?.email && !partner.contact?.hotline && <div>—</div>}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-400">{t(locale, 'address')}</div>
              <div className="mt-1 text-sm">{partner.address || '—'}</div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400">{t(locale, 'note')}</div>
            <div className="mt-1 whitespace-pre-wrap text-sm">{partner.note || '—'}</div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {t(locale, 'close')}
            </button>
            {onSwitchToEdit && (
              <button
                type="button"
                onClick={onSwitchToEdit}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
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
      <PartnerForm
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
