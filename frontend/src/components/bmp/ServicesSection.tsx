'use client';

import { useParams } from 'next/navigation';
import { Scissors, Lightbulb, ShieldCheck, Ship } from 'lucide-react';
import { t } from '@/i18n';

export default function ServicesSection() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const services = [
    {
      icon: Scissors,
      title: t(locale, 'service1Title'),
      description: t(locale, 'service1Desc'),
      features: ['CMT', 'FOB', 'Sampling', 'Bulk Production'],
    },
    {
      icon: Lightbulb,
      title: t(locale, 'service2Title'),
      description: t(locale, 'service2Desc'),
      features: ['Design Support', 'Pattern Making', 'Tech Pack', 'Prototyping'],
    },
    {
      icon: ShieldCheck,
      title: t(locale, 'service3Title'),
      description: t(locale, 'service3Desc'),
      features: ['Incoming QC', 'In-line QC', 'Final QC', 'AQL Standards'],
    },
    {
      icon: Ship,
      title: t(locale, 'service4Title'),
      description: t(locale, 'service4Desc'),
      features: ['Customs', 'Freight', 'Documentation', 'Tracking'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-emerald-700 scroll-mt-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-5 px-4 py-2 bg-amber-400/20 rounded-full border border-amber-400/30">
            <span className="text-amber-400 text-lg">{t(locale, 'servicesBadge')}</span>
          </div>
          <h2 className="text-emerald-50 mb-4 tracking-tight">{t(locale, 'servicesTitle')}</h2>
          <p className="text-emerald-100 max-w-2xl mx-auto leading-relaxed">{t(locale, 'servicesSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-amber-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <service.icon className="text-amber-900" size={26} />
              </div>
              <h3 className="text-emerald-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-5 text-sm leading-relaxed">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, idx) => (
                  <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
