"use client";

import { useEffect, useState, FormEvent } from "react";
import { t } from "@/i18n";
import Modal from "@/components/common/Modal";
import { User } from "@/lib/services/user.service";
import imageCompression from "browser-image-compression";
import { Plus, Upload } from "lucide-react";

interface Province {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

interface EditProfileModalProps {
  open: boolean;
  locale: "vi" | "en";
  user: User;
  submitting?: boolean;
  onSubmit: (values: {
    name: string;
    phone: string;
    avatar: string;
    province: string;
    ward: string;
    street: string;
    removeAvatar?: boolean;
  }) => Promise<void> | void;
  onClose: () => void;
}

export default function EditProfileModal({
  open,
  locale,
  user,
  submitting,
  onSubmit,
  onClose,
}: EditProfileModalProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);

  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [province, setProvince] = useState(user.address?.province || "");
  const [ward, setWard] = useState(user.address?.ward || "");
  const [street, setStreet] = useState(user.address?.street || "");
  const [avatar, setAvatar] = useState<string | null>(user.avatar || null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/p/")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    if (!provinceCode) {
      setWards([]);
      return;
    }
    fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch(() => setWards([]));
  }, [provinceCode]);

  useEffect(() => {
    if (!province || provinces.length === 0) return;
    const matched = provinces.find((p) => p.name === province);
    if (matched) setProvinceCode(matched.code);
  }, [province, provinces]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name,
      phone,
      province,
      ward,
      street,
    };
    if (removeAvatar) {
      payload.removeAvatar = true;
    }
    if (avatar && avatar.startsWith("data:image/")) {
      payload.avatar = avatar;
    }
    await onSubmit(payload);
  };

  const isDirty =
    name.trim() !== (user.name || "").trim() ||
    phone.trim() !== (user.phone || "").trim() ||
    province !== user.address?.province ||
    ward !== user.address?.ward ||
    street !== user.address?.street ||
    removeAvatar === true ||
    (avatar && avatar.startsWith("data:image/"));

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={t(locale, "editProfile")}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="mt-1 text-sm font-medium">
              {t(locale, "userAvatar")}
            </label>
            <div className="mt-2 flex justify-center md:justify-start">
              <div className="relative group aspect-square w-full max-w-[180px] md:max-w-[202px]">
                {avatar ? (
                  <>
                    <img
                      src={avatar}
                      alt="Preview"
                      className="h-full w-full rounded-lg border object-cover"
                    />
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <span className="text-sm font-medium text-white">
                        <Upload />
                      </span>
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
                    <span className="text-2xl">
                      <Plus />
                    </span>
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
          <div className="mt-0 md:col-span-2 space-y-4">
            <div>
              <label className="mt-1 text-sm font-medium">Email</label>
              <input
                disabled
                className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
                value={user.email}
              />
            </div>
            <div>
              <label className="mt-1 text-sm font-medium">
                {t(locale, "fullName")}
              </label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(locale, "userNamePlaceholder")}
                required
              />
            </div>
            <div>
              <label className="mt-1 text-sm font-medium">
                {t(locale, "phone")}
              </label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, "province")}
            </label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={province}
              onChange={(e) => {
                const selected = provinces.find(
                  (p) => p.name === e.target.value
                );
                setProvince(e.target.value);
                setProvinceCode(selected?.code || null);
                setWard("");
              }}
            >
              <option value="">{t(locale, "provincePlaceholder")}</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mt-1 text-sm font-medium">
              {t(locale, "ward")}
            </label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={!provinceCode}
            >
              <option value="">{t(locale, "wardPlaceholder")}</option>
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
            {t(locale, "street")}
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder={t(locale, "streetPlaceholder")}
          />
        </div>
        <div className="sticky bottom-0 border-t mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 mt-4 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            {t(locale, "cancel")}
          </button>
          <button
            type="submit"
            disabled={submitting || !isDirty}
            className="rounded-md bg-emerald-600 px-4 py-2 mt-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? t(locale, "saving") : t(locale, "save")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
