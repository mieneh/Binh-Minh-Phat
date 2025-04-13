'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';
import { categoryService, Category } from '@/lib/services/category.service';
import { toast } from 'react-toastify';

import CategoryTable from '@/components/dashboard/categories/CategoryTable';
import CategoryModal from '@/components/dashboard/categories/CategoryModal';
import CategoryDeleteModal from '@/components/dashboard/categories/CategoryDeleteModal';

export default function CategoriesPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isEditing = Boolean(editing);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      setCategories(res.data || []);
    } catch (error: any) {
      toast.error(error || t(locale, 'fetchErrorCategory'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (c: Category) => {
    setEditing(c);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    if (saving) return;
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async (values: { 
    name: string; 
    description: string 
  }) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || '',
    };
    try {
      setSaving(true);
      if (editing) {
        const res = await categoryService.update(editing._id, payload);
        toast.success(res.message);
      } else {
        const res = await categoryService.create(payload);
        toast.success(res.message);
      }
      await fetchCategories();
      setModalOpen(false);
      setEditing(null);
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (cat: Category) => {
    setDeleteTarget(cat);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await categoryService.remove(deleteTarget._id);
      toast.success(res.message);
      await fetchCategories();
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
        <h1 className="mb-4 text-2xl font-semibold">{t(locale, 'categories')}</h1>
        <p className="opacity-80">{t(locale, 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t(locale, 'categories')}</h1>
          <p className="text-sm mt-2 opacity-80">{t(locale, 'manageCategoriesDescription')}</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          {t(locale, 'create')}
        </button>
      </div>

      <CategoryTable
        locale={locale}
        categories={categories}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <CategoryModal
        locale={locale}
        open={modalOpen}
        mode={isEditing ? 'edit' : 'create'}
        initialValues={
          editing
            ? {
                name: editing.name,
                description: editing.description || '',
              }
            : undefined
        }
        submitting={saving}
        onClose={handleModalClose}
        onSubmit={handleSave}
      />

      <CategoryDeleteModal
        open={Boolean(deleteTarget)}
        loading={deleting}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
