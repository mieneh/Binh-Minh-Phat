'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';
import { contactService, Contact } from '@/lib/services/contact.service';
import { toast } from 'react-toastify';

import ContactTable from '@/components/dashboard/contact/ContactTable';
import ContactModal from '@/components/dashboard/contact/ContactModal';

export default function ContactsPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await contactService.getAll();
      setContacts(res.data || []);
    } catch (error: any) {
      toast.error(error?.message || t(locale, 'fetchErrorContact'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDetailClick = async (c: Contact) => {
    setDetail(c);
    if (!c.read) {
      await contactService.markAsRead(c._id);
      fetchContacts();
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">{t(locale, 'contact')}</h1>
        <p className="opacity-80">{t(locale, 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-4">
        <h1 className="text-2xl font-semibold">{t(locale, 'contact')}</h1>
        <p className="text-sm mt-2 opacity-80">{t(locale, 'manageContactsDescription')}</p>
      </div>

      <ContactTable
        locale={locale}
        contacts={contacts}
        onDetail={handleDetailClick}
      />

      <ContactModal
        locale={locale}
        open={Boolean(detail)}
        contact={detail}
        onClose={() => setDetail(null)}
      />
    </div>
  );
}
