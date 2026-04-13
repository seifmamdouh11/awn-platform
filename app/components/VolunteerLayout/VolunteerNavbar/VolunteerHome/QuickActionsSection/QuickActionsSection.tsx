"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRightLong,
  FaBriefcase,
  FaClipboardList,
  FaUserPen,
} from "react-icons/fa6";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

type LangType = "en" | "ar";

type ActionItem = {
  id: number;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function QuickActionsSection() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = translations[lang as LangType] || translations.en;

  const actions: ActionItem[] = [
    {
      id: 1,
      title: t.browseTitle,
      description: t.browseDesc,
      href: "/volunteer/opportunities",
      icon: <FaBriefcase />,
    },
    {
      id: 2,
      title: t.applicationsTitle,
      description: t.applicationsDesc,
      href: "/volunteer/applications",
      icon: <FaClipboardList />,
    },
    {
      id: 3,
      title: t.profileTitle,
      description: t.profileDesc,
      href: "/volunteer/profile",
      icon: <FaUserPen />,
    },
  ];

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/45">
            {t.eyebrow}
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {t.title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">
            {t.subtitle}
          </p>
        </div>
      </div>

      <motion.div
        className="grid gap-5 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {actions.map((item) => (
          <motion.div key={item.id} variants={cardVariants}>
            <Link
              href={item.href}
              className="group relative block overflow-hidden rounded-[30px] border border-foreground/10 bg-background/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-sky-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-all duration-300 group-hover:scale-125" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-14 w-14 place-content-center rounded-2xl border border-white/15 bg-white/10 text-lg text-foreground shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]">
                    {item.icon}
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/50 backdrop-blur">
                    {t.quick}
                  </div>
                </div>

                <div className="mt-5">
                  <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-foreground/65">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-5">
                  <span className="text-sm font-semibold text-foreground/80">
                    {t.openNow}
                  </span>

                  <div className="grid h-10 w-10 place-content-center rounded-full border border-foreground/10 bg-background/80 text-foreground/70 transition-all group-hover:bg-primary group-hover:text-foreground group-hover:shadow-md">
                    <FaArrowRightLong
                      className={`text-sm transition-transform duration-300 ${
                        isArabic
                          ? "rotate-180 group-hover:-translate-x-0.5"
                          : "group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

const translations = {
  en: {
    eyebrow: "Quick Actions",
    title: "Move faster",
    subtitle:
      "Jump directly to the most important areas and keep your volunteer journey smooth and organized.",
    quick: "Shortcut",
    openNow: "Open now",
    browseTitle: "Browse Opportunities",
    browseDesc:
      "Explore active volunteer opportunities and discover the roles that fit you best.",
    applicationsTitle: "My Applications",
    applicationsDesc:
      "Review your latest applications and keep track of every status update.",
    profileTitle: "Edit Profile",
    profileDesc:
      "Update your personal information and keep your volunteer profile polished.",
  },
  ar: {
    eyebrow: "إجراءات سريعة",
    title: "تحرك بشكل أسرع",
    subtitle:
      "انتقل مباشرة إلى أهم الأقسام وحافظ على رحلة تطوعك بشكل منظم وسلس.",
    quick: "اختصار",
    openNow: "افتح الآن",
    browseTitle: "تصفح الفرص",
    browseDesc: "استكشف الفرص التطوعية النشطة واكتشف الأدوار المناسبة لك.",
    applicationsTitle: "طلباتي",
    applicationsDesc:
      "راجع آخر الطلبات التي قدمتها وتابع كل تحديث في حالتها.",
    profileTitle: "تعديل الملف الشخصي",
    profileDesc:
      "حدّث بياناتك الشخصية وحافظ على ملفك التطوعي بشكل احترافي.",
  },
} satisfies Record<LangType, Record<string, string>>;