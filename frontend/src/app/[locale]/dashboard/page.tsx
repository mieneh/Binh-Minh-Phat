'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { t } from '@/i18n';
import { Users, Briefcase, Mail, Package } from 'lucide-react';
import { toast } from 'react-toastify';

import { userService } from '@/lib/services/user.service';
import { applicantService } from '@/lib/services/applicant.service';
import { contactService } from '@/lib/services/contact.service';
import { productService } from '@/lib/services/product.service';

export default function DashboardPage() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [loading, setLoading] = useState(true);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [applicantsCount, setApplicantsCount] = useState<number | null>(null);
  const [contactsCount, setContactsCount] = useState<number | null>(null);
  const [productsCount, setProductsCount] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ users, applicants, contacts, products ] = await Promise.all([
        userService.getAll(),
        applicantService.getAll(),
        contactService.getAll(),
        productService.getAll(),
      ]);
      setUsersCount(users.data?.length || 0);
      setApplicantsCount(applicants.data?.length || 0);
      setContactsCount(contacts.data?.length || 0);
      setProductsCount(products.data?.length || 0);
    } catch (error: any) {
      toast.error(error?.message || t(locale, 'fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      icon: Users,
      label: t(locale, 'totalUsers'),
      value: usersCount ?? '--',
    },
    {
      icon: Briefcase,
      label: t(locale, 'totalApplicants'),
      value: applicantsCount ?? '--',
    },
    {
      icon: Mail,
      label: t(locale, 'totalContacts'),
      value: contactsCount ?? '--',
    },
    {
      icon: Package,
      label: t(locale, 'totalProducts'),
      value: productsCount ?? '--',
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t(locale, 'welcomeDashboard')}</h1>
        <p className="text-sm mt-2 opacity-80">{t(locale, 'dashboardSubtitle')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div key={idx} className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-4" >
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="text-xl font-semibold text-slate-900">
                {loading ? '--' : item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">
          {t(locale, 'dashboardGuideTitle')}
        </h2>
        <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
          <li>{t(locale, 'dashboardGuideUsers')}</li>
          <li>{t(locale, 'dashboardGuideProducts')}</li>
          <li>{t(locale, 'dashboardGuideRecruitment')}</li>
          <li>{t(locale, 'dashboardGuideContacts')}</li>
        </ul>
      </div>
    </div>
  );
}
