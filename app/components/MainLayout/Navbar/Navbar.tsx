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
} from "lucide-react";

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
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl font-semibold text-sm text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all"
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="ms-7 mt-1 space-y-1"
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const t = lang === "ar" ? sidebarTranslations.ar : sidebarTranslations.en;
  const isRTL = lang === "ar";

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/" || pathname === "/home";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { href: "/home",     label: t.home,     icon: <Home size={20} /> },
    { href: "/about",    label: t.about,    icon: <Info size={20} /> },
    { href: "/services", label: t.services, icon: <Wrench size={20} /> },
    { href: "/contact",  label: t.contact,  icon: <Mail size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full" dir={isRTL ? "rtl" : "ltr"}>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 cursor-default">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[#febc5a] to-[#d97706] flex items-center justify-center shadow-lg shadow-[#febc5a]/20 overflow-hidden">
          <Image
            src="/logo-awn.png"
            alt="AWN"
            width={44}
            height={44}
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
            {t.tagline}
          </p>
          <p className="text-sm font-black text-foreground tracking-tight">
            AWN
          </p>
        </div>
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
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                active
                  ? "bg-[#febc5a] text-black shadow-md shadow-[#febc5a]/20"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        {/* Login accordion */}
        <AccordionSection icon={<LogIn size={20} />} label={t.login}>
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
        <AccordionSection icon={<UserPlus size={20} />} label={t.register}>
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
        <div className="flex items-center gap-2 px-2">
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
      </div>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <motion.aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`hidden md:flex fixed top-0 ${
          isRTL ? "right-0 border-s" : "left-0 border-e"
        } z-50 h-screen w-64 flex-col bg-background border-foreground/5 shadow-sm p-5`}
        initial={{ x: isRTL ? 80 : -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <SidebarContent />
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
        className={`fixed top-0 z-50 h-full w-72 bg-background shadow-2xl p-5 flex flex-col transition-transform duration-300 md:hidden ${
          isRTL
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