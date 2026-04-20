"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLoggedInData } from "@/app/Context/LoggedInDataContext";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { useThemeToggle } from "@/app/Hooks/ThemeHook/ThemeProvider";
import { useSidebar } from "@/app/Context/SidebarContext";
import Swal from "sweetalert2";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
  Wallet,
  Crown,
  Star,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const sidebarTranslations = {
  en: {
    dashboard: "Dashboard",
    opportunities: "Opportunities",
    applicants: "Applicants",
    analytics: "Analytics",
    settings: "Settings",
    logout: "Logout",
    company: "Company",
    wallet: "Wallet",
    subscriptions: "Subscriptions",
    reviews: "Reviews",
  },
  ar: {
    dashboard: "لوحة التحكم",
    opportunities: "الفرص",
    applicants: "المتقدمون",
    analytics: "الإحصائيات",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    company: "شركة",
    wallet: "المحفظة",
    subscriptions: "الاشتراكات",
    reviews: "التقييمات",
  },
};

export default function CompanyNavbar() {
  const { data } = useLoggedInData();
  const { lang, setLang } = useLang();
  const { theme, toggleTheme } = useThemeToggle();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = lang === "ar" ? sidebarTranslations.ar : sidebarTranslations.en;
  const isRTL = lang === "ar";

  const navItems = [
    { href: "/company/dashboard", label: t.dashboard, icon: <LayoutDashboard size={20} /> },
    { href: "/company/opportunities", label: t.opportunities, icon: <Briefcase size={20} /> },
    { href: "/company/applicants", label: t.applicants, icon: <Users size={20} /> },
    { href: "/company/wallet", label: t.wallet, icon: <Wallet size={20} /> },
    { href: "/company/subscriptions", label: t.subscriptions, icon: <Crown size={20} /> },
    { href: "/company/reviews", label: t.reviews, icon: <Star size={20} /> },
    { href: "/company/analytics", label: t.analytics, icon: <BarChart3 size={20} /> },
    { href: "/company/settings", label: t.settings, icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: isRTL ? "هل أنت متأكد؟" : "Are you sure?",
      text: isRTL ? "هل انت متأكد من أنك تريد تسجيل الخروج؟" : "Are you sure you want to log out?",
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

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Brand */}
      <div className={`flex items-center gap-3 mb-8 cursor-default overflow-hidden ${collapsed && 'justify-center'}`}>
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[#febc5a] to-[#d97706] flex items-center justify-center shadow-lg shadow-[#febc5a]/20">
          <span className="font-black text-black text-xl">
            {data?.company_name?.charAt(0)?.toUpperCase() || "C"}
          </span>
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{t.company}</p>
            <p className="text-sm font-black text-foreground tracking-tight truncate">{data?.company_name || "—"}</p>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all relative group/nav ${isActive
                ? "bg-[#febc5a] text-black shadow-md shadow-[#febc5a]/20"
                : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                } ${collapsed && 'justify-center px-0 h-12 w-12 mx-auto'}`}
            >
              <div className="shrink-0">{item.icon}</div>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                  {item.label}
                </motion.span>
              )}
              {collapsed && (
                <div className={`absolute ${isRTL ? 'right-full mr-4' : 'left-full ml-4'} invisible group-hover/nav:visible px-3 py-2 bg-foreground text-background text-xs font-bold whitespace-nowrap rounded-lg shadow-2xl z-[60]`}>
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="pt-6 border-t border-foreground/10 space-y-2">
        <div className={`flex items-center gap-2 pb-2 ${collapsed ? 'flex-col px-0' : 'px-2'}`}>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 py-2.5 text-xs font-bold text-foreground/60 transition hover:bg-foreground/10 hover:text-foreground ${collapsed ? 'h-11 w-11' : 'flex-1'}`}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {!collapsed && (theme === "dark" ? (isRTL ? "فاتح" : "Light") : (isRTL ? "داكن" : "Dark"))}
          </button>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className={`flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 py-2.5 text-xs font-bold text-foreground/60 transition hover:bg-foreground/10 hover:text-foreground ${collapsed ? 'h-11 w-11' : 'flex-1'}`}
          >
            <Languages size={14} />
            {!collapsed && (lang === "en" ? "العربية" : "English")}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500/80 transition hover:bg-red-500/10 hover:text-red-500 relative group/logout ${collapsed && 'justify-center px-0'}`}
        >
          <div className="shrink-0"><LogOut size={18} /></div>
          {!collapsed && <span>{t.logout}</span>}
          {collapsed && (
            <div className={`absolute ${isRTL ? 'right-full mr-4' : 'left-full ml-4'} invisible group-hover/logout:visible px-3 py-2 bg-red-500 text-white text-xs font-bold whitespace-nowrap rounded-lg shadow-2xl z-[60]`}>
              {t.logout}
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <motion.aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`hidden md:flex fixed top-0 ${isRTL ? "right-0" : "left-0"} border-e z-50 h-screen flex-col bg-background border-foreground/10 dark:border-foreground/20 shadow-sm ${isCollapsed ? "p-4" : "p-5"}`}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <SidebarContent collapsed={isCollapsed} />

        <button
          onClick={toggleSidebar}
          className={`absolute top-[50%] ${isRTL ? '-left-4' : '-right-4'} h-8 w-8 rounded-full bg-[#febc5a] text-black shadow-xl shadow-[#febc5a]/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-[60]`}
        >
          {isCollapsed ? (
            isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
          ) : (
            isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
          )}
        </button>
      </motion.aside>

      {/* ── MOBILE BACKDROP ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`fixed top-0 z-50 h-full w-72 bg-background shadow-2xl p-5 flex flex-col transition-transform duration-300 md:hidden ${isRTL
          ? `right-0 border-s border-foreground/10 dark:border-foreground/20 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`
          : `left-0 border-e border-foreground/10 dark:border-foreground/20 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
          }`}
      >
        <div className="flex items-center justify-end mb-4">
          <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 text-foreground/50 hover:bg-foreground/10 hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <SidebarContent collapsed={false} />
      </aside>

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
            <span className="font-black text-black text-sm">{data?.company_name?.charAt(0)?.toUpperCase() || "C"}</span>
          </div>
          <span className="font-bold text-foreground text-sm">{data?.company_name || "Company"}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="rounded-lg p-2 text-foreground/60 hover:bg-foreground/10 transition">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="rounded-lg p-2 text-foreground/60 hover:bg-foreground/10 transition text-xs font-bold">
            {lang === "en" ? "ع" : "EN"}
          </button>
        </div>
      </header>
    </>
  );
}