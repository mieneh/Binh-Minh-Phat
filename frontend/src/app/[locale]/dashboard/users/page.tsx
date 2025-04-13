'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';
import { userService, User } from '@/lib/services/user.service';
import { toast } from 'react-toastify';

import UserTable from '@/components/dashboard/users/UserTable';
import UserModal from '@/components/dashboard/users/UserModal';
import UserDeleteModal from '@/components/dashboard/users/UserDeleteModal';
import ResetPasswordModal from '@/components/dashboard/users/ResetPasswordModal';

type UserModalMode = 'create' | 'edit' | 'detail';

export default function UsersPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<UserModalMode>('create');
  const [editing, setEditing] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [resetting, setResetting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (error: any) {
      toast.error(error || t(locale, 'fetchErrorUser'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetPassword = async () => {
    if (!resetTarget) return;
    try {
      setResetting(true);
      const res = await userService.resetPassword(resetTarget._id);
      toast.success(`${t(locale, 'newPassword')}: ${res.data.newPassword}`);
      setResetTarget(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setResetting(false);
    }
  };

  const handleCreateClick = () => {
    setEditing(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditClick = (u: User) => {
    setEditing(u);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDetailClick = (u: User) => {
    setEditing(u);
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
    email: string;
    name: string;
    phone: string;
    avatar: string;
    province: string;
    ward: string;
    street: string;
    role: 'admin' | 'employee';
    removeAvatar?: boolean;
  }) => {
    const payload = {
      email: values.email.trim(),
      name: values.name.trim(),
      phone: values.phone.trim() || '',
      avatar: values.avatar || '',
      address: {
        province: values.province.trim() || '',
        ward: values.ward.trim() || '',
        street: values.street.trim() || '',
      },
      role: values.role || 'employee',
      removeAvatar: values.removeAvatar === true ? true : undefined,
    };
    
    try {
      setSaving(true);
      if (editing) {
        const res = await userService.update(editing._id, payload);
        toast.success(res.message);
      } else {
        const res = await userService.create(payload);
        toast.success(res.message);
      }
      await fetchUsers();
      setModalOpen(false);
      setEditing(null);
      setModalMode('create');
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (u: User) => {
    setDeleteTarget(u);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await userService.remove(deleteTarget._id);
      toast.success(res.message);
      await fetchUsers();
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
        <h1 className="mb-4 text-2xl font-semibold">{t(locale, 'users')}</h1>
        <p className="opacity-80">{t(locale, 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t(locale, 'users')}</h1>
          <p className="text-sm mt-2 opacity-80">{t(locale, 'manageUsersDescription')}</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          {t(locale, 'create')}
        </button>
      </div>

      <UserTable
        locale={locale}
        users={users}
        onResetPassword={(u) => setResetTarget(u)}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onDetail={handleDetailClick}
      />

      <UserModal
        locale={locale}
        open={modalOpen}
        mode={modalMode}
        initialValues={
          editing
            ? {
                email: editing.email || '',
                name: editing.name || '',
                phone: editing.phone || '',
                avatar: editing.avatar || '',
                province: editing.address.province,
                ward: editing.address.ward || '',
                street: editing.address.street || '',
                role: editing.role || 'employee',
              }
            : undefined
        }
        user={editing || undefined}
        submitting={saving}
        onClose={handleModalClose}
        onSubmit={handleSave}
        onSwitchToEdit={handleSwitchToEdit}
      />

      <UserDeleteModal
        open={Boolean(deleteTarget)}
        loading={deleting}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />

      <ResetPasswordModal
        open={Boolean(resetTarget)}
        loading={resetting}
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetPassword}
      />
    </div>
  );
}
