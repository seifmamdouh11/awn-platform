"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/app/utils/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRightLong,
  FaCalendarDays,
  FaLocationDot,
} from "react-icons/fa6";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

type LangType = "en" | "ar";

type ApplicationItem = {
  id: number;
  volunteer_id: number;
  event_id: number;
  application_date?: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn" | "attended" | string;
  title?: string;
  description?: string;
  address?: string;
  capacity?: number;
  event_type?: string;
  start_time?: string;
  end_time?: string;
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
export default function RecentApplicationsSection() {
  const { lang } = useLang();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[lang as LangType] || translations.en;

  useEffect(() => {
    const getApplications = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setApplications([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await api.get(
          `/volunteer-applications/me?lang=${lang}`
        );

        const filteredApplications = (res.data || []).filter(
          (app: ApplicationItem) => app.status !== "attended"
        );

        setApplications(filteredApplications);
      } catch (error) {
        console.log("GET RECENT APPLICATIONS ERROR:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [lang]);

  const hasApplications = useMemo(
    () => applications.length > 0,
    [applications]
  );

  const formatDate = (date?: string) => {
    if (!date) return t.notSpecified;

    try {
      return new Date(date).toLocaleDateString(
        lang === "ar" ? "ar-EG" : "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return t.notSpecified;
    }
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "pending":
        return {
          label: t.pending,
          className:
            "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
      case "accepted":
        return {
          label: t.accepted,
          className:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
      case "rejected":
        return {
          label: t.rejected,
          className:
            "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
        };
      case "withdrawn":
        return {
          label: t.withdrawn,
          className:
            "border-foreground/10 bg-foreground/[0.06] text-foreground/70",
        };
      case "attended":
        return {
          label: t.attended,
          className:
            "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
        };
      default:
        return {
          label: t.unknown,
          className:
            "border-foreground/10 bg-foreground/[0.06] text-foreground/70",
        };
    }
  };

  return (
    <section dir={lang === "ar" ? "rtl" : "ltr"} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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

        <Link
          href="/volunteer/applications"
          className="inline-flex items-center gap-2 self-start rounded-full border border-foreground/10 bg-background px-5 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
        >
          {t.viewAll}
          <FaArrowRightLong className={lang === "ar" ? "rotate-180" : ""} />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-foreground/10 bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="h-5 w-24 animate-pulse rounded-full bg-foreground/10" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-foreground/10" />
              </div>

              <div className="mt-4 h-6 w-3/4 animate-pulse rounded-xl bg-foreground/10" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-lg bg-foreground/10" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded-lg bg-foreground/10" />

              <div className="mt-5 space-y-3 border-t border-foreground/10 pt-5">
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-foreground/10" />
                <div className="h-4 w-1/3 animate-pulse rounded-lg bg-foreground/10" />
              </div>
            </div>
          ))}
        </div>
      ) : hasApplications ? (
        <motion.div
          className="grid gap-5 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {applications.map((item) => {
            const status = getStatusStyles(item.status);

            return (
              <motion.article
                key={item.id}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-[28px] border border-foreground/10 bg-background p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-sky-500/5 opacity-0 transition group-hover:opacity-100" />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-foreground/80">
                      {item.event_type || t.notSpecified}
                    </span>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-8 text-foreground">
                    {item.title || t.untitled}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/65">
                    {item.description || t.noDescription}
                  </p>

                  <div className="mt-5 space-y-3 border-t border-foreground/10 pt-5">
                    <div className="flex items-center gap-2 text-sm text-foreground/75">
                      <FaLocationDot className="shrink-0 text-foreground/50" />
                      <span className="line-clamp-1">
                        {item.address || t.notSpecified}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-foreground/75">
                      <FaCalendarDays className="shrink-0 text-foreground/50" />
                      <span>
                        {t.appliedOn}: {formatDate(item.application_date)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/volunteer/applications"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-foreground transition hover:shadow-md"
                    >
                      {t.manageApplications}
                      <FaArrowRightLong
                        className={lang === "ar" ? "rotate-180" : ""}
                      />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      ) : (
        <div className="rounded-[28px] border border-foreground/10 bg-background px-6 py-10 text-center shadow-sm">
          <h3 className="text-xl font-bold text-foreground">{t.emptyTitle}</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-foreground/65">
            {t.emptySubtitle}
          </p>

          <Link
            href="/volunteer/opportunities"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-foreground transition hover:shadow-md"
          >
            {t.browseOpportunities}
            <FaArrowRightLong className={lang === "ar" ? "rotate-180" : ""} />
          </Link>
        </div>
      )}
    </section>
  );
}

const translations = {
  en: {
    eyebrow: "Recent Applications",
    title: "Keep track of your latest activity",
    subtitle:
      "Review your most recent applications and stay updated on their current status.",
    viewAll: "View All Applications",
    manageApplications: "Manage Applications",
    browseOpportunities: "Browse Opportunities",
    appliedOn: "Applied on",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    attended: "Attended",
    unknown: "Unknown",
    notSpecified: "Not specified",
    untitled: "Untitled opportunity",
    noDescription: "No description available for this application yet.",
    emptyTitle: "You haven’t applied yet",
    emptySubtitle:
      "Start exploring volunteer opportunities and submit your first application.",
  },
  ar: {
    eyebrow: "أحدث الطلبات",
    title: "تابع أحدث نشاطاتك",
    subtitle:
      "راجع آخر الطلبات التي قدمتها وابقَ على اطلاع بحالتها الحالية.",
    viewAll: "عرض كل الطلبات",
    manageApplications: "إدارة الطلبات",
    browseOpportunities: "تصفح الفرص",
    appliedOn: "تاريخ التقديم",
    pending: "قيد المراجعة",
    accepted: "مقبول",
    rejected: "مرفوض",
    withdrawn: "تم السحب",
    attended: "تم الحضور",
    unknown: "غير معروف",
    notSpecified: "غير محدد",
    untitled: "فرصة بدون عنوان",
    noDescription: "لا يوجد وصف متاح لهذا الطلب حاليًا.",
    emptyTitle: "لم تقم بالتقديم بعد",
    emptySubtitle:
      "ابدأ بتصفح الفرص التطوعية وقدم أول طلب لك الآن.",
  },
} satisfies Record<LangType, Record<string, string>>;