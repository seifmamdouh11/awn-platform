"use client";

import React from "react";
import {
  FaCompass,
  FaClipboardCheck,
  FaUsers,
  FaUserTie,
  FaTasks,
  FaComments,
} from "react-icons/fa";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function ServicesGridSection() {
  const { lang } = useLang();

  const content = {
    en: {
      badge: "What We Offer",
      title: "Core Services Designed for Better Experience",
      items: [
        {
          icon: <FaCompass className="text-2xl" />,
          title: "Discover Opportunities",
          desc: "Browse available opportunities through a clear and organized experience.",
        },
        {
          icon: <FaClipboardCheck className="text-2xl" />,
          title: "Easy Applications",
          desc: "Apply to opportunities through a simple and smooth application process.",
        },
        {
          icon: <FaUsers className="text-2xl" />,
          title: "Volunteer Management",
          desc: "Help organizations reach and manage volunteers more effectively.",
        },
        {
          icon: <FaUserTie className="text-2xl" />,
          title: "Organization Profiles",
          desc: "Provide organizations with a professional presence to share their opportunities.",
        },
        {
          icon: <FaTasks className="text-2xl" />,
          title: "Opportunity Tracking",
          desc: "Keep track of applications, participation, and opportunity details in one place.",
        },
        {
          icon: <FaComments className="text-2xl" />,
          title: "Better Coordination",
          desc: "Support smoother communication and coordination between both sides.",
        },
      ],
    },
    ar: {
      badge: "ما الذي نقدمه",
      title: "خدمات أساسية لتجربة أفضل وأكثر تنظيمًا",
      items: [
        {
          icon: <FaCompass className="text-2xl" />,
          title: "اكتشاف الفرص",
          desc: "تصفح الفرص المتاحة من خلال تجربة واضحة ومنظمة.",
        },
        {
          icon: <FaClipboardCheck className="text-2xl" />,
          title: "تقديم سهل",
          desc: "قدّم على الفرص من خلال خطوات بسيطة وتجربة استخدام سلسة.",
        },
        {
          icon: <FaUsers className="text-2xl" />,
          title: "إدارة المتطوعين",
          desc: "تمكين الجهات من الوصول إلى المتطوعين وإدارتهم بشكل أكثر كفاءة.",
        },
        {
          icon: <FaUserTie className="text-2xl" />,
          title: "ملفات الجهات",
          desc: "منح الجهات واجهة احترافية لعرض فرصها وأنشطتها بشكل واضح.",
        },
        {
          icon: <FaTasks className="text-2xl" />,
          title: "متابعة الفرص",
          desc: "متابعة الطلبات والمشاركة وتفاصيل الفرص في مكان واحد.",
        },
        {
          icon: <FaComments className="text-2xl" />,
          title: "تنسيق أفضل",
          desc: "دعم تواصل وتنظيم أكثر سلاسة بين المتطوعين والجهات.",
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
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
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