'use client';

import { useEffect, useState, FormEvent } from 'react';
import { t } from '@/i18n';

interface DepartmentFormProps {
  locale: 'vi' | 'en';
  mode: 'create' | 'edit';
  initialValues?: {
    name: string;
    description: string;
  };
  submitting: boolean;
  onSubmit: (values: { 
    name: string; 
    description: string 
  }) => Promise<void> | void;
  onCancel: () => void;
}

export default function DepartmentForm({
  locale,
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: DepartmentFormProps) {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const [originalName, setOriginalName] = useState(initialValues?.name || '');
  const [originalDescription, setOriginalDescription] = useState(initialValues?.description || '');

  useEffect(() => {
    setName(initialValues?.name || '');
    setDescription(initialValues?.description || '');
    setOriginalName(initialValues?.name || '');
    setOriginalDescription(initialValues?.description || '');
  }, [initialValues]);

  const isDirty = mode === 'create'
    ? true
    : name.trim() !== originalName.trim() ||
      (description?.trim() || '') !== (originalDescription?.trim() || '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'departmentName')} <span className="text-red-500"> *</span>
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t(locale, 'departmentNamePlaceholder')}
          required
        />
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'departmentDescription')}</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(locale, 'departmentDescriptionPlaceholder')}
        />
      </div>

      <div className="sticky bottom-0 border-t mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border px-4 py-2 mt-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {t(locale, 'cancel')}
        </button>
        <button
          type="submit"
          disabled={submitting || !isDirty}
          className="rounded-md bg-emerald-600 px-4 py-2 mt-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? t(locale, 'saving') : mode === 'edit' ? t(locale, 'save') : t(locale, 'create')}
        </button>
      </div>
    </form>
  );
}
