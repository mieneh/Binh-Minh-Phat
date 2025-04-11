'use client';

import { useEffect, useState, FormEvent } from 'react';
import { t } from '@/i18n';
import imageCompression from 'browser-image-compression';
import { categoryService, Category } from '@/lib/services/category.service';
import { partnerService, Partner } from '@/lib/services/partner.service';
import { Plus, Upload } from 'lucide-react';

interface ProductFormProps {
  locale: 'vi' | 'en';
  mode: 'create' | 'edit';
  initialValues?: {
    lot: string;
    name: string;
    description: string;
    image: string;
    quantity: number;
    categoryId: string;
    partnerId: string;
  };
  submitting: boolean;
  onSubmit: (values: {
    lot: string;
    name: string;
    description: string;
    image: string;
    quantity: number;
    categoryId: string;
    partnerId: string;
    removeImage?: boolean;
  }) => Promise<void> | void;
  onCancel: () => void;
}

export default function ProductForm({
  locale,
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [lot, setLot] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [partnerId, setPartnerId] = useState('');

  const [original, setOriginal] = useState(initialValues);

  const [categories, setCategories] = useState<Category[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    setLot(initialValues?.lot || '');
    setName(initialValues?.name || '');
    setDescription(initialValues?.description || '');
    setImage(initialValues?.image || null);
    setQuantity(initialValues?.quantity || 0);
    setCategoryId(
      typeof initialValues?.categoryId === 'string'
        ? initialValues.categoryId
        : (initialValues?.categoryId as any)?._id || ''
    );
    setPartnerId(
      typeof initialValues?.partnerId === 'string'
        ? initialValues.partnerId
        : (initialValues?.partnerId as any)?._id || ''
    );
    setRemoveImage(false);
    setOriginal(initialValues);
  }, [initialValues]);

  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data || []));
    partnerService.getAll().then(res => setPartners(res.data || []));
  }, []);

  const isDirty = mode === 'create'
    ? true
    : !!original &&
      (lot.trim() !== (original.lot || '').trim() ||
      name.trim() !== (original.name || '').trim() ||
      (image && image.startsWith('data:image/')) ||
      (description || '').trim() !== (original.description || '').trim() ||
      (quantity || 0) !== (original.quantity || 0) ||
      (categoryId || '').trim() !== (original.categoryId || '').trim() ||
      (partnerId || '').trim() !== (original.partnerId || '').trim()) ||
      removeImage === true

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!lot.trim() && !name.trim()) return;
    const payload: any = {
      lot,
      name,
      description,
      quantity,
      categoryId,
      partnerId,
    };
    if (removeImage) {
      payload.removeImage = true;
    }
    if (image && image.startsWith('data:image/')) {
      payload.image = image;
    }
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="mt-1 text-sm font-medium">{t(locale, 'image')}</label>
          <div className="mt-2 relative group">
            {image ? (
              <>
                <img src={image} alt="Preview" className="h-48 w-full object-cover rounded-lg border" />
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
                        setImage(reader.result as string);
                        setRemoveImage(false);
                      };
                      reader.readAsDataURL(compressed);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setRemoveImage(true);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-medium shadow hover:bg-white"
                >
                  ✕
                </button>
              </>
            ) : (
              <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-emerald-500 hover:text-emerald-600">
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
                      setImage(reader.result as string);
                      setRemoveImage(false);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            )}
          </div>
        </div>
        <div className="mt-0 md:col-span-2 space-y-4">
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, 'productLot')} <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={lot}
              onChange={(e) => setLot(e.target.value)}
              placeholder={t(locale, 'productLotPlaceholder')}
              required
            />
          </div>
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, 'productName')} <span className="text-red-500">*</span>
            </label>
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(locale, 'productNamePlaceholder')}
              required
            />
          </div>
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, 'quantity')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={quantity}
              onChange={(e) => setQuantity(+e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'categories')} <span className="text-red-500">*</span>
          </label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">{t(locale, 'chooseCategory')}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mt-1 text-sm font-medium">
            {t(locale, 'partners')} <span className="text-red-500">*</span>
          </label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            required
          >
            <option value="">{t(locale, 'choosePartner')}</option>
            {partners.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mt-1 text-sm font-medium">{t(locale, 'descriptionProduct')}</label>
        <textarea
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t(locale, 'productNotePlaceholder')}
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
