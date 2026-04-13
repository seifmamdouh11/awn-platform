"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/app/utils/api";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowRightLong,
  FaCalendarDays,
  FaLocationDot,
  FaUsers,
} from "react-icons/fa6";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

type LangType = "en" | "ar";

type EventItem = {
  id: number;
  title: string;
  description?: string | null;
  address?: string | null;
  capacity?: number | null;
  event_type?: "volunteer" | "paid" | string | null;
  status?: "draft" | "open" | "closed" | "completed" | "cancelled" | string;
  start_time?: string | null;
  end_time?: string | null;
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

export default function ActiveOpportunitiesSection() {
  const { lang } = useLang();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[lang as LangType] || translations.en;

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/events?lang=${lang}`);

        const openEvents = (res.data || [])
          .filter((event: EventItem) => event.status === "open")
          .slice(0, 3);

        setEvents(openEvents);
      } catch (error) {
        console.log("GET ACTIVE OPPORTUNITIES ERROR:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [lang]);

  const hasEvents = useMemo(() => events.length > 0, [events]);

  const formatDate = (date?: string | null) => {
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
          href="/volunteer/opportunities"
          className="inline-flex items-center gap-2 self-start rounded-full border border-foreground/10 bg-background px-5 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
        >
          {t.viewAll}
          <FaArrowRightLong className={lang === "ar" ? "rotate-180" : ""} />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[28px] border border-foreground/10 bg-background p-5 shadow-sm"
            >
              <div className="h-5 w-28 animate-pulse rounded-full bg-foreground/10" />
              <div className="mt-4 h-7 w-3/4 animate-pulse rounded-xl bg-foreground/10" />
              <div className="mt-3 h-4 w-full animate-pulse rounded-lg bg-foreground/10" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded-lg bg-foreground/10" />

              <div className="mt-6 space-y-3">
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-foreground/10" />
                <div className="h-4 w-2/3 animate-pulse rounded-lg bg-foreground/10" />
                <div className="h-4 w-1/3 animate-pulse rounded-lg bg-foreground/10" />
              </div>

              <div className="mt-6 h-11 w-full animate-pulse rounded-full bg-foreground/10" />
            </div>
          ))}
        </div>
      ) : hasEvents ? (
        <motion.div
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {events.map((event) => (
            <motion.article
              key={event.id}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-[30px] border border-foreground/10 bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-sky-500/5 opacity-0 transition group-hover:opacity-100" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-foreground/80">
                    {event.event_type || t.notSpecified}
                  </span>

                  <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {t.open}
                  </span>
                </div>

                <h3 className="mt-5 line-clamp-2 text-xl font-bold leading-8 text-foreground">
                  {event.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/65">
                  {event.description || t.noDescription}
                </p>

                <div className="mt-5 space-y-3 border-t border-foreground/10 pt-5">
                  <div className="flex items-center gap-2 text-sm text-foreground/75">
                    <FaLocationDot className="text-foreground/50" />
                    <span className="line-clamp-1">
                      {event.address || t.notSpecified}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground/75">
                    <FaCalendarDays className="text-foreground/50" />
                    <span>{formatDate(event.start_time)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground/75">
                    <FaUsers className="text-foreground/50" />
                    <span>
                      {t.capacity}: {event.capacity ?? t.notSpecified}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/volunteer/opportunities/${event.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-foreground transition hover:shadow-md"
                  >
                    {t.exploreNow}
                    <FaArrowRightLong
                      className={`${lang === "ar" ? "rotate-180" : ""}`}
                    />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
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
            {t.viewAll}
            <FaArrowRightLong className={lang === "ar" ? "rotate-180" : ""} />
          </Link>
        </div>
      )}
    </section>
  );
}

const translations = {
  en: {
    eyebrow: "Active Opportunities",
    title: "Discover open opportunities",
    subtitle:
      "Explore currently open volunteer opportunities and find the right place to start making an impact.",
    viewAll: "View All Opportunities",
    exploreNow: "Explore Now",
    open: "Open",
    capacity: "Capacity",
    notSpecified: "Not specified",
    noDescription: "No description available for this opportunity yet.",
    emptyTitle: "No open opportunities right now",
    emptySubtitle:
      "There are currently no active opportunities available. Check again later or browse all opportunities.",
  },
  ar: {
    eyebrow: "الفرص النشطة",
    title: "اكتشف الفرص المفتوحة",
    subtitle:
      "تصفح الفرص التطوعية المفتوحة حاليًا واختر المكان المناسب لتبدأ فيه صناعة أثر حقيقي.",
    viewAll: "عرض كل الفرص",
    exploreNow: "استكشف الآن",
    open: "مفتوح",
    capacity: "السعة",
    notSpecified: "غير محدد",
    noDescription: "لا يوجد وصف متاح لهذه الفرصة حاليًا.",
    emptyTitle: "لا توجد فرص مفتوحة الآن",
    emptySubtitle:
      "لا توجد فرص نشطة متاحة حاليًا. حاول لاحقًا أو تصفح كل الفرص المتوفرة.",
  },
} satisfies Record<LangType, Record<string, string>>;