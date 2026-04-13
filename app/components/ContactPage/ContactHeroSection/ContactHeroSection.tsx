"use client";

import React from "react";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function ContactHeroSection() {
  const { lang } = useLang();

  const content = {
    en: {
      badge: "Contact Us",
      title: "Let’s Start A Conversation",
      desc: "Have a question, suggestion, or partnership idea? We’d love to hear from you and help you get in touch with the right team.",
    },
    ar: {
      badge: "تواصل معنا",
      title: "لنبدأ محادثة",
      desc: "هل لديك سؤال أو اقتراح أو فكرة شراكة؟ يسعدنا التواصل معك ومساعدتك في الوصول إلى الفريق المناسب.",
    },
  };

  const t = content[lang];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative overflow-hidden border-b border-foreground/10 bg-background py-14 sm:py-16 lg:py-24"
    >
      {/* Background blur */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl sm:h-96 sm:w-96 lg:h-[500px] lg:w-[500px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          viewport={{ once: true }}
          className="inline-block rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70 sm:px-4 sm:text-sm"
        >
          {t.badge}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
          viewport={{ once: true }}
          className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl"
        >
          {t.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-foreground/70 sm:text-base lg:text-lg"
        >
          {t.desc}
        </motion.p>
      </motion.div>
    </section>
  );
}