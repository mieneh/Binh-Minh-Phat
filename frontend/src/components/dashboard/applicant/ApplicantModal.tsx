'use client';

import Modal from '@/components/common/Modal';
import { Applicant } from '@/lib/services/applicant.service';
import { t } from '@/i18n';

interface ApplicantModalProps {
    locale: 'vi' | 'en';
    open: boolean;
    applicant: Applicant | null;
    onClose: () => void;
    onChangeStatus: (a: Applicant, status: Applicant['status']) => Promise<void> | void;
}

export default function ApplicantModal({
    locale,
    open,
    applicant,
    onClose,
    onChangeStatus,
}: ApplicantModalProps) {
    if (!applicant) return null;
    const canDecide = applicant.status === 'NEW' || applicant.status === 'REVIEWED';
    const handleChangeStatus = async (status: Applicant['status']) => {
        await onChangeStatus(applicant, status);
        onClose();
    };
    const STATUS_META: Record<Applicant['status'], { color: string; bg: string }> = {
        NEW: {
            color: 'text-blue-700',
            bg: 'bg-blue-100',
        },
        REVIEWED: {
            color: 'text-amber-700',
            bg: 'bg-amber-100',
        },
        PASS: {
            color: 'text-emerald-700',
            bg: 'bg-emerald-100',
        },
        FAIL: {
            color: 'text-red-700',
            bg: 'bg-red-100',
        },
    };

    return (
        <Modal isOpen={open} onClose={onClose} title={t(locale, 'detailApplicant')} size="lg">
            
            <div className="space-y-4 text-sm">    
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs uppercase text-gray-400">{t(locale, 'positionApply')}</div>
                        {applicant.recruitmentId &&
                            typeof applicant.recruitmentId !== 'string' && (
                            <div className="mt-1 text-sm">
                                {applicant.recruitmentId.positionId.code} | {applicant.recruitmentId.positionId.name}
                            </div>
                        )}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-5 py-2 text-sm ${STATUS_META[applicant.status].bg} ${STATUS_META[applicant.status].color}`}>
                        {t(locale, `${applicant.status}`)}
                    </span>
                </div>
                <div>
                    <div className="text-xs uppercase text-gray-400">{t(locale, 'fullName')}</div>
                    <div className="mt-1">{applicant.fullName}</div>
                </div>
                <div>
                    <div className="text-xs uppercase text-gray-400">{t(locale, 'phone')}</div>
                    <div className="mt-1">{applicant.phone}</div>
                </div>
                {applicant.dateOfBirth && (
                    <div>
                        <div className="text-xs uppercase text-gray-400">{t(locale, 'dateOfBirth')}</div>
                        <div className="mt-1">{new Date(applicant.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                )}
                <div>
                    <div className="text-xs uppercase text-gray-400">{t(locale, 'address')}</div>
                    <div className="mt-1">{applicant.address ? `${applicant.address.street}, ${applicant.address.ward}, ${applicant.address.province}` : '—'}</div>
                </div>
                {applicant.shortProfile && (
                    <div>
                        <div className="text-xs uppercase text-gray-400">{t(locale, 'yearsOfExperience')}</div>
                        <div className="mt-1">{applicant.yearsOfExperience}</div>
                    </div>
                )}
                <div>
                    <div className="text-xs uppercase text-gray-400">{t(locale, 'shortProfile')}</div>
                    <div className="mt-1 whitespace-pre-line">{applicant.shortProfile || '-'}</div>
                </div>
                <div>
                    <div className="text-xs uppercase text-gray-400">{t(locale, 'cvLink')}</div>
                    <a href={applicant.cvLink} target="_blank" className="mt-1 inline-block text-emerald-600 underline">
                        {t(locale, 'viewCv')}
                    </a>
                </div>
                {canDecide && (
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => handleChangeStatus('FAIL')}
                            className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            {t(locale, 'FAIL')}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChangeStatus('PASS')}
                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                        >
                            {t(locale, 'PASS')}
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
