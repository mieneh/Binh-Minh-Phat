'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';
import { applicantService, Applicant } from '@/lib/services/applicant.service';
import { toast } from 'react-toastify';

import ApplicantTable from '@/components/dashboard/applicant/ApplicantTable';
import ApplicantModal from '@/components/dashboard/applicant/ApplicantModal';
import ApplicantDeleteModal from '@/components/dashboard/applicant/ApplicantDeleteModal';

export default function ApplicantsPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState<Applicant | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Applicant | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await applicantService.getAll();
      setApplicants(res.data || []);
    } catch (e: any) {
      toast.error(e?.message || t(locale, 'fetchErrorApplicant'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const pagedApplicants = applicants.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleChangeStatus = async (a: Applicant, status: Applicant['status']) => {
    try {
      await applicantService.update(a._id, { status });
      toast.success(t(locale, 'updateSuccess'));
      fetchApplicants();
    } catch (e: any) {
      toast.error(e?.message);
    }
  };

  const handleDetailClick = async (a: Applicant) => {
    setDetail(a);
    if (a.status === 'NEW') {
      try {
        await applicantService.update(a._id, { status: 'REVIEWED' });
        fetchApplicants();
      } catch {}
    }
  };

  const handleDeleteClick = (a: Applicant) => {
    setDeleteTarget(a);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await applicantService.remove(deleteTarget._id);
      toast.success(res.message);
      await fetchApplicants();
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteClose = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  if (loading) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">{t(locale, 'applicant')}</h1>
        <p className="opacity-80">{t(locale, 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-4">
        <h1 className="text-2xl font-semibold">{t(locale, 'applicant')}</h1>
        <p className="text-sm mt-2 opacity-80">{t(locale, 'manageApplicantsDescription')}</p>
      </div>

      <ApplicantTable
        locale={locale}
        applicants={pagedApplicants}
        onDetail={handleDetailClick}
        onDelete={handleDeleteClick}
        page={page}
        pageSize={pageSize}
        total={applicants.length}
        onChange={setPage}
      />

      <ApplicantModal
        locale={locale}
        open={Boolean(detail)}
        applicant={detail}
        onClose={() => setDetail(null)}
        onChangeStatus={handleChangeStatus}
      />

      <ApplicantDeleteModal
        open={Boolean(deleteTarget)}
        loading={deleting}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
