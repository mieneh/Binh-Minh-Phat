'use client';

import { t } from '@/i18n';
import { Department } from '@/lib/services/department.service';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface DepartmentTableProps {
  locale: 'vi' | 'en';
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export default function DepartmentTable({
  locale,
  departments,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'departmentList')}</h2>
      {departments.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noDepartments')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">{t(locale, 'departmentName')}</th>
                <th className="px-3 py-2">{t(locale, 'departmentDescription')}</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d, index) => (
                <tr key={d._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 font-medium">{d.name}</td>
                  <td className="px-3 py-2 text-sm opacity-80">{d.description || '—'}</td>
                  <td className="px-3 py-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <GripHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(d)}>
                          {t(locale, 'edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(d)} className="text-red-600 hover:bg-red-50">
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
