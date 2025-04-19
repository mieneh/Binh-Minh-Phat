'use client';

import { useParams } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/i18n';
import { contactService } from '@/lib/services/contact.service';

export default function ContactSection() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    company: '',
    country: '',
    volume: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await contactService.create({
        fullName: formData.fullname,
        email: formData.email,
        company: formData.company || undefined,
        country: formData.country || undefined,
        volume: formData.volume || undefined,
        message: formData.message,
      });

      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
        setFormData({
          fullname: '',
          email: '',
          company: '',
          country: '',
          volume: '',
          message: '',
        });
      }, 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t(locale, 'address'),
      content: t(locale, 'addressValue'),
    },
    {
      icon: Phone,
      title: t(locale, 'phone'),
      content: '+84 862 003 700',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'congtymayxnkbinhminhphat@gmail.com',
    },
    {
      icon: Clock,
      title: t(locale, 'hours'),
      content: t(locale, 'hoursValue'),
    },
  ];

  return (
    <section id="contact" className="py-20 bg-slate-50 scroll-mt-22">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-700/10 rounded-full"><span className="text-emerald-700">{t(locale, 'contactBadge')}</span></div>
          <h2 className="text-emerald-900 mb-4 tracking-tight">{t(locale, 'contactTitle')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{t(locale, 'contactSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-6 mb-7">
                <div>
                  <label htmlFor="name" className="block text-emerald-900 mb-2">
                    {t(locale, 'fullName')} <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t(locale, 'formNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-emerald-900 mb-2">
                    Email <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t(locale, 'formEmailPlaceholder')}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-7">
                <div>
                  <label htmlFor="company" className="block text-emerald-900 mb-2">{t(locale, 'company')}</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t(locale, 'formCompanyPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-emerald-900 mb-2">{t(locale, 'country')}</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder={t(locale, 'formCountryPlaceholder')}
                  />
                </div>
              </div>
              <div className="mb-7">
                <label htmlFor="volume" className="block text-emerald-900 mb-2">{t(locale, 'volume')}</label>
                <input
                  type="text"
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={t(locale, 'formVolumePlaceholder')}
                />
              </div>
              <div className="mb-7">
                <label htmlFor="message" className="block text-emerald-900 mb-2">
                  {t(locale, 'formMessage')} <span className="text-red-500"> *</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  placeholder={t(locale, 'formMessagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className="w-full bg-amber-400 text-amber-900 px-8 py-4 rounded-lg hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {status === 'idle' && (
                  <>
                    {t(locale, 'formSubmit')}
                    <Send size={18} />
                  </>
                )}
                {status === 'sending' && (
                  <>
                    {t(locale, 'formSending')}
                    <div className="w-5 h-5 border-2 border-amber-900 border-t-transparent rounded-full animate-spin"></div>
                  </>
                )}
                {status === 'success' && (
                  <>
                    {t(locale, 'formSuccess')}
                    <CheckCircle size={18} />
                  </>
                )}
                {status === 'error' && (
                  <>
                    {t(locale, 'formError')}
                    <AlertCircle size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h3 className="text-emerald-900 mb-6">{t(locale, 'contactInfo')}</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0"><info.icon className="text-amber-400" size={20} /></div>
                    <div>
                      <div className="text-emerald-900 mb-1">{info.title}</div>
                      <div className="text-gray-600 text-sm">{info.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.0065834598754!2d106.95676927589703!3d10.962874789197416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x63b22e7f5e485cad%3A0x8541023b7697611b!2sC%C3%B4ng%20ty%20TNHH%20May%20XNK%20B%C3%ACnh%20Minh%20Ph%C3%A1t!5e0!3m2!1sen!2s!4v1767255753460!5m2!1sen!2s"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
