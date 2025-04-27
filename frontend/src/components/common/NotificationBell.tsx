"use client";

import { useEffect, useState } from "react";
import { t } from "@/i18n";
import Link from "next/link";
import { Bell, Check, Mail, FileText } from "lucide-react";
import { notificationService, Notification } from "@/lib/services/notification.service";

export default function NotificationBell({ locales = ["vi", "en"] }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const locale = locales[0] as "vi" | "en";
  
  const load = async () => {
    const [listRes, countRes] = await Promise.all([
      notificationService.getAll(),
      notificationService.unreadCount(),
    ]);
    setItems(listRes.data);
    setUnreadCount(countRes.data);
  };

  useEffect(() => {
    load(); 
    const handler = () => {
      load();
    };
    window.addEventListener("notification-updated", handler);
    return () => {
      window.removeEventListener("notification-updated", handler);
    };
  }, []);

  const markRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAll = async () => {
    await notificationService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded hover:bg-slate-100"
      >
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-medium leading-none">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-100 bg-white border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b mt-1">
            <span className="font-semibold text-sm">{t(locale, "notifications")}</span>
            {unreadCount > 0 && (
              <button
                onClick={markAll}
                className="text-xs text-emerald-600 hover:underline"
              >
                {t(locale, "markAllRead")}
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 && (
              <div className="p-4 text-sm text-gray-500 text-center">{t(locale, "noNotifications")}</div>
            )}
            {items.slice(0, 5).map((n) => (
              <button
                key={n._id}
                onClick={() => !n.read && markRead(n._id)}
                className={`flex gap-2 w-full text-left px-3 py-2 text-sm border-b last:border-b-0 ${n.read ? "bg-white" : "bg-emerald-50 hover:bg-emerald-100"}`}
              >
                <span className="mt-2">
                  {n.type === 'CONTACT' && (
                    <Mail className="h-5 w-5 text-gray-500" />
                  )}
                  {n.type === 'APPLICANT' && (
                    <FileText className="h-5 w-5 text-gray-500" />
                  )}
                </span>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{n.title}</div>
                    {n.message && (
                      <div className="text-xs text-gray-600 mt-0.5">{n.message}</div>
                    )}
                  </div>
                  {!n.read && (
                    <div className="ml-3 flex items-center gap-1 text-xs text-emerald-600 whitespace-nowrap">
                      <Check size={12} /> {t(locale, "new")}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          {items.length > 5 && (
            <div className="border-t px-3 py-2 text-center">
              <Link href={`/${locale}/notifications`} className="text-sm text-emerald-600 hover:underline">
                {t(locale, "viewAll")}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
