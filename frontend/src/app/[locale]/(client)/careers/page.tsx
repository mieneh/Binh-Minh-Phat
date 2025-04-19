'use client';

import { useParams } from 'next/navigation';
import { Clock, Hash, ArrowUpDown, Building2, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { t } from '@/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { recruitmentService, Recruitment } from '@/lib/services/recruitment.service';
import { JobDetailModal } from '@/components/bmp/components/JobDetailModal';
import { JobApplicationModal } from '@/components/bmp/components/JobApplicationModal';

type SortOption = 'newest' | 'oldest';

export default function CareersPage() {
    const { locale } = useParams() as { locale: 'vi' | 'en' };

    const [jobs, setJobs] = useState<Recruitment[]>([]);
    const [loading, setLoading] = useState(true);

    const [sort, setSort] = useState<SortOption>('newest');
    const [department, setDepartment] = useState<string>('all');
    const [location, setLocation] = useState('all');

    const [selectedJob, setSelectedJob] = useState<Recruitment | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);

    useEffect(() => {
        recruitmentService.getAll().then((res) => {
            setJobs(res.data || []);
            setLoading(false);
        });
    }, []);

    const departments = useMemo(() => Array.from(new Set(jobs.map((j) => j.positionId.departmentId.name))),[jobs]);

    const locations = useMemo(() => Array.from(new Set( jobs.map((j) => [j.addressId.location.street, j.addressId.location.ward, j.addressId.location.province].filter(Boolean).join(', ')))),[jobs]);

    const filteredJobs = useMemo(() => {
        let data = [...jobs];
        if (department !== 'all') {
            data = data.filter(
                (j) => j.positionId.departmentId.name === department,
            );
        }
        if (location !== 'all') {
            data = data.filter(
                (j) => [j.addressId.location.street, j.addressId.location.ward, j.addressId.location.province].filter(Boolean).join(', ') === location
            );
        }
        data.sort((a, b) => {
            const aTime = new Date(a.createdAt || '').getTime();
            const bTime = new Date(b.createdAt || '').getTime();
            return sort === 'newest' ? bTime - aTime : aTime - bTime;
        });
        return data;
    }, [jobs, sort, department, location]);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) {
        return <p className="text-center py-20">Loading...</p>;
    }

    return (
        <div>
            <Navbar />
            <section className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold py-5">{t(locale, 'recruitment')}</h1>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    <div className="relative">
                        <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortOption)}
                            className="w-full border rounded pl-7 pr-3 py-2"
                        >
                            <option value="newest">{t(locale, 'sortNewest')}</option>
                            <option value="oldest">{t(locale, 'sortOldest')}</option>
                        </select>
                    </div>
                    <div className="relative">
                        <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full border rounded pl-7 pr-3 py-2"
                        >
                            <option value="all">{t(locale, 'allDepartments')}</option>
                            {departments.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full border rounded pl-7 pr-3 py-2"
                        >
                            <option value="all">{t(locale, 'allLocations')}</option>
                            {locations.map((l) => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job._id} className="bg-slate-50 rounded-xl p-6 border hover:border-emerald-300">
                            <h3 className="text-emerald-900 font-medium mb-1">{job.positionId.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{job.positionId.departmentId.name}</p>
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
                                    onClick={() => {
                                        setSelectedJob(job);
                                        setShowApplyModal(true);
                                    }}
                                    className="flex-1 bg-amber-400 text-amber-900 px-4 py-2 rounded-lg hover:bg-amber-500"
                                >
                                    {t(locale, 'careersApply')}
                                </button>
                            </div>
                        </div>
                    ))}
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
                        setShowApplyModal(true);
                    }}
                />
            )}

            {selectedJob && (
                <JobApplicationModal
                    job={selectedJob}
                    isOpen={showApplyModal}
                    onClose={() => {
                        setShowApplyModal(false);
                        setSelectedJob(null);
                    }}
                />
            )}
            <Footer />  
        </div>
    );
}
