'use client';

import { Facebook, Phone, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { t } from '@/i18n';
import Image from 'next/image'
import { addressService, Address } from '@/lib/services/address.service';

export default function Footer() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [addresses, setAddresses] = useState<Address[]>([]);

  const fetchAddresses = async () => {
    const res = await addressService.getAll();
    const sorted = (res.data || []).sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
    setAddresses(sorted);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <>
      <footer className="w-full bg-white shadow-sm mt-1 backdrop-blur-sm z-50 border-t-2 border-gray-200 px-6 py-6 md:py-8 lg:px-12">
        <div className="mx-auto grid gap-8 md:grid-cols-3">
          <div className="text-center flex flex-col items-center">
            <Image src="/logo.png" alt="Bình Minh Phát" width={120} height={60} className="mb-3" priority />
            <p className="text-sm text-slate-700 mb-4">
              {t(locale, 'slogan')}
            </p>
            <div className="flex gap-2">
              <a href="https://www.facebook.com/congtytnhhmayxnkbinhminhphat/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-800 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="tel:02836365541" className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-800 transition">
                <Phone className="w-4 h-4" />
              </a>
              <a href="https://bmpgarment.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-800 transition">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
          {addresses.map((address, i) => (
            <div key={i}>
              <h4 className="text-sm font-bold mb-3 text-emerald-900">{address.branchName}</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  <b>{t(locale, 'address')}:</b> {[ address.location?.street, address.location?.ward, address.location?.province ].filter(Boolean).join(', ') || '—'}
                </li>
                <li>
                  <b>Hotline:</b> <a href={`tel:${address.hotline}`}>{address.hotline}</a>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </footer>
      <div className="w-full bg-emerald-800 text-emerald-200 text-center text-sm py-3">{t(locale, 'allRightsReserved')}</div>
    </>
  );
}
