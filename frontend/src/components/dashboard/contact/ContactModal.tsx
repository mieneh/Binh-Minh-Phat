'use client';

import Modal from '@/components/common/Modal';
import { t } from '@/i18n';
import { Contact } from '@/lib/services/contact.service';

interface ContactModalProps {
  locale: 'vi' | 'en';
  open: boolean;
  contact: Contact | null;
  onClose: () => void;
}

export default function ContactModal({
  locale,
  open,
  contact,
  onClose,
}: ContactModalProps) {
  if (!contact) return null;
  return (
    <Modal isOpen={open} onClose={onClose} title={t(locale, 'detailContact')} size="lg">
      <div className="space-y-4 text-sm">
        <div>
          <div className="text-xs uppercase text-gray-400">{t(locale, 'fullName')}</div>
          <div className="mt-1 text-sm">{contact.fullName || '—'}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">Email</div>
          <div className="mt-1 text-sm">{contact.email || '—'}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">{t(locale, 'company')}</div>
          <div className="mt-1 text-sm">{contact.company || '—'}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">{t(locale, 'country')}</div>
          <div className="mt-1 text-sm">{contact.country || '—'}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">{t(locale, 'volume')}</div>
          <div className="mt-1 text-sm">{contact.volume || '—'}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-400">{t(locale, 'message')}</div>
          <div className="mt-1 text-sm">{contact.message || '—'}</div>
        </div>
      </div>
    </Modal>
  );
}
