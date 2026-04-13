"use client";

import React from "react";
import Link from "next/link";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function AboutHero() {
  const { lang } = useLang();

  const t = content[lang];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative overflow-hidden border-b border-foreground/10 bg-background py-14 sm:py-16 lg:py-24"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl sm:h-96 sm:w-96 lg:h-[500px] lg:w-[500px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="order-2 space-y-5 text-center lg:order-1 lg:text-left rtl:lg:text-right"
          >
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              viewport={{ once: true }}
              className="inline-block rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70 sm:px-4 sm:text-sm"
            >
              {t.badge}
            </motion.span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              viewport={{ once: true }}
              className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl"
            >
              {t.title1}
              <span className="mt-2 block text-primary">{t.title2}</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mx-auto max-w-xl text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7 lg:mx-0 lg:text-lg"
            >
              {t.desc}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-3 pt-2 sm:flex-row lg:items-start"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/contact"
                  className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-foreground/15 bg-background px-6 py-3 text-sm font-semibold text-foreground transition duration-300 hover:bg-foreground/5"
                >
                  {t.btn2}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background p-2 shadow-sm">
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.35 }}
                  src="/Images/about-hero.jpg"
                  alt="About Platform"
                  className="h-auto w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
const content = {
    en: {
      badge: "About Us",
      title1: "Connecting Volunteers With",
      title2: "Meaningful Opportunities",
      desc: "Our platform helps volunteers discover real opportunities while enabling organizations to connect with passionate individuals ready to make an impact in their communities.",
      btn1: "Explore Opportunities",
      btn2: "Contact Us",
    },

    ar: {
      badge: "من نحن",
      title1: "نربط المتطوعين",
      title2: "بفرص حقيقية ومؤثرة",
      desc: "منصتنا تساعد المتطوعين في اكتشاف فرص حقيقية، كما تُمكّن الجهات والمؤسسات من الوصول إلى أشخاص لديهم شغف لإحداث تأثير إيجابي في المجتمع.",
      btn1: "استكشف الفرص",
      btn2: "تواصل معنا",
    },
  };