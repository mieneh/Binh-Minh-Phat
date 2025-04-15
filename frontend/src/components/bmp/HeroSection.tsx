'use client';

import { useParams } from 'next/navigation';
import { ArrowRight, Eye } from 'lucide-react';
import { t } from '@/i18n';
import { ImageWithFallback } from '../ui/image-with-fallback';

export default function HeroSection() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-emerald-700 scroll-mt-22">
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://res.cloudinary.com/company-garment/image/upload/v1766765610/2.png"
          alt="Garment factory production line"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 to-emerald-800/85" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24">
        <div className="max-w-3xl">
          <div className="inline-block mb-6 px-5 py-2.5 bg-amber-400/20 rounded-full border border-amber-400/30">
            <span className="text-amber-400 text-bold">{t(locale, 'title')}</span>
          </div>
          <h1 className="text-emerald-50 mb-4 tracking-tight">{t(locale, 'heroTitle')}</h1>
          <div className="text-2xl text-amber-400 mb-6">{t(locale, 'heroSubtitle')}</div>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed">{t(locale, 'heroDescription')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2 bg-amber-400 text-amber-900 px-8 py-4 rounded-xl hover:bg-amber-500"
            >
              {t(locale, 'ctaQuote')} <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className="inline-flex items-center gap-2 border-2 border-emerald-50 text-emerald-50 px-8 py-4 rounded-xl hover:bg-emerald-50/10"
            >
              <Eye size={20} /> {t(locale, 'ctaCapabilities')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
