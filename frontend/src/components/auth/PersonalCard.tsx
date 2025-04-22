'use client';

import React from 'react';
import { User } from '@/lib/services/user.service';
import { Mail, Phone, MapPin, User as UserIcon, } from 'lucide-react';

type Props = {
  user: User;
  t: (locale: 'vi' | 'en', key: string) => string;
  locale: 'vi' | 'en';
};

export default function PersonalCard({ user, t, locale }: Props) {
  return (
    <div className="mx-auto bg-white border rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-start gap-6">
      <div className="flex flex-col items-center text-center">
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" className="w-60 h-60 rounded-full border-2 border-emerald-600 object-cover" />
        ) : (
          <div className="w-60 h-60 flex items-center justify-center rounded-full bg-gray-100 border-2 border-gray-200">
            <UserIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <h2 className="mt-3 text-lg font-semibold text-gray-800">{user.name || '—'}</h2>
        <p className="text-sm text-gray-500">{user.role === 'admin' ? t(locale, 'admin') : t(locale, 'employee')}</p>
      </div>
      <div className="flex-1 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0 space-y-3">
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-sm text-gray-600">ID</p>
            <p className="text-sm break-all text-gray-800">{user._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-sm break-all">{user.email || '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600" />
          <div>
            <p className="text-sm text-gray-600">{t(locale, 'phone')}</p>
            <p className="text-sm break-all">{user.phone || '—'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-1 text-emerald-600" />
          <div>
            <p className="text-sm text-gray-600">{t(locale, 'address')}</p>
            <p className="text-sm break-all">{[
              user.address?.street,
                user.address?.ward,
                user.address?.province,
              ]
                .filter(Boolean)
                .join(', ') || '—'}
            </p>
          </div>
        </div>
        {(user.createdAt || user.updatedAt) && (
          <div className="text-xs text-gray-500 pt-2 border-t mt-3 space-y-2">
            {user.createdAt && (
              <p className="mt-2">
                <b>{t(locale, 'createAt')}:</b>{' '}
                {new Date(user.createdAt).toLocaleString(
                  locale === 'vi' ? 'vi-VN' : 'en-US'
                )}
              </p>
            )}
            {user.updatedAt && (
              <p>
                <b>{t(locale, 'updatedAt')}:</b>{' '}
                {new Date(user.updatedAt).toLocaleString(
                  locale === 'vi' ? 'vi-VN' : 'en-US'
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
