"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { t } from "@/i18n";
import { productService, Product } from "@/lib/services/product.service";
import { ImageWithFallback } from "../ui/image-with-fallback";

const PAGE_SIZE = 4;
const AUTO_CHANGE_INTERVAL = 5000;

export default function ProductsSection() {
  const { locale } = useParams() as { locale: "vi" | "en" };

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await productService.getAll();
      setProducts(res.data || []);
    };
    fetchProducts();
  }, []);

  const shuffledProducts = useMemo(() => {
    const arr = [...products];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [products]);

  const totalPages = Math.ceil(shuffledProducts.length / PAGE_SIZE);

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, AUTO_CHANGE_INTERVAL);

    return () => clearInterval(timer);
  }, [totalPages]);

  const visibleProducts = shuffledProducts.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  return (
    <section id="products" className="py-20 bg-slate-50 scroll-mt-22">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-5 px-4 py-2 bg-emerald-700/10 rounded-full">
            <span className="text-emerald-700 text-lg">{t(locale, "productsBadge")}</span>
          </div>
          <h2 className="text-emerald-900 mb-4 tracking-tight">{t(locale, "productsTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t(locale, "productsSubtitle")}</p>
        </div>
        {visibleProducts.length === 0 ? (
          <p className="text-sm opacity-80 text-center">{t(locale, "noProducts")}</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-white text-sm font-medium">{product.name}</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    {product.categoryId?.name && (
                      <span className="px-3 py-1 bg-amber-400/20 text-amber-900 rounded-md text-xs">
                        {product.categoryId.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <span key={i} className={`h-2 w-2 rounded-full transition ${ i === page ? "bg-emerald-600" : "bg-gray-300" }`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
