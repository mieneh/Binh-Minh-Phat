'use client';

import { t } from '@/i18n';

interface PaginationProps {
  locale: 'vi' | 'en';
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  locale,
  page,
  pageSize,
  total,
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const maxVisible = 1;
  let start = page - Math.floor(maxVisible / 2);
  let end = start + maxVisible - 1;

  if (start < 1) {
    start = 1;
    end = Math.min(maxVisible, totalPages);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, totalPages - maxVisible + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-6 flex justify-center gap-1">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 text-sm rounded border disabled:opacity-50"
      >
        {t(locale, 'prev')}
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 text-sm rounded border
            ${p === page ? 'bg-emerald-600 text-white' : 'hover:bg-gray-100'}
          `}
        >
          {p} / {totalPages}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 text-sm rounded border disabled:opacity-50"
      >
        {t(locale, 'next')}
      </button>
    </div>
  );
}
