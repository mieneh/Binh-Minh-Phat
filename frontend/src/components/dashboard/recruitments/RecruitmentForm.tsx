'use client';

import { useEffect, useState, FormEvent } from 'react';
import { t } from '@/i18n';
import { positionService, Position } from '@/lib/services/position.service';
import { addressService, Address } from '@/lib/services/address.service';

interface RecruitmentFormProps {
  locale: 'vi' | 'en';
  mode: 'create' | 'edit';
  initialValues?: {
    positionId: string;
    addressId: string
    quantity: number;
    startDate: string;
    deadline: string;
    experience?: number;
  };
  submitting: boolean;
  onSubmit: (values: {
    positionId: string;
    addressId: string
    quantity: number;
    startDate: string;
    deadline: string;
    experience?: number;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export default function RecruitmentForm({
  locale,
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: RecruitmentFormProps) {
  const [positionId, setPositionId] = useState('');
  const [addressId, setAddressId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [experience, setExperience] = useState<number | ''>('');

  const [original, setOriginal] = useState(initialValues);
  
  const [positions, setPositions] = useState<Position[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    setPositionId(initialValues?.positionId || '');
    setAddressId(initialValues?.addressId || '');
    setQuantity(initialValues?.quantity || 1);
    setStartDate(initialValues?.startDate.slice(0, 10) || '');
    setDeadline(initialValues?.deadline.slice(0, 10) || '');
    setExperience(initialValues?.experience ?? '');
    setOriginal(initialValues);
  }, [initialValues]);

  useEffect(() => {
    positionService.getAll().then(res => setPositions(res.data || []));
    addressService.getAll().then(res => setAddresses(res.data || []));
  }, []);

  const isDirty = mode === 'create'
    ? true
    : !!original &&
      (positionId !== (original.positionId || '') ||
      addressId !== (original.addressId || '') ||
      quantity !== (original.quantity || 0) ||
      startDate !== (original.startDate || '') ||
      deadline !== (original.deadline || '') ||
      experience !== (original.experience ?? '')
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!positionId && !addressId && !quantity && !startDate && !deadline) return;
    await onSubmit({ positionId, addressId, quantity, startDate, deadline, experience: experience === 0 ? undefined : Number(experience) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'positionCode')} <span className="text-red-500">*</span>
        </label>
        <select
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={positionId}
          onChange={(e) => setPositionId(e.target.value)}
          required
        >
          <option value="">{t(locale, 'selectPosition')}</option>
          {positions.map((p) => (
            <option key={p._id} value={p._id}>{p.code}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'address')} <span className="text-red-500">*</span>
        </label>
        <select
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
          required
        >
          <option value="">{t(locale, 'selectAddress')}</option>
          {addresses.map((a) => (
            <option key={a._id} value={a._id}>{a.branchName}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'quantity')} <span className="text-red-500">*</span>
        </label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'startDate')} <span className="text-red-500">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'deadline')} <span className="text-red-500">*</span>
          </label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'experience')} ({t(locale, 'years')})
        </label>
        <input
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          type="number"
          min={0}
          value={experience}
          onChange={(e) => setExperience(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {t(locale, 'cancel')}
        </button>
        <button
          type="submit"
          disabled={submitting || !isDirty}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {submitting ? t(locale, 'saving') : mode === 'edit' ? t(locale, 'save') : t(locale, 'create')}
        </button>
      </div>
    </form>
  );
}
