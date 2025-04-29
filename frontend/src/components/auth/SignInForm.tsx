'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { t } from '@/i18n';
import { Send, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SignInForm() {
  const { signin } = useAuth();
  const { locale } = useParams() as { locale: 'vi' | 'en' };
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    try {
      const res = await signin(email, password);
      toast.success(res.message);
      const next = searchParams.get('next');
      if (next) router.push(`/${locale}${next}`);
      else router.push(`/${locale}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-lg bg-white/70 backdrop-blur rounded-2xl border border-slate-100 shadow-md p-6 space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">{t(locale, 'signin')}</h1>
          <p className="text-sm text-slate-500">{t(locale, 'signinDesc')}</p>
        </div>
        <label className="block space-y-1">
          <span className="text-sm text-slate-700">Email</span>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-slate-700">{t(locale, 'password')}</span>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {t(locale, 'processing')}
            </span>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
        <p className="text-center text-xs text-slate-400">{t(locale, 'signinNote')}</p>
      </form>
    </div>
  );
}