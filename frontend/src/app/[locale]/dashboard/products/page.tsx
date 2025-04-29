'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';
import { productService, Product, } from '@/lib/services/product.service';
import { toast } from 'react-toastify';

import ProductTable from '@/components/dashboard/products/ProductTable';
import ProductModal from '@/components/dashboard/products/ProductModal';
import ProductDeleteModal from '@/components/dashboard/products/ProductDeleteModal';

type ProductModalMode = 'create' | 'edit' | 'detail';

export default function ProductsPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProductModalMode>('create');
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAll();
      setProducts(res.data || []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message || t(locale, 'fetchErrorProduct'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const pagedProducts = products.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleCreateClick = () => {
    setEditing(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditClick = (p: Product) => {
    setEditing(p);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDetailClick = (p: Product) => {
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
    lot: string;
    name: string;
    description: string;
    image?: string;
    quantity: number;
    categoryId: string;
    partnerId: string;
    removeImage?: boolean;
  }) => {
        const payload = {
          lot: values.lot.trim(),
          name: values.name.trim(),
          description: values.description.trim() || '',
          image: values.image || '',
          quantity: values.quantity || 0,
          categoryId: values.categoryId || '',
          partnerId: values.partnerId || '',
          removeImage: values.removeImage === true ? true : undefined
        };
    
        try {
          setSaving(true);
          if (editing) {
            const res = await productService.update(editing._id, payload);
            toast.success(res.message);
          } else {
            const res = await productService.create(payload);
            toast.success(res.message);
          }
          await fetchProducts();
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

  const handleDeleteClick = (product: Product) => {
    setDeleteTarget(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await productService.remove(deleteTarget._id);
      toast.success(res.message);
      await fetchProducts();
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
        <h1 className="mb-4 text-2xl font-semibold">{t(locale, 'products')}</h1>
        <p className="opacity-80">{t(locale, 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 md:mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t(locale, 'products')}</h1>
          <p className="text-sm mt-2 opacity-80">{t(locale, 'manageProductsDescription')}</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
        >
          {t(locale, 'create')}
        </button>
      </div>

      <ProductTable
        locale={locale}
        products={pagedProducts}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onDetail={handleDetailClick}
        page={page}
        pageSize={pageSize}
        total={products.length}
        onChange={setPage}
      />

      <ProductModal
        locale={locale}
        open={modalOpen}
        mode={modalMode}
        initialValues={
          editing
            ? {
                lot: editing.lot || '',
                name: editing.name || '',
                description: editing.description || '',
                image: editing.image || '',
                quantity: editing.quantity || 0,
                categoryId:
                  typeof editing.categoryId === 'string'
                    ? editing.categoryId
                    : editing.categoryId?._id || '',
                partnerId:
                  typeof editing.partnerId === 'string'
                    ? editing.partnerId
                    : editing.partnerId?._id || ''
              }
            : undefined
        }
        product={editing || undefined}
        submitting={saving}
        onClose={handleModalClose}
        onSubmit={handleSave}
        onSwitchToEdit={handleSwitchToEdit}
      />

      <ProductDeleteModal
        open={Boolean(deleteTarget)}
        loading={deleting}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
