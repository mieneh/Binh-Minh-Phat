'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { applicantService } from '@/lib/services/applicant.service';
import { Recruitment } from '@/lib/services/recruitment.service';
import { t } from '@/i18n';
import { toast } from 'react-toastify';

type Province = {
  code: number;
  name: string;
};

type Ward = {
  code: number;
  name: string;
};

interface JobApplicationModalProps {
  job: Recruitment;
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicationModal({
  job,
  isOpen,
  onClose,
}: JobApplicationModalProps) {
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    province: '',
    ward: '',
    street: '',
    yearsOfExperience: '',
    shortProfile: '',
    cvLink: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      .then((data) => setWards(data.wards || []))
      .catch(() => setWards([]));
  }, [provinceCode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await applicantService.create({
        recruitmentId: job._id,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        dateOfBirth: formData.dateOfBirth || undefined,
        address: {
          province: formData.province.trim(),
          ward: formData.ward.trim(),
          street: formData.street.trim(),
        },
        yearsOfExperience:
          formData.yearsOfExperience !== ''
            ? Number(formData.yearsOfExperience)
            : undefined,
        shortProfile: formData.shortProfile || undefined,
        cvLink: formData.cvLink || undefined,
        positionCodeSnapshot: job.positionId.code,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-semibold">{t(locale, 'positionApply')}: {job.positionId.name}</h3>
          <button onClick={onClose}><X /></button>
        </div>
        {submitted ? (
          <div className="text-center py-16 text-emerald-600 font-medium">{t(locale, 'applySuccess')}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 space-y-5 text-sm">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  {t(locale, 'fullName')} <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  {t(locale, 'phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">{t(locale, 'dateOfBirth')}</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  {t(locale, 'address')} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    required
                    value={formData.province}
                    onChange={(e) => {
                      const selected = provinces.find(p => p.name === e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        province: e.target.value,
                        ward: '',
                      }));
                      setProvinceCode(selected?.code || null);
                    }}
                    className="border px-3 py-2 rounded-lg"
                  >
                    <option value="">{t(locale, 'provincePlaceholder')}</option>
                    {provinces.map(p => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <select
                    required
                    value={formData.ward}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, ward: e.target.value }))
                    }
                    disabled={!provinceCode}
                    className="border px-3 py-2 rounded-lg disabled:opacity-60"
                  >
                    <option value="">{t(locale, 'wardPlaceholder')}</option>
                    {wards.map(w => (
                      <option key={w.code} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  required
                  name="street"
                  placeholder={t(locale, 'streetPlaceholder')}
                  value={formData.street}
                  onChange={handleChange}
                  className="mt-3 w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">{t(locale, 'yearsOfExperience')}</label>
                <input
                  type="number"
                  min={0}
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  {t(locale, 'shortProfile')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="shortProfile"
                  rows={3}
                  value={formData.shortProfile}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  {t(locale, 'cvLink')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  name="cvLink"
                  placeholder="Google Drive / PDF"
                  value={formData.cvLink}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-8 py-5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border py-2 rounded-xl hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-xl rounded hover:opacity-90 transition"
              >
                {submitting ? 'Đang gửi...' : 'Ứng tuyển'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
