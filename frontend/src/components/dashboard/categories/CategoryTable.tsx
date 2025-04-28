'use client';

import { t } from '@/i18n';
import { Category } from '@/lib/services/category.service';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Pagination from '@/components/common/Pagination';

interface CategoryTableProps {
  locale: 'vi' | 'en';
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function CategoryTable({
  locale,
  categories,
  onEdit,
  onDelete,
  page,
  pageSize,
  total,
  onChange,
}: CategoryTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'categoryList')}</h2>
      {categories.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noCategories')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">{t(locale, 'categoryName')}</th>
                <th className="px-3 py-2">{t(locale, 'categoryDescription')}</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, index) => (
                <tr key={c._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2 text-sm opacity-80">{c.description || '—'}</td>
                  <td className="px-3 py-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <GripHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(c)}>
                          {t(locale, 'edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(c)} className="text-red-600">
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
