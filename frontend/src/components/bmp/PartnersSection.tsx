'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Quote } from 'lucide-react';
import { t } from '@/i18n';
import { partnerService, Partner } from '@/lib/services/partner.service';

export default function PartnersSection() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [partners, setPartners] = useState<Partner[]>([]);

  const fetchPartners = async () => {
    const res = await partnerService.getAll();
    setPartners(res.data || []);  
  };

  useEffect(() => {
    fetchPartners();
  }, []);
  
  const testimonials = [
    {
      text: t(locale, 'testimonial1Text'),
      author: t(locale, 'testimonial1Author'),
      company: t(locale, 'testimonial1Company'),
    },
    {
      text: t(locale, 'testimonial2Text'),
      author: t(locale, 'testimonial2Author'),
      company: t(locale, 'testimonial2Company'),
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    const speed = 0.4;
    const animate = () => {
      x -= speed;
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(x) >= halfWidth) {
        x = 0;
      }
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [partners]);

  return (
    <section id="partners" className="py-20 bg-slate-50 scroll-mt-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-5 px-4 py-2 bg-emerald-700/10 rounded-full">
            <span className="text-emerald-700 text-lg">{t(locale, 'partnersBadge')}</span>
          </div>
          <h2 className="text-emerald-900 mb-4 tracking-tight">{t(locale, 'partnersTitle')}</h2>
        </div>
        <div ref={containerRef} className="relative overflow-hidden mb-16">
          <div ref={trackRef} className="flex items-center w-max" style={{ willChange: 'transform' }} >
            {[...partners, ...partners].map((partner, index) => {
              return (
                <div key={`${partner._id}-${index}`} className="flex items-center justify-center min-w-[160px] h-20">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    loading="lazy"
                    className="max-h-20 object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center mb-6">
                <Quote className="text-amber-900" size={24} />
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">{testimonial.text}</p>
              <div>
                <div className="text-emerald-900 mb-1">{testimonial.author}</div>
                <div className="text-gray-600 text-sm">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
