'use client';

import { useParams } from 'next/navigation';
import { Shield, Users, Globe2, Leaf } from 'lucide-react';
import { t } from '@/i18n';

export default function CertificationsSection() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const certifications = [
    {
      icon: Shield,
      name: t(locale, 'certIso'),
      description: t(locale, 'certIsoDesc'),
    },
    {
      icon: Users,
      name: t(locale, 'certBsci'),
      description: t(locale, 'certBsciDesc'),
    },
    {
      icon: Globe2,
      name: t(locale, 'certWrap'),
      description: t(locale, 'certWrapDesc'),
    },
    {
      icon: Leaf,
      name: t(locale, 'certGots'),
      description: t(locale, 'certGotsDesc'),
    },
  ];

  return (
    <section id="certifications" className="py-20 bg-emerald-700 scroll-mt-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-5 px-4 py-2 bg-amber-400/20 rounded-full border border-amber-400/30">
            <span className="text-amber-400 text-lg">{t(locale, 'certificationsBadge')}</span>
          </div>
          <h2 className="text-emerald-50 mb-4 tracking-tight">{t(locale, 'certificationsTitle')}</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto leading-relaxed">{t(locale, 'certificationsDesc')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center border-4 border-amber-400/20">
                <cert.icon className="text-emerald-700" size={32} />
              </div>
              <h4 className="text-emerald-900 mb-2">{cert.name}</h4>
              <p className="text-gray-600 text-sm">{cert.description}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-emerald-200 text-sm italic">{t(locale, 'certNote')}</p>
      </div>
    </section>
  );
}
