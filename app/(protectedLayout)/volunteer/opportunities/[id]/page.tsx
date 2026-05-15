"use client";

import api, { isAxiosError } from "@/app/utils/api";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import {
  FaArrowLeft,
  FaClock,
  FaLocationDot,
  FaUsers
} from "react-icons/fa6";
import volunteerOpportunityDetailsTranslations from "@/app/translations/volunteerOpportunityDetailsTranslations";
import { FaCalendarAlt, FaStar } from "react-icons/fa";
import { useLoggedInData } from "@/app/Context/LoggedInDataContext";
import Swal from "sweetalert2";

type Opportunity = {
  id: number;
  company_id: number;
  title: string;
  title_ar?: string | null;
  title_en?: string | null;
  category_id: number;
  description: string;
  description_ar?: string | null;
  description_en?: string | null;
  address: string;
  capacity: number;
  event_type: "volunteer" | "paid";
  status: "open" | "closed" | "draft" | "completed" | "cancelled";
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
  company_verified?: boolean | number;
  company_rating?: number;
  reward?: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function VolunteerOpportunityDetailsPage() {
  const { lang } = useLang();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data } = useLoggedInData();
  const token = localStorage.getItem("token");
  const t = volunteerOpportunityDetailsTranslations[lang];
  const isArabic = lang === "ar";

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = Number(params.id);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/events?id=${id}`
        );

        const responseData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (!responseData) {
          setOpportunity(null);
          setError(t.errors.notFound);
          return;
        }

        setOpportunity(responseData);
      } catch (err) {
        console.error(err);
        setError(t.errors.loadError);
      } finally {
        setLoading(false);
      }
    };

    if (!id || isNaN(id) || id <= 0) {
      setError(t.errors.invalidId);
      setLoading(false);
      return;
    }

    fetchOpportunity();
  }, [id, t]);

  const userApply = async () => {
    try {
      await api.post(`/volunteer-applications`, {
        event_id: id,
      });

      Swal.fire({
        icon: "success",
        title: t.applicationSuccess,
        confirmButtonText: t.ok,
      });

      router.push("/volunteer/applications");
    } catch (error) {
      if (isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error || error.message;

        if (statusCode === 409) {
          Swal.fire({
            icon: "warning",
            title: t.alreadyApplied,
            text: t.alreadyAppliedText,
            confirmButtonText: t.ok,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: t.applicationError,
            text: errorMessage,
            confirmButtonText: t.ok,
          });
        }

        console.error("Failed to apply for opportunity:", errorMessage);
      }
      else if (error instanceof Error) {
        console.error("Failed to apply for opportunity:", error.message);
      }
      else {
        console.error("An unexpected error occurred:", error);
      }
    }
  }
  const displayTitle = useMemo(() => {
    if (!opportunity) return "";

    return isArabic
      ? opportunity.title_ar || opportunity.title
      : opportunity.title_en || opportunity.title;
  }, [opportunity, isArabic]);

  const displayDescription = useMemo(() => {
    if (!opportunity) return "";

    return isArabic
      ? opportunity.description_ar || opportunity.description
      : opportunity.description_en || opportunity.description;
  }, [opportunity, isArabic]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString(isArabic ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const statusClassMap: Record<Opportunity["status"], string> = {
    open: "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
    closed: "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
    draft:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    completed:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    cancelled:
      "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-6 w-44 rounded-full bg-foreground/10" />

          <div className="rounded-[2rem] border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <div className="mb-5 flex gap-3">
              <div className="h-8 w-24 rounded-full bg-foreground/10" />
              <div className="h-8 w-24 rounded-full bg-foreground/10" />
            </div>

            <div className="mb-4 h-10 w-2/3 rounded-2xl bg-foreground/10" />
            <div className="mb-3 h-5 w-full rounded-xl bg-foreground/10" />
            <div className="mb-3 h-5 w-5/6 rounded-xl bg-foreground/10" />
            <div className="h-5 w-2/3 rounded-xl bg-foreground/10" />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                >
                  <div className="mb-3 h-4 w-24 rounded-lg bg-foreground/10" />
                  <div className="h-5 w-28 rounded-lg bg-foreground/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-6">
              <div className="h-60 rounded-[2rem] border border-foreground/10 bg-foreground/5" />
              <div className="h-64 rounded-[2rem] border border-foreground/10 bg-foreground/5" />
            </div>
            <div className="h-96 rounded-[2rem] border border-foreground/10 bg-foreground/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl rounded-[2rem] border border-red-500/20 bg-red-500/5 p-8 text-center shadow-sm"
        >
          <h2 className="mb-3 text-2xl font-semibold">{t.errors.notFound}</h2>

          <p className="mb-6 text-sm text-foreground/70">
            {error || t.errors.notFound}
          </p>

          <button
            onClick={() => router.replace("/volunteer/opportunities")}
            className="inline-flex items-center justify-center rounded-2xl border border-foreground/15 px-5 py-3 text-sm font-medium transition hover:bg-foreground hover:text-background"
          >
            {t.back}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.button
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          onClick={() => router.replace("/volunteer/opportunities")}
          className="inline-flex items-center gap-2 text-sm text-foreground/70 transition hover:text-foreground"
        >
          <FaArrowLeft className={isArabic ? "rotate-180" : ""} />
          <span>{t.back}</span>
        </motion.button>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-background/80 shadow-sm backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.04),transparent_24%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.02]" />

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${statusClassMap[opportunity.status]}`}
              >
                {t.statusLabels[opportunity.status]}
              </span>

              <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-sm font-semibold text-foreground/80">
                {t.typeLabels[opportunity.event_type]}
              </span>
            </div>

            <h1 className="mb-4 max-w-4xl text-3xl font-bold tracking-tight md:text-5xl">
              {displayTitle}
            </h1>

            {opportunity.company_name && (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-lg font-semibold text-foreground/80">
                  {opportunity.company_name}
                </span>
                {!!opportunity.company_verified && (
                  <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold tracking-wide text-blue-600 dark:text-blue-400 border border-blue-500/20" title={isArabic ? "شركة موثّقة" : "Verified Company"}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.3 14.29L7.7 12.3a.996.996 0 111.41-1.41l1.59 1.59 4.29-4.3a.996.996 0 111.41 1.42l-5 5a.996.996 0 01-1.41 0l-.29-.31z"/>
                    </svg>
                    {isArabic ? "موثّقة" : "Verified"}
                  </span>
                )}
                {opportunity.company_rating ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-bold tracking-wide text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                    {opportunity.company_rating} <FaStar size={14} className="mb-0.5" />
                  </span>
                ) : (
                  <span className="text-xs text-foreground/50">
                    ({isArabic ? "لا توجد تقييمات" : "No ratings yet"})
                  </span>
                )}
              </div>
            )}

            <p className="mb-8 max-w-3xl text-base leading-8 text-foreground/75 md:text-lg">
              {displayDescription}
            </p>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              <motion.div
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-foreground/10 bg-background/70 p-4 transition"
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                  <FaLocationDot />
                  <span>{t.location}</span>
                </div>
                <p className="font-semibold">{opportunity.address}</p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-foreground/10 bg-background/70 p-4 transition"
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                  <FaCalendarAlt />
                  <span>{t.eventDate}</span>
                </div>
                <p className="font-semibold">
                  {formatDate(opportunity.start_time)}
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-foreground/10 bg-background/70 p-4 transition"
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                  <FaClock />
                  <span>{t.time}</span>
                </div>
                <p className="font-semibold">
                  {formatTime(opportunity.start_time)} -{" "}
                  {formatTime(opportunity.end_time)}
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-foreground/10 bg-background/70 p-4 transition"
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                  <FaUsers />
                  <span>{t.capacity}</span>
                </div>
                <p className="font-semibold">{opportunity.capacity}</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          <motion.div
            className="space-y-6"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-[2rem] border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm md:p-8"
            >
              <h2 className="mb-4 text-xl font-semibold md:text-2xl">
                {t.about}
              </h2>

              <p className="text-base leading-8 text-foreground/75">
                {displayDescription}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-[2rem] border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm md:p-8"
            >
              <h2 className="mb-6 text-xl font-semibold md:text-2xl">
                {t.details}
              </h2>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                >
                  <p className="mb-1 text-sm text-foreground/60">{t.status}</p>
                  <p className="font-semibold">
                    {t.statusLabels[opportunity.status]}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                >
                  <p className="mb-1 text-sm text-foreground/60">{t.type}</p>
                  <p className="font-semibold">
                    {t.typeLabels[opportunity.event_type]}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                >
                  <p className="mb-1 text-sm text-foreground/60">
                    {t.capacity}
                  </p>
                  <p className="font-semibold">{opportunity.capacity}</p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                >
                  <p className="mb-1 text-sm text-foreground/60">
                    {t.address}
                  </p>
                  <p className="font-semibold">{opportunity.address}</p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                >
                  <p className="mb-1 text-sm text-foreground/60">
                    {t.startDate}
                  </p>
                  <p className="font-semibold">
                    {formatDate(opportunity.start_time)}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                >
                  <p className="mb-1 text-sm text-foreground/60">
                    {t.endDate}
                  </p>
                  <p className="font-semibold">
                    {formatDate(opportunity.end_time)}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.aside
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="h-fit rounded-[2rem] border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm lg:sticky lg:top-24 md:p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold md:text-2xl">{t.summary}</h2>
              <p className="mt-2 text-sm text-foreground/60">
                {isArabic
                  ? "نظرة سريعة على أهم تفاصيل الفرصة."
                  : "A quick look at the most important opportunity details."}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
                <span className="text-sm text-foreground/60">{t.status}</span>
                <span className="font-semibold">
                  {t.statusLabels[opportunity.status]}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
                <span className="text-sm text-foreground/60">{t.type}</span>
                <span className="font-semibold">
                  {t.typeLabels[opportunity.event_type]}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
                <span className="text-sm text-foreground/60">
                  {t.startDate}
                </span>
                <span className="text-right font-semibold">
                  {formatDate(opportunity.start_time)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
                <span className="text-sm text-foreground/60">{t.endDate}</span>
                <span className="text-right font-semibold">
                  {formatDate(opportunity.end_time)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
                <span className="text-sm text-foreground/60">{t.time}</span>
                <span className="text-right font-semibold">
                  {formatTime(opportunity.start_time)} -{" "}
                  {formatTime(opportunity.end_time)}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 border-b border-foreground/10 pb-4">
                <span className="text-sm text-foreground/60">
                  {t.location}
                </span>
                <span className="text-right font-semibold">
                  {opportunity.address}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-foreground/60">
                  {t.capacity}
                </span>
                <span className="font-semibold">{opportunity.capacity}</span>
              </div>
            </div>

            {opportunity.event_type === "paid" && opportunity.reward !== undefined && (
              <div className="mt-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white">
                    <FaStar size={14} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    {isArabic ? "مكافأة مالية" : "Financial Reward"}
                  </h3>
                </div>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {Number(opportunity.reward).toLocaleString()} <span className="text-sm font-bold opacity-60">EGP</span>
                </p>
                <p className="text-[10px] mt-1 text-emerald-600/70 font-medium">
                  {isArabic ? "صافي الربح بعد عمولة المنصة." : "Net reward after platform commission."}
                </p>
              </div>
            )}

            <motion.button
              whileHover={opportunity.status === "open" ? { scale: 1.015 } : {}}
              whileTap={opportunity.status === "open" ? { scale: 0.985 } : {}}
              disabled={opportunity.status !== "open"}
              className={`mt-8 w-full rounded-2xl px-5 py-3.5 text-sm font-semibold transition ${opportunity.status === "open"
                ? "bg-[#febc5a] text-black hover:brightness-110 shadow-sm"
                : "cursor-not-allowed bg-foreground/10 text-foreground/40"
                }`}
              onClick={userApply}
            >
              {opportunity.status === "open"
                ? t.applyNow
                : t.applicationsClosed}
            </motion.button>
          </motion.aside>
        </section>
      </div>
    </div>
  );
}