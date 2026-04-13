"use client";

import React from "react";
import Link from "next/link";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import { motion } from "framer-motion";

export default function Footer() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = translations[lang];

  const socialLinks = [
    {
      id: 1,
      name: "Facebook",
      href: "https://facebook.com/",
      icon: <FaFacebookF />,
    },
    {
      id: 2,
      name: "WhatsApp",
      href: "https://wa.me/201000000000",
      icon: <FaWhatsapp />,
    },
    {
      id: 3,
      name: "LinkedIn",
      href: "https://linkedin.com/",
      icon: <FaLinkedinIn />,
    },
    {
      id: 4,
      name: "Instagram",
      href: "https://instagram.com/",
      icon: <FaInstagram />,
    },
  ];

  return (
    <footer
      dir={isArabic ? "rtl" : "ltr"}
      className="mt-20 border-t border-foreground/10 bg-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-black tracking-wide">AWN</h2>
            <p className="max-w-sm text-sm leading-7 text-foreground/60">
              {t.description}
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {t.linksTitle}
            </h3>

            <ul className="space-y-3 text-sm text-foreground/70">
              {[
                { href: "/", label: t.home },
                { href: "/about", label: t.about },
                { href: "/services", label: t.services },
                { href: "/contact", label: t.contact },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: isArabic ? -4 : 4 }}
                  transition={{ duration: 0.18 }}
                >
                  <Link
                    href={item.href}
                    className="transition-all duration-300 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {t.followTitle}
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/10 bg-background text-foreground/70 transition hover:border-foreground/20 hover:text-foreground hover:shadow-sm"
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10 border-t border-foreground/10 pt-6 text-center text-sm text-foreground/50"
        >
          © {new Date().getFullYear()} AWN. {t.rights}
        </motion.div>
      </motion.div>
    </footer>
  );
}

const translations = {
  en: {
    description:
      "Connecting volunteers with meaningful opportunities and helping organizations create real impact.",
    linksTitle: "Quick Links",
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact",
    followTitle: "Follow Us",
    rights: "All rights reserved.",
  },
  ar: {
    description:
      "نربط المتطوعين بالفرص الهادفة ونساعد المؤسسات على صناعة تأثير حقيقي.",
    linksTitle: "روابط سريعة",
    home: "الرئيسية",
    about: "من نحن",
    services: "الخدمات",
    contact: "تواصل معنا",
    followTitle: "تابعنا",
    rights: "جميع الحقوق محفوظة.",
  },
} as const;