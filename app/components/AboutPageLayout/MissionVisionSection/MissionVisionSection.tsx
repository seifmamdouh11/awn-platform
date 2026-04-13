"use client";

import React from "react";
import { FaBullseye, FaEye } from "react-icons/fa";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function MissionVisionSection() {
  const { lang } = useLang();

  const content = {
    en: {
      badge: "Our Purpose",
      title: "Mission & Vision",
      missionTitle: "Our Mission",
      missionText:
        "Our mission is to simplify the process of finding and managing volunteer opportunities by creating a platform that connects volunteers and organizations in one organized and accessible space.",
      visionTitle: "Our Vision",
      visionText:
        "Our vision is to build a connected community where volunteering becomes more accessible, meaningful, and impactful for both individuals and organizations.",
    },
    ar: {
      badge: "هدفنا",
      title: "المهمة والرؤية",
      missionTitle: "مهمتنا",
      missionText:
        "مهمتنا هي تسهيل عملية الوصول إلى فرص التطوع وإدارتها من خلال منصة تجمع المتطوعين والجهات في مكان واحد بشكل منظم وسهل الوصول.",
      visionTitle: "رؤيتنا",
      visionText:
        "رؤيتنا هي بناء مجتمع مترابط تصبح فيه فرص التطوع أكثر سهولة ووضوحًا وتأثيرًا، بما يحقق قيمة حقيقية للأفراد والجهات معًا.",
    },
  };

  const t = content[lang];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-foreground/[0.03] py-14 sm:py-16 lg:py-20"
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
          className="grid gap-6 md:grid-cols-2 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8"
          >
            <motion.div
              whileHover={{ rotate: 6, scale: 1.08 }}
              transition={{ duration: 0.2 }}
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <FaBullseye className="text-2xl" />
            </motion.div>

            <h3 className="mb-3 text-2xl font-bold">{t.missionTitle}</h3>

            <p className="text-sm leading-7 text-foreground/70 sm:text-base">
              {t.missionText}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8"
          >
            <motion.div
              whileHover={{ rotate: -6, scale: 1.08 }}
              transition={{ duration: 0.2 }}
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <FaEye className="text-2xl" />
            </motion.div>

            <h3 className="mb-3 text-2xl font-bold">{t.visionTitle}</h3>

            <p className="text-sm leading-7 text-foreground/70 sm:text-base">
              {t.visionText}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};