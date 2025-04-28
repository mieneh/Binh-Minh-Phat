'use client';

import { t } from '@/i18n';
import { User } from '@/lib/services/user.service';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Pagination from '@/components/common/Pagination';

interface UserTableProps {
  locale: 'vi' | 'en';
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onDetail: (user: User) => void;
  onResetPassword: (user: User) => void;
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function UserTable({
  locale,
  users,
  onEdit,
  onDelete,
  onDetail,
  onResetPassword,
  page,
  pageSize,
  total,
  onChange,
}: UserTableProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{t(locale, 'userList')}</h2>
      {users.length === 0 ? (
        <p className="text-sm opacity-80">{t(locale, 'noUsers')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-3 py-2">{t(locale, 'userName')}</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">{t(locale, 'role')}</th>
                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{t(locale, u.role)}</td>
                  <td className="px-3 py-2 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <GripHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDetail(u)}>
                          {t(locale, 'detail')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(u)}>
                          {t(locale, 'edit')}
                        </DropdownMenuItem>
                        {u.role === 'employee' && (
                          <DropdownMenuItem onClick={() => onResetPassword(u)} className="flex items-center gap-1">
                            {t(locale, 'resetPassword')}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onDelete(u)} className="text-red-600">
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
