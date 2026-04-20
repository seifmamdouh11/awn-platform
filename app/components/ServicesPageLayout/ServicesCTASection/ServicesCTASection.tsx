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
      className="bg-background py-16 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#F5A623] to-[#d97706] px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20"
        >
          <div className="relative z-10 mx-auto max-w-2xl">
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl"
            >
              {t.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              viewport={{ once: true }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-900/80 sm:text-lg"
            >
              {t.desc}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              viewport={{ once: true }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/"
                className="flex h-14 w-full items-center justify-center rounded-2xl bg-gray-900 px-8 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 sm:w-auto sm:text-base"
              >
                {t.btn1}
              </Link>

              <Link
                href="/register"
                className="flex text-foreground bg-background/50 h-14 w-full items-center justify-center rounded-2xl border-2 border-gray-900/20 px-8 text-sm font-bold transition-all hover:bg-background hover:scale-105 active:scale-95 sm:w-auto sm:text-base"
              >
                {t.btn2}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}