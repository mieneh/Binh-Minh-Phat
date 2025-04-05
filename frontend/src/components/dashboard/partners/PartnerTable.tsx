'use client';

import { t } from '@/i18n';
import { Partner } from '@/lib/services/partner.service';
import { GripHorizontal, Phone, Mail, Flame } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface PartnerTableProps {
  locale: 'vi' | 'en';
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
  onDetail: (partner: Partner) => void;
}

export default function PartnerTable({
  locale,
  partners,
  onEdit,
  onDelete,
  onDetail,
}: PartnerTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'partnerList')}</h2>
      {partners.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noPartners')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">{t(locale, 'partnerName')}</th>
                <th className="px-3 py-2">{t(locale, 'contact')}</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p, index) => (
                <tr key={p._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2 text-xs opacity-80 space-y-1">
                    {p.contact?.phone && <div className="flex items-center gap-1"><Phone size={14} /> {p.contact.phone}</div>}
                    {p.contact?.email && <div className="flex items-center gap-1"><Mail size={14} /> {p.contact.email}</div>}
                    {p.contact?.hotline && <div className="flex items-center gap-1"><Flame size={14} /> {p.contact.hotline}</div>}
                    {!p.contact?.phone && !p.contact?.email && !p.contact?.hotline && '—'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <GripHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDetail(p)}>
                          {t(locale, 'detail')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(p)}>
                          {t(locale, 'edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(p)} className="text-red-600">
                          {t(locale, 'delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
