'use client';

import { useEffect, useState, FormEvent } from 'react';
import { t } from '@/i18n';

type Province = {
  code: number;
  name: string;
};

type Ward = {
  code: number;
  name: string;
};

interface AddressFormProps {
  locale: 'vi' | 'en';
  mode: 'create' | 'edit';
  initialValues?: {
    branchName: string;
    province: string;
    ward: string;
    street: string;
    hotline: string;
    note: string;
  };
  submitting: boolean;
  onSubmit: (values: {
    branchName: string;
    province: string;
    ward: string;
    street: string;
    hotline: string;
    note: string;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export default function AddressForm({
  locale,
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);

  const [branchName, setBranchName] = useState('');
  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');
  const [street, setStreet] = useState('');
  const [hotline, setHotline] = useState('');
  const [note, setNote] = useState('');

  const [original, setOriginal] = useState(initialValues);

  useEffect(() => {
    setBranchName(initialValues?.branchName || '');
    setProvince(initialValues?.province || '');
    setWard(initialValues?.ward || '');
    setStreet(initialValues?.street || '');
    setHotline(initialValues?.hotline || '');
    setNote(initialValues?.note || '');
    setOriginal(initialValues);
  }, [initialValues]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/v2/p/')
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    if (!provinceCode) {
      setWards([]);
      return;
    }

  fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`)
    .then((res) => res.json())
    .then((data) => {
      setWards(data.wards || []);
    })
    .catch(() => setWards([]));
  }, [provinceCode]);


  useEffect(() => {
    if (!initialValues?.province || provinces.length === 0) return;
    const matchedProvince = provinces.find(
      (p) => p.name === initialValues.province,
    );
    if (matchedProvince) {
      setProvinceCode(matchedProvince.code);
    }
  }, [initialValues?.province, provinces]);

  const isDirty = mode === 'create'
    ? true
    : !!original &&
      (branchName !== original.branchName ||
      province !== original.province ||
      ward !== original.ward ||
      street !== original.street ||
      hotline !== original.hotline ||
      note !== original.note);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!branchName.trim() || !province.trim()) return;
    await onSubmit({ branchName, province, ward, street, hotline, note });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'branchName')} <span className="text-red-500"> *</span>
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder={t(locale, 'branchNamePlaceholder')}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'province')} <span className="text-red-500"> *</span>
          </label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={province}
            onChange={(e) => {
              const selected = provinces.find(
                (p) => p.name === e.target.value,
              );
              setProvince(e.target.value);
              setProvinceCode(selected?.code || null);
              if (mode === 'create') {
                setWard('');
              }
            }}
            required
          >
            <option value="">{t(locale, 'provincePlaceholder')}</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'ward')} <span className="text-red-500"> *</span>
          </label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!provinceCode}
            required
          >
            <option value="">{t(locale, 'wardPlaceholder')}</option>
            {wards.map((w) => (
              <option key={w.code} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'street')} <span className="text-red-500"> *</span>
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder={t(locale, 'streetPlaceholder')}
          required
        />
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">
          {t(locale, 'hotline')} <span className="text-red-500"> *</span>
        </label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={hotline}
          onChange={(e) => setHotline(e.target.value)}
          placeholder={t(locale, 'hotlinePlaceholder')}
          required
        />
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'note')}</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t(locale, 'notePlaceholder')}
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
