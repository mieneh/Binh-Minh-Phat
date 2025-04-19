'use client';

import { useParams } from 'next/navigation';
import { Briefcase, MapPin, Hash, Clock } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { t } from '@/i18n';
import Link from 'next/link';
import { recruitmentService, Recruitment } from '@/lib/services/recruitment.service';
import { JobApplicationModal } from './components/JobApplicationModal';
import { JobDetailModal } from './components/JobDetailModal';

export default function CareersSection() {
  const { locale } = useParams() as { locale: 'vi' | 'en' };

  const [jobs, setJobs] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Recruitment | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await recruitmentService.getAll();
        setJobs(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const sortedJobs = useMemo(
    () =>
      [...jobs].sort(
        (a, b) =>
          new Date(b.createdAt || '').getTime() -
          new Date(a.createdAt || '').getTime(),
      ),
    [jobs],
  );

  const jobsToShow = sortedJobs.slice(0, 3);

  const handleApply = (job: Recruitment) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <section id="careers" className="py-20 bg-white scroll-mt-22">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-700/10 rounded-full">
              <span className="text-emerald-700">{t(locale, 'careersBadge')}</span>
            </div>
            <h2 className="text-emerald-900 mb-4 tracking-tight">{t(locale, 'careersTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t(locale, 'careersSubtitle')}</p>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : sortedJobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
              <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">{t(locale, 'careersNoOpenings')}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {jobsToShow.map((job) => (
                  <div key={job._id} className="bg-slate-50 rounded-xl p-6 border hover:border-emerald-300 transition">
                    <h3 className="text-emerald-900 mb-1">{job.positionId.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{job.positionId.departmentId.name}</p>
                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={26} />
                        {[job.addressId.location.street,
                          job.addressId.location.ward,
                          job.addressId.location.province]
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Hash size={16} /> {job.quantity}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {t(locale, 'jobPosted')}:{' '}
                        {formatDate(job.createdAt || job.deadline)}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDetailModal(true);
                        }}
                        className="flex-1 border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-50"
                      >
                        {t(locale, 'careersDetails')}
                      </button>
                      <button
                        onClick={() => handleApply(job)}
                        className="flex-1 bg-amber-400 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-500"
                      >
                        {t(locale, 'careersApply')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {sortedJobs.length > 4 && (
                <div className="text-center mt-12">
                  <Link
                    href={`/${locale}/careers`}
                    className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50"
                  >
                    {t(locale, 'careersCta')}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          locale={locale}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onApply={() => {
            setShowDetailModal(false);
            setShowApplicationModal(true);
          }}
        />
      )}

      {selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </>
  );
}
