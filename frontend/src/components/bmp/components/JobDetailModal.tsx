'use client';

import { X, MapPin, Clock, Hash } from 'lucide-react';
import { Recruitment } from '@/lib/services/recruitment.service';
import { t } from '@/i18n';

interface JobDetailModalProps {
    job: Recruitment;
    locale: 'vi' | 'en';
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
}

export function JobDetailModal({
    job,
    locale,
    isOpen,
    onClose,
    onApply,
}: JobDetailModalProps) {
    if (!isOpen) return null;

    const formatDate = (date: string) => new Date(date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h3 className="text-xl font-semibold">{job.positionId.name}</h3>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="px-8 py-6 space-y-8 text-sm text-gray-700">
                    <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="mt-2 text-emerald-600" size={35} />
                            <div>
                                <p className="text-xs text-gray-500">{t(locale, 'address')}</p>
                                <p className="font-medium">
                                {[job.addressId.location.street,
                                    job.addressId.location.ward,
                                    job.addressId.location.province]
                                    .filter(Boolean)
                                    .join(', ') || '—'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Hash className="mt-2 text-emerald-600" size={20} />
                            <div>
                                <p className="text-xs text-gray-500">{t(locale, 'quantity')}</p>
                                <p className="font-medium">{job.quantity}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-2 text-emerald-600" size={20} />
                            <div>
                                <p className="text-xs text-gray-500">{t(locale, 'jobPosted')}</p>
                                <p className="font-medium">{formatDate(job.startDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-2 text-emerald-600" size={20} />
                            <div>
                                <p className="text-xs text-gray-500">{t(locale, 'deadline')}</p>
                                <p className="font-medium">{formatDate(job.deadline)}</p>
                            </div>
                        </div>
                    </div>
                    <section>
                        <h4 className="text-base font-semibold mb-1">{t(locale, 'positionDescription')}</h4>
                        <div className="whitespace-pre-line leading-relaxed text-gray-700">
                            {job.positionId.description}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-base font-semibold mb-1">{t(locale, 'positionRequirement')}</h4>
                        <div className="whitespace-pre-line leading-relaxed text-gray-700">
                            {job.positionId.requirement}
                        </div>
                    </section>
                    <section>
                        <h4 className="text-base font-semibold mb-1">{t(locale, 'experience')}</h4>
                        <div className="whitespace-pre-line leading-relaxed text-gray-700">
                            {job.experience}
                        </div>
                    </section>
                </div>
                <div className="sticky bottom-0 bg-white border-t px-8 py-5">
                    <button
                        onClick={onApply}
                        className="w-full bg-amber-500 text-white py-2 rounded-xl rounded hover:opacity-90 transition"
                    >
                        {t(locale, 'careersApply')}
                    </button>
                </div>
            </div>
        </div>
    );
}
