'use client';

import { useEffect, useState, FormEvent } from 'react';
import { t } from '@/i18n';
import imageCompression from 'browser-image-compression';
import { Plus, Upload } from 'lucide-react';

interface PartnerFormProps {
  locale: 'vi' | 'en';
  mode: 'create' | 'edit';
  initialValues?: {
    name: string;
    logo: string;
    website: string;
    address: string;
    phone: string;
    email: string;
    hotline: string;
    note: string;
  };
  submitting: boolean;
  onSubmit: (values: {
    name: string;
    logo: string;
    website: string;
    address: string;
    phone: string;
    email: string;
    hotline: string;
    note: string;
    removeLogo?: boolean;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export default function PartnerForm({
  locale,
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: PartnerFormProps) {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hotline, setHotline] = useState('');
  const [note, setNote] = useState('');

  const [original, setOriginal] = useState(initialValues);

  const [removeLogo, setRemoveLogo] = useState(false);

  useEffect(() => {
    setName(initialValues?.name || '');
    setLogo(initialValues?.logo || null);
    setWebsite(initialValues?.website || '');
    setAddress(initialValues?.address || '');
    setPhone(initialValues?.phone || '');
    setEmail(initialValues?.email || '');
    setHotline(initialValues?.hotline || '');
    setNote(initialValues?.note || '');
    setRemoveLogo(false);
    setOriginal(initialValues);
  }, [initialValues]);

  const isDirty = mode === 'create'
    ? true
    : !!original &&
      (name.trim() !== (original.name || '').trim() ||
      (logo && logo.startsWith('data:image/')) ||
      (website || '').trim() !== (original.website || '').trim() ||
      (address || '').trim() !== (original.address || '').trim() ||
      (phone || '').trim() !== (original.phone || '').trim() ||
      (email || '').trim() !== (original.email || '').trim() ||
      (hotline || '').trim() !== (original.hotline || '').trim() ||
      (note || '').trim() !== (original.note || '').trim()) ||
      removeLogo === true

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const payload: any = {
      name,
      website,
      address,
      phone,
      email,
      hotline,
      note,
    };
    if (removeLogo) {
      payload.removeLogo = true;
    }
    if (logo && logo.startsWith('data:image/')) {
      payload.logo = logo;
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <label className="mt-1 text-sm font-medium">{t(locale, 'logo')}</label>
          <div className="mt-2 flex justify-center md:justify-start">
            <div className="relative group aspect-square w-full max-w-[180px] md:max-w-[120px]">
              {logo ? (
                <>
                  <img src={logo} alt="Preview" className="h-full w-full object-cover rounded-lg border"/>
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
                          maxSizeMB: 0.15,
                          maxWidthOrHeight: 1000,
                          initialQuality: 0.7,
                          useWebWorker: true,
                        });
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLogo(reader.result as string);
                          setRemoveLogo(false);
                        };
                        reader.readAsDataURL(compressed);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLogo(null);
                      setRemoveLogo(true);
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow hover:bg-white"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-emerald-500 hover:text-emerald-600">
                  <span className="text-2xl"><Plus /></span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogo(reader.result as string);
                        setRemoveLogo(false);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
        <div className="mt-0 md:col-span-4 space-y-4">          
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, 'partnerName')} <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(locale, 'partnerNamePlaceholder')}
              required
            />
          </div>
          <div>
            <label className="mt-1 text-sm font-medium">{t(locale, 'website')}</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'contact')}</label>
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t(locale, 'partnerPhonePlaceholder')}
          />
          <input
            type="email"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t(locale, 'partnerEmailPlaceholder')}
          />
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={hotline}
            onChange={(e) => setHotline(e.target.value)}
            placeholder={t(locale, 'partnerHotlinePlaceholder')}
          />
        </div>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'address')}</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t(locale, 'partnerAddressPlaceholder')}
        />
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'note')}</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t(locale, 'partnerNotePlaceholder')}
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
