'use client';

import { useState, useEffect, FormEvent } from 'react';
import { t } from '@/i18n';
import imageCompression from 'browser-image-compression';
import { Plus, Upload } from 'lucide-react';

interface UserFormProps {
  locale: 'vi' | 'en';
  mode: 'create' | 'edit';
  initialValues?: {
    email: string;
    name: string;
    phone: string;
    avatar: string;
    province: string;
    ward: string;
    street: string;
    role: 'admin' | 'employee';
    removeAvatar?: boolean;
  };
  submitting: boolean;
  onSubmit: (values: {
    email: string;
    name: string;
    phone: string;
    avatar: string;
    province: string;
    ward: string;
    street: string;
    role: 'admin' | 'employee';
    removeAvatar?: boolean;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export default function UserForm({ 
  locale,
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');
  const [street, setStreet] = useState('');
  const [role, setRole] = useState('employee');

  const [original, setOriginal] = useState(initialValues);

  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    setEmail(initialValues?.email || '');
    setName(initialValues?.name || '');
    setPhone(initialValues?.phone || '');
    setAvatar(initialValues?.avatar || null)
    setRole(initialValues?.role || 'employee');
    setProvince(initialValues?.province || '');
    setWard(initialValues?.ward || '');
    setStreet(initialValues?.street || '');
    setRemoveAvatar(false);
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
      (email.trim() !== (original.email || '').trim() ||
        name.trim() !== (original.name || '').trim() ||
        phone.trim() !== (original.phone || '').trim() ||
        (avatar && avatar.startsWith('data:image/')) ||
        province !== original.province ||
        ward !== original.ward ||
        street !== original.street ||
        role !== (original.role || 'employee') ||
        removeAvatar === true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !name.trim()) return;
    const payload: any = { 
      email, 
      name, 
      phone, 
      province, 
      ward, 
      street, 
      role 
    };
    if (removeAvatar) {
      payload.removeAvatar = true;
    }
    if (avatar && avatar.startsWith('data:image/')) {
      payload.avatar = avatar;
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
        <div>
          <label className="mt-1 block text-sm font-medium">{t(locale, 'userAvatar')}</label>
          <div className="mt-2 flex justify-center md:justify-start">
            <div className="relative group h-50 w-50">
              {avatar ? (
                <>
                  <img src={avatar} alt="Preview" className="h-full w-full rounded-lg border object-cover"/>
                  <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <span className="text-sm font-medium text-white"><Upload /></span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const compressed = await imageCompression(file, {
                          maxSizeMB: 0.2,
                          maxWidthOrHeight: 1200,
                          useWebWorker: true,
                        });
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatar(reader.result as string);
                          setRemoveAvatar(false);
                        };
                        reader.readAsDataURL(compressed);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar(null);
                      setRemoveAvatar(true);
                    }}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow hover:bg-white"
                  >
                    X
                  </button>
                </>
              ) : (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-emerald-500 hover:text-emerald-600">
                  <Plus className="text-2xl" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatar(reader.result as string);
                        setRemoveAvatar(false);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="mt-0 md:col-span-1 space-y-4">
          <div>
            <label className="mt-1 text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(locale, 'userEmailPlaceholder')}
              required
            />
          </div>
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, 'userName')} <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(locale, 'userNamePlaceholder')}
              required
            />
          </div>
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, 'role')} <span className="text-red-500">*</span>
            </label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="employee">{t(locale, 'employee')}</option>
              <option value="admin">{t(locale, 'admin')}</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'phone')}</label>
        <input
          type="tel"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t(locale, 'userPhonePlaceholder')}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mt-1 text-sm font-medium">{t(locale, 'province')}</label>
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
          <label className="mt-1 text-sm font-medium">{t(locale, 'ward')}</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!provinceCode}
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
        <label className="mt-1 text-sm font-medium">{t(locale, 'street')}</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder={t(locale, 'streetPlaceholder')}
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
