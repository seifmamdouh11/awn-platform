"use client";

import React from "react";
import {
  FaCompass,
  FaUsers,
  FaClipboardCheck,
  FaHeart,
} from "react-icons/fa";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function PlatformHighlightsSection() {
  const { lang } = useLang();

  const content = {
    en: {
      badge: "Why Choose Us",
      title: "Built to Make Volunteering Simpler",
      items: [
        {
          icon: <FaCompass className="text-2xl" />,
          title: "Easy Discovery",
          desc: "Find volunteer opportunities quickly through a clear and organized experience.",
        },
        {
          icon: <FaUsers className="text-2xl" />,
          title: "Trusted Connections",
          desc: "Connect volunteers with organizations in one reliable and accessible platform.",
        },
        {
          icon: <FaClipboardCheck className="text-2xl" />,
          title: "Clear Process",
          desc: "Browse, apply, and manage opportunities through a smoother workflow.",
        },
        {
          icon: <FaHeart className="text-2xl" />,
          title: "Real Impact",
          desc: "Encourage meaningful participation that creates value for communities.",
        },
      ],
    },
    ar: {
      badge: "لماذا نحن",
      title: "منصة تجعل التطوع أبسط وأسهل",
      items: [
        {
          icon: <FaCompass className="text-2xl" />,
          title: "اكتشاف سهل",
          desc: "اعثر على فرص التطوع بسرعة من خلال تجربة واضحة ومنظمة.",
        },
        {
          icon: <FaUsers className="text-2xl" />,
          title: "روابط موثوقة",
          desc: "نربط المتطوعين بالجهات المختلفة داخل منصة موثوقة وسهلة الوصول.",
        },
        {
          icon: <FaClipboardCheck className="text-2xl" />,
          title: "تجربة واضحة",
          desc: "تصفح الفرص وقدّم عليها وأدرها من خلال خطوات أبسط وأكثر تنظيمًا.",
        },
        {
          icon: <FaHeart className="text-2xl" />,
          title: "أثر حقيقي",
          desc: "نشجع على مشاركة فعالة تصنع قيمة حقيقية داخل المجتمع.",
        },
      ],
    },
  };

  const t = content[lang];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-background py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            viewport={{ once: true }}
            className="inline-block rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70 sm:px-4 sm:text-sm"
          >
            {t.badge}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            viewport={{ once: true }}
            className="mt-4 text-3xl font-bold leading-tight sm:text-4xl"
          >
            {t.title}
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {t.items.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm hover:shadow-md"
            >
              <motion.div
                whileHover={{ rotate: 6, scale: 1.08 }}
                transition={{ duration: 0.2 }}
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"
              >
                {item.icon}
              </motion.div>

              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>

              <p className="text-sm leading-7 text-foreground/70 sm:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};