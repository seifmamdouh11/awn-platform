"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLoggedInData } from "@/app/Context/LoggedInDataContext";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { useThemeToggle } from "@/app/Hooks/ThemeHook/ThemeProvider";
import Swal from "sweetalert2";
import {
  Home,
  Briefcase,
  ClipboardList,
  CalendarDays,
  User,
  LogOut,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
  Wallet,
  Bell,
  CheckCircle,
} from "lucide-react";
import { useNotifications } from "@/app/Context/NotificationsContext";

const sidebarTranslations = {
  en: {
    home: "Home",
    opportunities: "Opportunities",
    applications: "My Applications",
    events: "My Events",
    profile: "Profile",
    wallet: "My Wallet",
    logout: "Logout",
    volunteer: "Volunteer",
    notifications: "Notifications",
    noNotifications: "No new notifications",
    markAllAsRead: "Mark all as read",
    justNow: "Just now",
  },
  ar: {
    home: "الرئيسية",
    opportunities: "الفرص",
    applications: "طلباتي",
    events: "فعالياتي",
    profile: "الملف الشخصي",
    wallet: "محفظتي",
    logout: "تسجيل الخروج",
    volunteer: "متطوع",
    notifications: "الإشعارات",
    markAllAsRead: "تحديد الكل كمقروء",
    noNotifications: "لا توجد إشعارات حالياً",
    justNow: "الآن"
  },
};

const formatTimeAgo = (dateStr: string, isAr: boolean) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return isAr ? "الآن" : "Just now";
  if (minutes < 60) return isAr ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isAr ? `منذ ${hours} ساعة` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return isAr ? `منذ ${days} يوم` : `${days}d ago`;
};

export default function VolunteerNavbar() {
  const { data } = useLoggedInData();
  const { lang, setLang } = useLang();
  const { theme, toggleTheme } = useThemeToggle();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const t = lang === "ar" ? sidebarTranslations.ar : sidebarTranslations.en;
  const isRTL = lang === "ar";

  const fullName =
    [data?.first_name, data?.last_name].filter(Boolean).join(" ").trim() ||
    t.volunteer;

  const initial =
    data?.first_name?.charAt(0)?.toUpperCase() ||
    data?.last_name?.charAt(0)?.toUpperCase() ||
    "V";

  const navItems = [
    { href: "/volunteer/home", label: t.home, icon: <Home size={20} /> },
    { href: "/volunteer/opportunities", label: t.opportunities, icon: <Briefcase size={20} /> },
    { href: "/volunteer/applications", label: t.applications, icon: <ClipboardList size={20} /> },
    { href: "/volunteer/events", label: t.events, icon: <CalendarDays size={20} /> },
    { href: "/volunteer/wallet", label: t.wallet || "Wallet", icon: <Wallet size={20} /> },
    { href: "/volunteer/profile", label: t.profile, icon: <User size={20} /> },
  ];

  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: isRTL ? "هل أنت متأكد؟" : "Are you sure?",
      text: isRTL
        ? "هل انت متأكد من أنك تريد تسجيل الخروج؟"
        : "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonText: isRTL ? "تسجيل الخروج" : "Log out",
      cancelButtonText: isRTL ? "إلغاء" : "Cancel",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/");
      }
    });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 cursor-default">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[#febc5a] to-[#d97706] flex items-center justify-center shadow-lg shadow-[#febc5a]/20">
          <span className="font-black text-black text-xl">{initial}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            {t.volunteer}
          </p>
          <p className="text-sm font-black text-foreground tracking-tight truncate">
            {fullName}
          </p>
        </div>

        {/* Desktop Bell Icon */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative rounded-full p-2 text-foreground/60 transition hover:bg-foreground/5 hover:text-foreground active:scale-95"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${isActive
                  ? "bg-[#febc5a] text-black shadow-md shadow-[#febc5a]/20"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="pt-6 border-t border-foreground/10 space-y-2">
        <div className="flex items-center gap-2 px-2 pb-2">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 py-2.5 text-xs font-bold text-foreground/60 transition hover:bg-foreground/10 hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {theme === "dark"
              ? isRTL ? "فاتح" : "Light"
              : isRTL ? "داكن" : "Dark"}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 py-2.5 text-xs font-bold text-foreground/60 transition hover:bg-foreground/10 hover:text-foreground"
          >
            <Languages size={14} />
            {lang === "en" ? "العربية" : "English"}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500/80 transition hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={18} />
          {t.logout}
        </button>
      </div>
    </div>
  );

  const NotificationsDrawer = () => (
    <aside
      className={`fixed top-0 z-[60] h-full w-full sm:w-96 bg-background shadow-2xl p-5 flex flex-col transition-transform duration-300 ${isRTL
          ? `left-0 border-e border-foreground/10 ${notificationsOpen ? "translate-x-0" : "-translate-x-full"}`
          : `right-0 border-s border-foreground/10 ${notificationsOpen ? "translate-x-0" : "translate-x-full"}`
        }`}
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-foreground/10">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Bell size={20} className="text-[#febc5a] fill-[#febc5a]/20" />
          {t.notifications || "Notifications"}
          {unreadCount > 0 && (
            <span className="bg-[#febc5a] text-black text-xs px-2 py-0.5 rounded-full font-black">
              {unreadCount}
            </span>
          )}
        </h2>
        <button
          onClick={() => setNotificationsOpen(false)}
          className="rounded-xl p-2 text-foreground/50 hover:bg-foreground/10 hover:text-foreground"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-foreground/40 space-y-4">
            <Bell size={48} className="opacity-20" />
            <p className="font-medium">{t.noNotifications || "No new notifications"}</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.is_read) markAsRead(notif.id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${notif.is_read
                  ? "bg-foreground/5 border-transparent text-foreground/70"
                  : "bg-background border-[#febc5a]/30 shadow-md shadow-[#febc5a]/5 text-foreground ring-1 ring-[#febc5a]/10"
                }`}
            >
              <div className="flex justify-between items-start gap-3 mb-2">
                <h4 className={`font-bold text-sm ${!notif.is_read ? "text-foreground" : ""}`}>
                  {isRTL ? notif.title_ar || notif.title : notif.title_en || notif.title}
                </h4>
                <span className="text-[10px] uppercase font-bold text-foreground/40 whitespace-nowrap pt-1">
                  {formatTimeAgo(notif.created_at, isRTL)}
                </span>
              </div>
              <p className="text-sm leading-relaxed opacity-80">
                {isRTL ? notif.message_ar || notif.message : notif.message_en || notif.message}
              </p>
            </div>
          ))
        )}
      </div>

      {unreadCount > 0 && (
        <div className="pt-4 mt-4 border-t border-foreground/10">
          <button
            onClick={markAllAsRead}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-2xl bg-foreground/5 font-semibold text-sm transition hover:bg-foreground/10 hover:text-foreground"
          >
            <CheckCircle size={16} />
            {t.markAllAsRead || "Mark all as read"}
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <motion.aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`hidden md:flex fixed top-0 ${isRTL ? "right-0 border-s" : "left-0 border-e"
          } z-50 h-screen w-64 flex-col bg-background border-foreground/5 shadow-sm p-5`}
        initial={{ x: isRTL ? 80 : -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <SidebarContent />
      </motion.aside>

      {/* ── MOBILE BACKDROP ── */}
      {(mobileOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setMobileOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`fixed top-0 z-50 h-full w-72 bg-background shadow-2xl p-5 flex flex-col transition-transform duration-300 md:hidden ${isRTL
            ? `right-0 border-e border-foreground/10 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`
            : `left-0 border-e border-foreground/10 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
          }`}
      >
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-xl p-2 text-foreground/50 hover:bg-foreground/10 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* ── NOTIFICATIONS DRAWER ── */}
      <NotificationsDrawer />

      {/* ── MOBILE TOPBAR ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-foreground/5 bg-background/80 backdrop-blur-sm px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl p-2 text-foreground/60 hover:bg-foreground/10 hover:text-foreground transition"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#febc5a] to-[#d97706] flex items-center justify-center">
            <span className="font-black text-black text-sm">{initial}</span>
          </div>
          <span className="font-bold text-foreground text-sm">{fullName}</span>
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile Bell Icon */}
          <button
            onClick={() => setNotificationsOpen(true)}
            className="relative rounded-lg p-2 text-foreground/60 hover:bg-foreground/10 transition"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-background">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-foreground/60 hover:bg-foreground/10 transition"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="rounded-lg p-2 text-foreground/60 hover:bg-foreground/10 transition text-xs font-bold"
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
        </div>
      </header>
    </>
  );
}