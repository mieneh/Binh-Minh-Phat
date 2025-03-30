'use client';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useParams } from 'next/navigation';
import { t } from '@/i18n';

export default function Footer() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  return (
    <>
      <footer className="w-full bg-white shadow-sm mt-10 backdrop-blur-sm z-50 border-t-2 border-gray-200 px-6 py-6 md:py-8 lg:px-12">
        <div className="mx-auto grid gap-8 md:grid-cols-3">
          <div className="text-center flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Bình Minh Phát"
              className="max-w-[120px] mb-3"
            />
            <p className="text-sm text-slate-700 mb-4">
              {t(locale, 'slogan')}
            </p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-800 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-800 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-800 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center hover:bg-amber-400 hover:text-slate-800 transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3 text-emerald-900">{t(locale, 'headquarters')}</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                <b>{t(locale, 'address')}:</b> Đường Tân Thành - An Chu, Tổ 11, Ấp Tân Thành, Xã Bình Minh, Tỉnh Đồng Nai
              </li>
              <li>
                <b>Hotline:</b> 028.3636.5541
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-3 text-emerald-900">{t(locale, 'branch')} SÔNG MÂY</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>
                <b>{t(locale, 'address')}:</b> Km 9.5, Tổ 10, Ấp 3, Xã Tân An, Tỉnh Đồng Nai
              </li>
              <li>
                <b>Hotline:</b> 024.3233.6173
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="w-full bg-emerald-800 text-emerald-200 text-center text-sm py-3">{t(locale, 'allRightsReserved')}</div>
    </>
  );
}
