"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/app/utils/api";
import { motion, type Variants } from "framer-motion";
import {
  FaClipboardList,
  FaRegClock,
  FaCircleCheck,
  FaHandshakeAngle,
} from "react-icons/fa6";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

type LangType = "en" | "ar";

type ApplicationItem = {
  id: number;
  volunteer_id: number;
  event_id: number;
  application_date?: string;
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "withdrawn"
    | "attended"
    | string;
};

type StatCard = {
  id: number;
  title: string;
  value: number;
  icon: React.ReactNode;
  className: string;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
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

export default function VolunteerStatsSection() {
  const { lang } = useLang();
  const [applications, setApplications] =
    useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[lang as LangType] || translations.en;

  useEffect(() => {
    const getApplications = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/volunteer-applications/me?lang=${lang}`
        );

        setApplications(res.data || []);
      } catch (error) {
        console.log("GET VOLUNTEER STATS ERROR:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [lang]);

  const stats = useMemo<StatCard[]>((() => {
    const total = applications.length;

    const pending = applications.filter(
      (item) => item.status === "pending"
    ).length;

    const accepted = applications.filter(
      (item) => item.status === "accepted"
    ).length;

    const attended = applications.filter(
      (item) => item.status === "attended"
    ).length;

    return [
      {
        id: 1,
        title: t.totalApplications,
        value: total,
        icon: <FaClipboardList />,
        className:
          "border-primary/20 bg-primary/10 text-foreground",
      },
      {
        id: 2,
        title: t.pending,
        value: pending,
        icon: <FaRegClock />,
        className:
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
      {
        id: 3,
        title: t.accepted,
        value: accepted,
        icon: <FaCircleCheck />,
        className:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      },
      {
        id: 4,
        title: t.attended,
        value: attended,
        icon: <FaHandshakeAngle />,
        className:
          "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
      },
    ];
  }), [applications, t]);

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="space-y-6"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/50">
          {t.eyebrow}
        </p>

        <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
          {t.title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base">
          {t.subtitle}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-foreground/10 bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 animate-pulse rounded-full bg-foreground/10" />
                <div className="h-11 w-11 animate-pulse rounded-2xl bg-foreground/10" />
              </div>

              <div className="mt-6 h-10 w-16 animate-pulse rounded-xl bg-foreground/10" />
              <div className="mt-3 h-4 w-24 animate-pulse rounded-lg bg-foreground/10" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {stats.map((item) => (
            <motion.article
              key={item.id}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-[28px] border border-foreground/10 bg-background p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-sky-500/5 opacity-0 transition group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground/70">
                    {item.title}
                  </p>

                  <div
                    className={`grid h-11 w-11 place-content-center rounded-2xl border text-base ${item.className}`}
                  >
                    {item.icon}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-4xl font-black tracking-tight text-foreground">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm text-foreground/55">
                    {t.overview}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
}

const translations = {
  en: {
    eyebrow: "Your Stats",
    title: "A quick look at your activity",
    subtitle:
      "Track your application progress and stay updated with your volunteer journey at a glance.",
    totalApplications: "Total Applications",
    pending: "Pending",
    accepted: "Accepted",
    attended: "Attended",
    overview: "Overview",
  },

  ar: {
    eyebrow: "إحصائياتك",
    title: "نظرة سريعة على نشاطك",
    subtitle:
      "تابع تقدم طلباتك وابقَ على اطلاع برحلتك التطوعية من خلال نظرة سريعة وواضحة.",
    totalApplications: "إجمالي الطلبات",
    pending: "قيد المراجعة",
    accepted: "المقبولة",
    attended: "المنجزة",
    overview: "ملخص",
  },
} satisfies Record<LangType, Record<string, string>>;