'use client';

import { t } from '@/i18n';
import { Contact } from '@/lib/services/contact.service';
import { Eye, MailOpen, Mail } from 'lucide-react';
import Pagination from '@/components/common/Pagination';

interface ContactTableProps {
  locale: 'vi' | 'en';
  contacts: Contact[];
  onDetail: (c: Contact) => void;
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function ContactTable({
  locale,
  contacts,
  onDetail,
  page,
  pageSize,
  total,
  onChange,
}: ContactTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'contactList')}</h2>
      {contacts.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noContacts')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2 text-center">{t(locale, 'status')}</th>
                <th className="px-3 py-2">{t(locale, 'fullName')}</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id} className={`border-b hover:bg-gray-50 ${!c.read ? 'font-medium' : ''}`}>
                  <td className="px-3 py-2 text-center">
                    <button className="p-1 rounded">
                      {c.read ? (
                        <MailOpen size={16} />
                      ) : (
                        <Mail size={16} className="text-emerald-600 text-center" />
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2">{c.fullName}</td>
                  <td className="px-3 py-2">{c.email}</td>
                  <td className="px-3 py-2 text-center">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Eye size={16} onClick={() => onDetail(c)} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        locale={locale}
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
      />
    </div>
  );
}
