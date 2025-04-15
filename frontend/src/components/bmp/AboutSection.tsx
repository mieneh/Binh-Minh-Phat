"use client";

import { useParams } from "next/navigation";
import { TrendingUp, Globe2, Award } from "lucide-react";
import { t } from "@/i18n";
import { ImageWithFallback } from "../ui/image-with-fallback";

export default function AboutSection() {
  const { locale } = useParams() as { locale: "vi" | "en" };

  const stats = [
    {
      icon: TrendingUp,
      number: "100,000+",
      label: t(locale, "statCapacity"),
      color: "text-amber-400",
    },
    {
      icon: Globe2,
      number: "25+",
      label: t(locale, "statCountries"),
      color: "text-emerald-400",
    },
    {
      icon: Award,
      number: "98%",
      label: t(locale, "statOnTime"),
      color: "text-amber-400",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white scroll-mt-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-slate-50 rounded-xl p-8 border border-gray-200">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-emerald-700 rounded-xl flex items-center justify-center">
                  <stat.icon className={stat.color} size={28} />
                </div>
              </div>
              <div className="text-emerald-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-700/10 rounded-full">
              <span className="text-emerald-700">
                {t(locale, "aboutBadge")}
              </span>
            </div>
            <h2 className="text-emerald-900 mb-6 tracking-tight">{t(locale, "aboutTitle")}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">{t(locale, "aboutDesc1")}</p>
            <p className="text-gray-600 leading-relaxed">{t(locale, "aboutDesc2")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-amber-400/20 text-amber-900 rounded-lg text-sm">CMT / FOB</div>
              <div className="px-4 py-2 bg-amber-400/20 text-amber-900 rounded-lg text-sm">OEM / ODM</div>
              <div className="px-4 py-2 bg-amber-400/20 text-amber-900 rounded-lg text-sm">{t(locale, "aboutQuality")}</div>
              <div className="px-4 py-2 bg-amber-400/20 text-amber-900 rounded-lg text-sm">{t(locale, "aboutExport")}</div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://res.cloudinary.com/company-garment/image/upload/v1766767577/congty.png"
                alt="Manufacturing facility"
                className="w-full h-96 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
