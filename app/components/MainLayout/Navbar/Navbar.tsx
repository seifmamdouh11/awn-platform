"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { useThemeToggle } from "@/app/Hooks/ThemeHook/ThemeProvider";
import {
  Home,
  Info,
  Wrench,
  Mail,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  Languages,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/app/Context/SidebarContext";

type LangType = "en" | "ar";

const sidebarTranslations = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact",
    login: "Login",
    register: "Register",
    loginAsVolunteer: "As Volunteer",
    loginAsCompany: "As Company",
    registerAsVolunteer: "As Volunteer",
    registerAsCompany: "As Company",
    tagline: "Volunteer Platform",
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    services: "الخدمات",
    contact: "تواصل معنا",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    loginAsVolunteer: "كمتطوع",
    loginAsCompany: "كشركة",
    registerAsVolunteer: "كمتطوع",
    registerAsCompany: "كشركة",
    tagline: "منصة التطوع",
  },
};

function AccordionSection({
  icon,
  label,
  children,
  collapsed,
  onExpandSidebar,
  isRTL
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  collapsed?: boolean;
  onExpandSidebar?: () => void;
  isRTL?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative group/nav z-50">
      <button
        onClick={() => {
          if (collapsed && onExpandSidebar) {
            onExpandSidebar();
            setOpen(true);
          } else {
            setOpen((p) => !p);
          }
        }}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all ${collapsed && 'justify-center px-0 h-12 w-12 mx-auto'}`}
      >
        <span className="flex items-center gap-3">
          <div className="shrink-0">{icon}</div>
          {!collapsed && <span>{label}</span>}
        </span>
        {!collapsed && (
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
        )}
      </button>

      {collapsed && (
        <div className={`absolute ${isRTL ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 -translate-y-1/2 invisible group-hover/nav:visible px-3 py-2 bg-foreground text-background text-xs font-bold whitespace-nowrap rounded-lg shadow-2xl z-[60]`}>
          {label}
        </div>
      )}

      {open && !collapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={`${isRTL ? 'mr-7' : 'ms-7'} mt-1 space-y-1`}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { lang, setLang } = useLang();
const { theme, toggleTheme } = useThemeToggle();
const { isCollapsed, toggleSidebar } = useSidebar();
const pathname = usePathname();
const [mobileOpen, setMobileOpen] = useState(false);

const t = lang === "ar" ? sidebarTranslations.ar : sidebarTranslations.en;
const isRTL = lang === "ar";

const isActive = (href: string) => {
  if (href === "/home") return pathname === "/" || pathname === "/home";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const navItems = [
  { href: "/home", label: t.home, icon: <Home size={20} /> },
  { href: "/about", label: t.about, icon: <Info size={20} /> },
  { href: "/services", label: t.services, icon: <Wrench size={20} /> },
  { href: "/contact", label: t.contact, icon: <Mail size={20} /> },
];

const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className="flex flex-col h-full" dir={isRTL ? "rtl" : "ltr"}>
    {/* Brand */}
    <div className={`flex items-center gap-3 mb-8 cursor-default overflow-hidden hidden md:flex ${collapsed && 'justify-center'}`}>
      <div className="h-11 w-11 shrink-0 rounded-xl bg-[#febc5a] flex items-center justify-center p-1.5 overflow-hidden">
        <Image
          src="/logo-awn.png"
          alt="AWN"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            {t.tagline}
          </p>
          <p className="text-sm font-black text-foreground tracking-tight">
            AWN
          </p>
        </motion.div>
      )}
    </div>

    <div className="md:hidden flex items-center gap-3 mb-8 cursor-default overflow-hidden">
      <div className="h-11 w-11 shrink-0 rounded-xl bg-[#febc5a] flex items-center justify-center p-1.5 overflow-hidden">
        <Image
          src="/logo-awn.png"
          alt="AWN"
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
          {t.tagline}
        </p>
        <p className="text-sm font-black text-foreground tracking-tight">
          AWN
        </p>
      </motion.div>
    </div>

    {/* Nav links */}
    <nav className="flex-1 space-y-1">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all relative group/nav ${active
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
              <div className={`absolute ${isRTL ? 'right-full mr-4' : 'left-full ml-4'} top-1/2 -translate-y-1/2 invisible group-hover/nav:visible px-3 py-2 bg-foreground text-background text-xs font-bold whitespace-nowrap rounded-lg shadow-2xl z-[60]`}>
                {item.label}
              </div>
            )}
          </Link>
        );
      })}

      {/* Login accordion */}
      <AccordionSection icon={<LogIn size={20} />} label={t.login} collapsed={collapsed} onExpandSidebar={toggleSidebar} isRTL={isRTL}>
        <Link
          href="/login/volunteer"
          onClick={() => setMobileOpen(false)}
          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all"
        >
          {t.loginAsVolunteer}
        </Link>
        <Link
          href="/login/company"
          onClick={() => setMobileOpen(false)}
          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all"
        >
          {t.loginAsCompany}
        </Link>
      </AccordionSection>

      {/* Register accordion */}
      <AccordionSection icon={<UserPlus size={20} />} label={t.register} collapsed={collapsed} onExpandSidebar={toggleSidebar} isRTL={isRTL}>
        <Link
          href="/register/volunteer"
          onClick={() => setMobileOpen(false)}
          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all"
        >
          {t.registerAsVolunteer}
        </Link>
        <Link
          href="/register/company"
          onClick={() => setMobileOpen(false)}
          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all"
        >
          {t.registerAsCompany}
        </Link>
      </AccordionSection>
    </nav>

    {/* Bottom controls */}
    <div className="pt-6 border-t border-foreground/10 space-y-2">
      <div className={`flex items-center gap-2 pb-2 ${collapsed ? 'flex-col px-0' : 'px-2'}`}>
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 py-2.5 text-xs font-bold text-foreground/60 transition hover:bg-foreground/10 hover:text-foreground ${collapsed ? 'h-11 w-11' : 'flex-1'}`}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          {!collapsed && (theme === "dark"
            ? isRTL ? "فاتح" : "Light"
            : isRTL ? "داكن" : "Dark")}
        </button>
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className={`flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/5 py-2.5 text-xs font-bold text-foreground/60 transition hover:bg-foreground/10 hover:text-foreground ${collapsed ? 'h-11 w-11' : 'flex-1'}`}
        >
          <Languages size={14} />
          {!collapsed && (lang === "en" ? "العربية" : "English")}
        </button>
      </div>
    </div>
  </div>
);

return (
  <>
      {/* ── DESKTOP SIDEBAR ── */}
    <motion.aside
      dir={isRTL ? "rtl" : "ltr"}
      className={`hidden md:flex fixed top-0 ${isRTL ? "right-0" : "left-0"
        } border-e z-50 h-screen flex-col bg-background border-foreground/10 dark:border-foreground/20 shadow-sm ${isCollapsed ? "p-4" : "p-5"}`}
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
          ? `right-0 border-e border-foreground/10 dark:border-foreground/20 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`
          : `left-0 border-e border-foreground/10 dark:border-foreground/20 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
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
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#febc5a] to-[#d97706] flex items-center justify-center overflow-hidden">
          <Image src="/logo-awn.png" alt="AWN" width={32} height={32} className="object-contain" />
        </div>
        <span className="font-black text-foreground text-sm">AWN</span>
      </div>
      <div className="flex items-center gap-1">
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
