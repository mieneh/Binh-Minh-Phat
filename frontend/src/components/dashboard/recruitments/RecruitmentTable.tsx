'use client';

import { t } from '@/i18n';
import { Recruitment } from '@/lib/services/recruitment.service';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Pagination from '@/components/common/Pagination';

interface RecruitmentTableProps {
  locale: 'vi' | 'en';
  recruitments: Recruitment[];
  onEdit: (r: Recruitment) => void;
  onClose: (r: Recruitment) => void;
  onDelete: (r: Recruitment) => void;
  onDetail: (r: Recruitment) => void;
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function RecruitmentTable({
  locale,
  recruitments,
  onEdit,
  onClose,
  onDelete,
  onDetail,
  page,
  pageSize,
  total,
  onChange,
}: RecruitmentTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'recruitmentList')}</h2>
      {recruitments.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noRecruitments')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">{t(locale, 'status')}</th>
                <th className="px-3 py-2">{t(locale, 'position')}</th>
                <th className="px-3 py-2">{t(locale, 'deadline')}</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {recruitments.map((r) => (
                <tr key={r._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-3 py-2">
                    {r.isActive ? (
                      <span className="mt-1 inline-flex w-fit items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                        {t(locale, 'active')}
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex w-fit items-center rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">
                        {t(locale, 'closed')}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{r.positionId.code}</td>
                  <td className="px-3 py-2">{new Date(r.deadline).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-center">
                    {r.isActive && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <GripHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <>
                            <DropdownMenuItem onClick={() => onDetail(r)}>
                              {t(locale, 'detail')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(r)}>
                              {t(locale, 'edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onClose(r)}>
                              {t(locale, 'close')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(r)} className="text-red-600">
                              {t(locale, 'delete')}
                            </DropdownMenuItem>
                          </>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
