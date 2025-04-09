'use client';

import { t } from '@/i18n';
import { Position } from '@/lib/services/position.service';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface PositionTableProps {
  locale: 'vi' | 'en';
  positions: Position[];
  onEdit: (p: Position) => void;
  onDelete: (p: Position) => void;
  onDetail: (p: Position) => void;
}

export default function PositionTable({
  locale,
  positions,
  onEdit,
  onDelete,
  onDetail,
}: PositionTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'positionList')}</h2>
      {positions.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noPositions')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">{t(locale, 'positionName')}</th>
                <th className="px-3 py-2">{t(locale, 'department')}</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.code} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-3 py-2">{p.code}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">{p.departmentId?.name}</td>
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
