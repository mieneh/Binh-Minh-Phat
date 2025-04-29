'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';
import { addressService, Address } from '@/lib/services/address.service';
import { toast } from 'react-toastify';

import AddressTable from '@/components/dashboard/addresses/AddressTable';
import AddressModal from '@/components/dashboard/addresses/AddressModal';
import AddressDeleteModal from '@/components/dashboard/addresses/AddressDeleteModal';

type AddressModalMode = 'create' | 'edit' | 'detail';

export default function CompaniesPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<AddressModalMode>('create');
  const [editing, setEditing] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await addressService.getAll();
      setAddresses(res.data || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message || t(locale, 'fetchErrorAddress'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const pagedAddresses = addresses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleCreateClick = () => {
    setEditing(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditClick = (a: Address) => {
    setEditing(a);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDetailClick = (a: Address) => {
    setEditing(a);
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
    branchName: string;
    province: string;
    ward: string;
    street: string;
    hotline: string;
    note: string;
  }) => {
    const payload = {
      branchName: values.branchName.trim(),
      location: {
        province: values.province.trim(),
        ward: values.ward.trim() || undefined,
        street: values.street.trim() || undefined,
      },
      hotline: values.hotline.trim() || undefined,
      note: values.note.trim() || '',
    };

    try {
      setSaving(true);
      if (editing) {
        const res = await addressService.update(editing._id, payload);
        toast.success(res.message);
      } else {
        const res = await addressService.create(payload);
        toast.success(res.message);
      }
      await fetchAddresses();
      setModalOpen(false);
      setEditing(null);
      setModalMode('create');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (a: Address) => {
    setDeleteTarget(a);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await addressService.remove(deleteTarget._id);
      toast.success(res.message);
      await fetchAddresses();
      setDeleteTarget(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
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
        <h1 className="mb-4 text-2xl font-semibold">{t(locale, 'addresses')}</h1>
        <p className="opacity-80">{t(locale, 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t(locale, 'addresses')}</h1>
          <p className="text-sm mt-2 opacity-80">{t(locale, 'manageAddressesDescription')}</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          {t(locale, 'create')}
        </button>
      </div>

      <AddressTable
        locale={locale}
        addresses={pagedAddresses}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onDetail={handleDetailClick}
        page={page}
        pageSize={pageSize}
        total={addresses.length}
        onChange={setPage}
      />

      <AddressModal
        locale={locale}
        open={modalOpen}
        mode={modalMode}
        initialValues={
          editing
            ? {
                branchName: editing.branchName,
                province: editing.location.province,
                ward: editing.location.ward || '',
                street: editing.location.street || '',
                hotline: editing.hotline || '',
                note: editing.note || '',
              }
            : undefined
        }
        address={editing || undefined}
        submitting={saving}
        onClose={handleModalClose}
        onSubmit={handleSave}
        onSwitchToEdit={handleSwitchToEdit}
      />

      <AddressDeleteModal
        open={Boolean(deleteTarget)}
        loading={deleting}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
