'use client';

import { t } from '@/i18n';
import { Product } from '@/lib/services/product.service';
import { GripHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface ProductTableProps {
    locale: 'vi' | 'en';
    products: Product[];
    onEdit: (p: Product) => void;
    onDelete: (p: Product) => void;
    onDetail: (p: Product) => void;
}

export default function ProductTable({
    locale,
    products,
    onEdit,
    onDelete,
    onDetail,
}: ProductTableProps) {
    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">{t(locale, 'productList')}</h2>
            {products.length === 0 ? (
                <p className="text-sm opacity-80">{t(locale, 'noProducts')}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                                <th className="px-3 py-2">{t(locale, 'productLot')}</th>
                                <th className="px-3 py-2">{t(locale, 'productName')}</th>
                                <th className="px-3 py-2">{t(locale, 'quantity')}</th>
                                <th className="px-3 py-2 text-center">{t(locale, 'actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                            <tr key={p._id} className="border-b last:border-none hover:bg-gray-50">
                                <td className="px-3 py-2">{p.lot}</td>
                                <td className="px-3 py-2 font-medium">{p.name}</td>
                                <td className="px-3 py-2">{p.quantity ?? '—'}</td>
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
