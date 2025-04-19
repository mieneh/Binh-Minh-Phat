'use client';

import { Applicant } from '@/lib/services/applicant.service';
import { t } from '@/i18n';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface ApplicantTableProps {
  locale: 'vi' | 'en';
  applicants: Applicant[];
  onDetail: (a: Applicant) => void;
  onDelete: (a: Applicant) => void;
}

export default function ApplicantTable({
  locale,
  applicants,
  onDetail,
  onDelete,
}: ApplicantTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'applicantList')}</h2>
      {applicants.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noApplicants')}</p>
      ) : (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
                <thead>
                    <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                        <th className="px-3 py-2">{t(locale, 'status')}</th>
                        <th className="px-3 py-2">{t(locale, 'fullName')}</th>
                        <th className="px-3 py-2">{t(locale, 'phone')}</th>
                        <th className="px-3 py-2">{t(locale, 'position')}</th>
                        <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {applicants.map((a) => (
                        <tr key={a._id} className="border-b hover:bg-gray-50">
                            <td className="px-3 py-2">
                                {a.status === 'NEW' && (
                                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
                                        {t(locale, 'NEW')}
                                    </span>
                                )}
                                {a.status === 'REVIEWED' && (
                                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-yellow-50 px-2 py-0.5 text-yellow-700">
                                        {t(locale, 'REVIEWED')}
                                    </span>
                                )}
                                {a.status === 'PASS' && (
                                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                                        {t(locale, 'PASS')}
                                    </span>
                                )}
                                {a.status === 'FAIL' && (
                                    <span className="mt-1 inline-flex w-fit items-center rounded-full bg-red-50 px-2 py-0.5 text-red-700">
                                        {t(locale, 'FAIL')}
                                    </span>
                                )}
                            </td>
                            <td className="px-3 py-2">{a.fullName}</td>
                            <td className="px-3 py-2">{a.phone}</td>
                            <td className="px-3 py-2">{a.recruitmentId.positionId.name}</td>
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
    </div>
  );
}
