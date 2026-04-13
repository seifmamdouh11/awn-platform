"use client";

import React from "react";
import Link from "next/link";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function CTASection() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = translations[lang];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground px-6 py-12 text-background shadow-sm sm:px-10 sm:py-16 lg:px-16"
        >
          {/* glow */}
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-background/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-background/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              viewport={{ once: true }}
              className="inline-flex rounded-full border border-background/15 bg-background/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-background/80"
            >
              {t.badge}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              viewport={{ once: true }}
              className="mt-5 text-3xl font-black uppercase leading-tight sm:text-4xl lg:text-5xl"
            >
              {t.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-background/75 sm:text-base"
            >
              {t.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/register/volunteer"
                  className="inline-flex min-w-[190px] items-center justify-center rounded-xl bg-background px-6 py-3 text-sm font-semibold text-foreground transition duration-300 hover:opacity-90"
                >
                  {t.joinVolunteer}
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/register/company"
                  className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-background/20 bg-transparent px-6 py-3 text-sm font-semibold text-background transition duration-300 hover:bg-background/10"
                >
                  {t.joinCompany}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const translations = {
  en: {
    badge: "Get Started",
    title: "Start making real impact today",
    description:
      "Join AWN and connect with meaningful opportunities, trusted organizations, and a community built to create change.",
    joinVolunteer: "Join as Volunteer",
    joinCompany: "Join as Company",
  },
  ar: {
    badge: "ابدأ الآن",
    title: "ابدأ في صناعة تأثير حقيقي اليوم",
    description:
      "انضم إلى عون وتواصل مع فرص هادفة، وجهات موثوقة، ومجتمع صُمم لصناعة التغيير.",
    joinVolunteer: "انضم كمتطوع",
    joinCompany: "انضم كشركة",
  },
} as const;