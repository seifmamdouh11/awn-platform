"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function AudienceServicesSection() {
  const { lang } = useLang();

  const content = {
    en: {
      badge: "Built for Everyone",
      title: "Designed for Volunteers and Organizations",
      volunteerTitle: "For Volunteers",
      organizationTitle: "For Organizations",
      volunteers: [
        "Explore opportunities that match your interests.",
        "Apply Smoothly through a simple experience.",
        "Build practical experience through real participation.",
        "Track opportunities and stay organized.",
      ],
      organizations: [
        "Post opportunities in a clear and professional way.",
        "Reach volunteers more efficiently.",
        "Manage applicants and opportunity details in one place.",
        "Organize communication and coordination better.",
      ],
    },
    ar: {
      badge: "مصممة للجميع",
      title: "مصممة للمتطوعين والجهات",
      volunteerTitle: "للمتطوعين",
      organizationTitle: "للجهات",
      volunteers: [
        "استكشف الفرص التي تناسب اهتماماتك بسهولة.",
        "قدّم على الفرص من خلال تجربة بسيطة وواضحة.",
        "اكتسب خبرة عملية من خلال مشاركة حقيقية.",
        "تابع الفرص وكن أكثر تنظيمًا.",
      ],
      organizations: [
        "اعرض الفرص بشكل واضح واحترافي.",
        "الوصول إلى المتطوعين بكفاءة أكبر.",
        "إدارة المتقدمين وتفاصيل الفرص في مكان واحد.",
        "تنظيم التواصل والتنسيق بصورة أفضل.",
      ],
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
          {/* Volunteers Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8"
          >
            <h3 className="mb-5 text-2xl font-bold">{t.volunteerTitle}</h3>

            <motion.div
              className="space-y-4"
              variants={listContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {t.volunteers.map((item, index) => (
                <motion.div
                  key={index}
                  variants={listItemVariants}
                  className="flex items-start gap-3"
                >
                  <motion.span
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 text-primary"
                  >
                    <FaCheckCircle />
                  </motion.span>
                  <p className="text-sm leading-7 text-foreground/70 sm:text-base">
                    {item}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Organizations Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8"
          >
            <h3 className="mb-5 text-2xl font-bold">{t.organizationTitle}</h3>

            <motion.div
              className="space-y-4"
              variants={listContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {t.organizations.map((item, index) => (
                <motion.div
                  key={index}
                  variants={listItemVariants}
                  className="flex items-start gap-3"
                >
                  <motion.span
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 text-primary"
                  >
                    <FaCheckCircle />
                  </motion.span>
                  <p className="text-sm leading-7 text-foreground/70 sm:text-base">
                    {item}
                  </p>
                </motion.div>
              ))}
            </motion.div>
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

const listContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const listItemVariants = {
  hidden: {
    opacity: 0,
    x: 18,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};