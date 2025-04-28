"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { GripHorizontal, Bell, CheckCircle, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { emitNotificationUpdated } from "@/lib/events/notification";
import { t } from "@/i18n";
import { toast } from 'react-toastify';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notificationService, Notification, NotificationType } from "@/lib/services/notification.service";

type ReadFilter = "all" | "unread";
type TypeFilter = "" | NotificationType;

export default function NotificationsPage() {
  const { locale } = useParams() as { locale: "vi" | "en" };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await notificationService.getAll();
    setNotifications(res.data);
    setLoading(false);
  };

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filtered = useMemo(() => {
    let data = [...notifications];
    if (readFilter === "unread") {
      data = data.filter((n) => !n.read);
    }
    if (typeFilter) {
      data = data.filter((n) => n.type === typeFilter);
    }
    return data;
  }, [notifications, readFilter, typeFilter]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    emitNotificationUpdated();
  };

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    emitNotificationUpdated();
  };

  const deleteOne = async (id: string) => {
    const res = await notificationService.removeOne(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    emitNotificationUpdated();
    toast.success(res.message);
  };

  const deleteAll = async () => {
    const res = await notificationService.removeAll();
    setNotifications([]);
    emitNotificationUpdated();
    toast.success(res.message);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString(locale === "vi" ? "vi-VN" : "en-US");

  if (loading) {
    return <p className="text-center py-20">{t(locale, "loading")}</p>;
  }

  return (
    <div>
      <Navbar />
      <section className="max-w-5xl mx-auto p-5 mb-7 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t(locale, "notifications")}</h1>
            <p className="text-sm text-gray-500 mt-1">{t(locale, "unread")}: <b>{unreadCount}</b></p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="px-3 py-2 text-sm rounded bg-emerald-600 text-white disabled:opacity-50"
            >
              {t(locale, "markAllRead")}
            </button>
            <button
              onClick={deleteAll}
              disabled={notifications.length === 0}
              className="px-3 py-2 text-sm rounded border text-red-600 disabled:opacity-50"
            >
              {t(locale, "deleteAll")}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">{t(locale, "all")}</option>
            <option value="APPLICANT">Applicant</option>
            <option value="CONTACT">Contact</option>
          </select>
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value as ReadFilter)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">{t(locale, "all")}</option>
            <option value="unread">{t(locale, "unread")}</option>
          </select>
        </div>
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-16">{t(locale, "noNotifications")}</div>
          )}
          {filtered.map((n) => (
            <div
              key={n._id}
              className={`rounded-xl border p-4 flex gap-4 items-start ${n.read ? "bg-white" : "bg-emerald-50 border-emerald-300"}`}
            >
              <div className="mt-1">
                {n.read ? (
                  <CheckCircle className="text-gray-400" size={18} />
                ) : (
                  <Bell className="text-emerald-600" size={18} />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{n.title}</div>
                {n.message && (
                  <div className="text-sm text-gray-600 mt-1">{n.message}</div>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock size={14} />
                  {formatDate(n.createdAt)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <GripHorizontal className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!n.read && (
                      <DropdownMenuItem onClick={() => markAsRead(n._id)}>
                        {t(locale, 'markAsRead')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => deleteOne(n._id)} className="text-red-600">
                      {t(locale, 'delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
