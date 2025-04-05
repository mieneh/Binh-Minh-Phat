'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';
import { partnerService, Partner } from '@/lib/services/partner.service';
import { toast } from 'react-toastify';

import PartnerTable from '@/components/dashboard/partners/PartnerTable';
import PartnerModal from '@/components/dashboard/partners/PartnerModal';
import PartnerDeleteModal from '@/components/dashboard/partners/PartnerDeleteModal';

type PartnerModalMode = 'create' | 'edit' | 'detail';

export default function PartnersPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<PartnerModalMode>('create');
  const [editing, setEditing] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await partnerService.getAll();
      setPartners(res.data || []);
    } catch (error: any) {
      toast.error(error || t(locale, 'fetchErrorParter'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCreateClick = () => {
    setEditing(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditClick = (p: Partner) => {
    setEditing(p);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDetailClick = (p: Partner) => {
    setEditing(p);
    setModalMode('detail');
    setModalOpen(true);
  };

  const handleModalClose = () => {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
    setModalMode('create');
  };

  const handleSwitchToEdit = () => {
    if (!editing) return;
    setModalMode('edit');
  };

  const handleSave = async (values: {
    name: string;
    logo: string;
    website: string;
    address: string;
    phone: string;
    email: string;
    hotline: string;
    note: string;
  }) => {
    const payload = {
      name: values.name.trim(),
      logo: values.logo.trim() || undefined,
      website: values.website.trim() || undefined,
      address: values.address.trim() || undefined,
      note: values.note.trim() || undefined,
      contact:
        values.phone || values.email || values.hotline
          ? {
              phone: values.phone.trim() || undefined,
              email: values.email.trim() || undefined,
              hotline: values.hotline.trim() || undefined,
            }
          : undefined,
    };

    try {
      setSaving(true);
      if (editing) {
        const res = await partnerService.update(editing._id, payload);
        toast.success(res.message);
      } else {
        const res = await partnerService.create(payload);
        toast.success(res.message);
      }
      await fetchPartners();
      setModalOpen(false);
      setEditing(null);
      setModalMode('create');
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (partner: Partner) => {
    setDeleteTarget(partner);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await partnerService.remove(deleteTarget._id);
      toast.success(res.message);
      await fetchPartners();
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
        <h1 className="mb-4 text-2xl font-semibold">{t(locale, 'partners')}</h1>
        <p className="opacity-80">{t(locale, 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t(locale, 'partners')}</h1>
          <p className="text-sm mt-2 opacity-80">{t(locale, 'managePartnersDescription')}</p>
        </div>
        <button 
          type="button" 
          onClick={handleCreateClick} 
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          {t(locale, 'create')}
        </button>
      </div>

      <PartnerTable
        locale={locale}
        partners={partners}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onDetail={handleDetailClick}
      />

      <PartnerModal
        locale={locale}
        open={modalOpen}
        mode={modalMode}
        initialValues={
          editing
            ? {
                name: editing.name || '',
                logo: editing.logo || '',
                website: editing.website || '',
                address: editing.address || '',
                phone: editing.contact?.phone || '',
                email: editing.contact?.email || '',
                hotline: editing.contact?.hotline || '',
                note: editing.note || '',
              }
            : undefined
        }
        partner={editing || undefined}
        submitting={saving}
        onClose={handleModalClose}
        onSubmit={handleSave}
        onSwitchToEdit={handleSwitchToEdit}
      />

      <PartnerDeleteModal
        open={Boolean(deleteTarget)}
        loading={deleting}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
