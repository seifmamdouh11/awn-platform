"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import { motion } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

type LangType = "en" | "ar";

export default function VolunteerFooter() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = translations[lang as LangType] || translations.en;
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { id: 1, href: "#", icon: <FaFacebookF /> },
    { id: 2, href: "#", icon: <FaInstagram /> },
    { id: 3, href: "#", icon: <FaLinkedinIn /> },
    { id: 4, href: "#", icon: <FaWhatsapp /> },
  ];

  return (
    <motion.footer
      dir={isArabic ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="mt-16 border-t border-foreground/10 bg-background"
    >
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-12">
        <div className="grid gap-10 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.3 }}
          >
            <h3 className="text-2xl font-black text-foreground">AWN</h3>

            <p className="mt-3 max-w-xs text-sm leading-6 text-foreground/65">
              {t.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.3 }}
          >
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/50">
              {t.quickLinks}
            </h4>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <motion.div whileHover={{ x: isArabic ? -4 : 4 }}>
                <Link
                  href="/volunteer/opportunities"
                  className="transition hover:text-primary"
                >
                  {t.opportunities}
                </Link>
              </motion.div>

              <motion.div whileHover={{ x: isArabic ? -4 : 4 }}>
                <Link
                  href="/volunteer/applications"
                  className="transition hover:text-primary"
                >
                  {t.applications}
                </Link>
              </motion.div>

              <motion.div whileHover={{ x: isArabic ? -4 : 4 }}>
                <Link
                  href="/volunteer/profile"
                  className="transition hover:text-primary"
                >
                  {t.profile}
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.3 }}
          >
            <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-foreground/50">
              {t.followUs}
            </h4>

            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.22 + index * 0.05, duration: 0.25 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="grid h-10 w-10 place-content-center rounded-full border border-foreground/10 bg-background text-foreground/70 transition hover:bg-primary hover:text-foreground"
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.26, duration: 0.3 }}
          className="mt-10 flex flex-col gap-4 border-t border-foreground/10 pt-6 text-sm text-foreground/55 md:flex-row md:items-center md:justify-between"
        >
          <p>
            © {currentYear} AWN. {t.rights}
          </p>

          <div className="flex items-center gap-5">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/privacy" className="hover:text-primary">
                {t.privacy}
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }}>
              <Link href="/terms" className="hover:text-primary">
                {t.terms}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

const translations = {
  en: {
    description:
      "Connecting volunteers with meaningful opportunities and building stronger communities.",
    quickLinks: "Quick Links",
    opportunities: "Opportunities",
    applications: "Applications",
    profile: "Profile",
    followUs: "Follow Us",
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
  },

  ar: {
    description: "ربط المتطوعين بالفرص التطوعية وبناء مجتمعات أقوى.",
    quickLinks: "روابط سريعة",
    opportunities: "الفرص",
    applications: "الطلبات",
    profile: "الملف الشخصي",
    followUs: "تابعنا",
    rights: "جميع الحقوق محفوظة.",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
  },
} satisfies Record<LangType, Record<string, string>>;