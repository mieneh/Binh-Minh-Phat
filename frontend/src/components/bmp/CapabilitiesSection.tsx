'use client';

import { useParams } from 'next/navigation';
import { MessageSquare, Ruler, Package, Factory, CheckCircle2, Settings, Clock, Hash } from 'lucide-react';
import { t } from '@/i18n';

export default function CapabilitiesSection() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const steps = [
    {
      icon: MessageSquare,
      title: t(locale, 'step1Title'),
      description: t(locale, 'step1Desc'),
    },
    {
      icon: Ruler,
      title: t(locale, 'step2Title'),
      description: t(locale, 'step2Desc'),
    },
    {
      icon: Package,
      title: t(locale, 'step3Title'),
      description: t(locale, 'step3Desc'),
    },
    {
      icon: Factory,
      title: t(locale, 'step4Title'),
      description: t(locale, 'step4Desc'),
    },
    {
      icon: CheckCircle2,
      title: t(locale, 'step5Title'),
      description: t(locale, 'step5Desc'),
    },
  ];

  const capabilities = [
    {
      icon: Settings,
      title: t(locale, 'capabilityEquipment'),
      value: t(locale, 'capabilityEquipmentValue'),
      color: 'bg-amber-400',
      iconColor: 'text-amber-900',
    },
    {
      icon: Clock,
      title: t(locale, 'capabilityLeadTime'),
      value: t(locale, 'capabilityLeadTimeValue'),
      color: 'bg-emerald-600',
      iconColor: 'text-emerald-50',
    },
    {
      icon: Hash,
      title: t(locale, 'capabilityMoq'),
      value: t(locale, 'capabilityMoqValue'),
      color: 'bg-amber-400',
      iconColor: 'text-amber-900',
    },
  ];

  return (
    <section id="capabilities" className="py-20 bg-white scroll-mt-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-5 px-4 py-2 bg-emerald-700/10 rounded-full">
            <span className="text-emerald-700 text-lg">{t(locale, 'capabilitiesBadge')}</span>
          </div>
          <h2 className="text-emerald-900 mb-4 tracking-tight">{t(locale, 'capabilitiesTitle')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{t(locale, 'capabilitiesSubtitle')}</p>
        </div>
        <div className="mb-20">
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-emerald-200"></div>
            <div className="grid md:grid-cols-5 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-24 h-24 bg-emerald-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg group hover:scale-105 transition-transform">
                      <step.icon className="text-amber-400" size={32} />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-amber-900">{index + 1}</span>
                      </div>
                    </div>
                    <h3 className="text-emerald-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <div className="w-0.5 h-8 bg-emerald-200"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-8 border border-gray-200 hover:border-emerald-300 transition-colors">
              <div className={`w-14 h-14 ${capability.color} rounded-xl flex items-center justify-center mb-5`}>
                <capability.icon className={capability.iconColor} size={26} />
              </div>
              <h4 className="text-emerald-900 mb-2">{capability.title}</h4>
              <p className="text-gray-700">{capability.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
