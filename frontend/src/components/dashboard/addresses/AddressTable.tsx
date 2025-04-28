'use client';

import { t } from '@/i18n';
import { Address } from '@/lib/services/address.service';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Pagination from '@/components/common/Pagination';

interface AddressTableProps {
  locale: 'vi' | 'en';
  addresses: Address[];
  onEdit: (a: Address) => void;
  onDelete: (a: Address) => void;
  onDetail: (a: Address) => void;
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function AddressTable({ 
  locale, 
  addresses, 
  onEdit, 
  onDelete, 
  onDetail,
  page,
  pageSize,
  total,
  onChange,
}: AddressTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'addressList')}</h2>
        {addresses.length === 0 ? (
          <p className="text-sm opacity-80">{t(locale, 'noAddresses')}</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">{t(locale, 'branchName')}</th>
                <th className="px-3 py-2">{t(locale, 'province')}</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((a, i) => (
                <tr key={a._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{a.branchName}</td>
                  <td className="px-3 py-2">{a.location.province}</td>
                  <td className="px-3 py-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <GripHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDetail(a)}>
                          {t(locale, 'detail')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(a)}>
                          {t(locale, 'edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(a)} className="text-red-600">
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
