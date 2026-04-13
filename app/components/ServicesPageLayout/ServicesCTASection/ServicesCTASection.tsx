"use client";

import React from "react";
import Link from "next/link";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function ServicesCTASection() {
  const { lang } = useLang();

  const content = {
    en: {
      title: "Ready to Get Started?",
      desc: "Join our platform today and discover opportunities that make a real difference.",
      btn1: "Explore Opportunities",
      btn2: "Join Now",
    },

    ar: {
      title: "هل أنت مستعد للبدء؟",
      desc: "انضم إلى منصتنا اليوم واكتشف فرصًا حقيقية تصنع تأثيرًا في المجتمع.",
      btn1: "استكشف الفرص",
      btn2: "انضم الآن",
    },
  };

  const t = content[lang];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-primary py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground sm:text-4xl"
          >
            {t.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            viewport={{ once: true }}
            className="mt-4 text-sm leading-7 text-foreground/90 sm:text-base"
          >
            {t.desc}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            viewport={{ once: true }}
            className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                className="rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
              >
                {t.btn1}
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/register"
                className="rounded-xl border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background"
              >
                {t.btn2}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}