'use client';

import { useEffect, useState, FormEvent } from 'react';
import { t } from '@/i18n';
import { departmentService, Department } from '@/lib/services/department.service';

interface PositionFormProps {
  locale: 'vi' | 'en';
  mode: 'create' | 'edit';
  initialValues?: {
    code: string;
    name: string;
    departmentId: string;
    description: string;
    requirement: string;
  };
  submitting: boolean;
  onSubmit: (values: {
    code: string;
    name: string;
    departmentId: string;
    description: string;
    requirement: string;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export default function PositionForm({
  locale,
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: PositionFormProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [description, setDescription] = useState('');
  const [requirement, setRequirement] = useState('');
  
  const [original, setOriginal] = useState(initialValues);

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    setCode(initialValues?.code || '');
    setName(initialValues?.name || '');
    setDepartmentId(
      typeof initialValues?.departmentId === 'string'
        ? initialValues.departmentId
        : (initialValues?.departmentId as any)?._id || ''
    );
    setDescription(initialValues?.description || '');
    setRequirement(initialValues?.requirement || '');
    setOriginal(initialValues);
  }, [initialValues]);

  useEffect(() => {
    departmentService.getAll().then(res => setDepartments(res.data || []));
  }, []);

  const isDirty = mode === 'create'
    ? true
    : !!original &&
      (code.trim() !== (original.code || '').trim() ||
      name.trim() !== (original.name || '').trim() ||
      (description || '').trim() !== (original.description || '').trim() ||
      (requirement || '').trim() !== (original.requirement || '').trim() ||
      (departmentId || '') !== (original.departmentId || ''));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !departmentId) return;
    await onSubmit({ code, name, departmentId, description, requirement });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'positionCode')} <span className="text-red-500">*</span>
        </label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t(locale, 'positionCodePlaceholder')}
          required
        />
      </div>
      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'positionName')} <span className="text-red-500">*</span>
        </label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t(locale, 'positionNamePlaceholder')}
          required
        />
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'department')} <span className="text-red-500">*</span>
        </label>
        <select
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          required
        >
          <option value="">{t(locale, 'selectDepartment')}</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'positionDescription')}</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(locale, 'descriptionPlaceholder')}
        />
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'positionRequirement')}</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          rows={3}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder={t(locale, 'requirementPlaceholder')}
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
