"use client";

import React from "react";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { usePathname } from "next/navigation";
import {
  FaChartLine,
  FaGear,
  FaHouse,
  FaUsers,
  FaBriefcase,
} from "react-icons/fa6";

import { companyTopBarTranslations } from "@/app/translations/companyTopBar";
import ThemeToggle from "../../ThemeToggle/ThemeToggle";
import { motion } from "framer-motion";

export default function CompanyTopBar() {
  const { lang } = useLang();
  const pathname = usePathname();

  const t = companyTopBarTranslations[lang];

  const getPageData = () => {
    if (pathname.startsWith("/company/opportunities")) {
      return { ...t.opportunities, icon: <FaBriefcase /> };
    }
    if (pathname.startsWith("/company/applicants")) {
      return { ...t.applicants, icon: <FaUsers /> };
    }
    if (pathname.startsWith("/company/analytics")) {
      return { ...t.analytics, icon: <FaChartLine /> };
    }
    if (pathname.startsWith("/company/settings")) {
      return { ...t.settings, icon: <FaGear /> };
    }

    return { ...t.dashboard, icon: <FaHouse /> };
  };

  const pageData = getPageData();

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="sticky top-0 z-40 border-b border-foreground/10 bg-background/80 backdrop-blur-md"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="px-4 py-4 sm:px-6 lg:px-8">

        <motion.div
          className="flex min-h-[80px] items-center justify-between rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground to-foreground/90 px-5 py-4 text-background shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >

          {/* left */}
          <div className="flex items-center gap-4">

            {/* icon */}
            <motion.div
              className="grid h-11 w-11 place-content-center rounded-xl bg-background/10 ring-1 ring-background/20"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.08 }}
            >
              {React.cloneElement(pageData.icon, {
                className: "h-5 w-5",
              })}
            </motion.div>

            {/* text */}
            <div>
              <motion.h2
                className="text-xl font-bold uppercase tracking-wide sm:text-2xl sm:tracking-[2px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                {pageData.title}
              </motion.h2>

              <motion.p
                className="mt-1 text-xs text-background/70 sm:text-sm max-w-[500px]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {pageData.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <ThemeToggle />
          </motion.div>

          {/* right badge */}
          <div className="hidden md:flex">
            <motion.span
              className="rounded-full border border-background/20 bg-background/10 px-3 py-1 text-xs font-medium text-background/80"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              {t.badge}
            </motion.span>
          </div>

        </motion.div>

      </div>
    </motion.div>
  );
}