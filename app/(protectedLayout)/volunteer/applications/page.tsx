"use client";

import api from "@/app/utils/api";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import Spinner from "@/app/components/Spinner/Spinner";
import {
  FaClock,
  FaLocationDot,
  FaClipboardCheck,
  FaUsers,
} from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import volunteerApplicationsTranslations from "@/app/translations/volunteerOpportunityDetailsTranslations";

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "attended"
  | "cancelled"
  | "withdrawn"
  | string;

type ApplicationItem = {
  id: number;
  volunteer_id: number;
  event_id: number;
  application_date: string;
  status: ApplicationStatus;
  company_id: number;
  title: string;
  title_ar?: string | null;
  title_en?: string | null;
  description: string;
  description_ar?: string | null;
  description_en?: string | null;
  address: string;
  capacity: number;
  event_type: "volunteer" | "paid";
  start_time: string;
  end_time: string;
  reward?: number;
};



const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
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

export default function VolunteerApplicationsPage() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = volunteerApplicationsTranslations[lang];

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/volunteer-applications/me");

      const data = Array.isArray(response.data) ? response.data : [];

      setApplications(data);
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [lang]);

  const activeApplications = useMemo(() => {
    return applications.filter(
      (item) => item.status === "pending" || item.status === "accepted"
    );
  }, [applications]);

  const previousApplications = useMemo(() => {
    return applications.filter(
      (item) =>
        item.status === "rejected" ||
        item.status === "cancelled" ||
        item.status === "withdrawn" ||
        item.status === "attended"
    );
  }, [applications]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "pending").length,
      accepted: applications.filter((item) => item.status === "accepted").length,
      cancelled: applications.filter(
        (item) =>
          item.status === "cancelled" || item.status === "withdrawn"
      ).length,
    };
  }, [applications]);

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

  const getTitle = (item: ApplicationItem) => {
    return isArabic ? item.title_ar || item.title : item.title_en || item.title;
  };

  const getDescription = (item: ApplicationItem) => {
    return isArabic
      ? item.description_ar || item.description
      : item.description_en || item.description;
  };

  const canWithdraw = (status: ApplicationStatus) => {
    return status === "pending" || status === "accepted";
  };

  const statusClassMap: Record<string, string> = {
    pending:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    accepted:
      "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400",
    rejected:
      "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
    cancelled:
      "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    withdrawn:
      "border-zinc-500/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  };

  const statCardStyles = [
    "from-yellow-500/10 to-amber-500/5",
    "from-yellow-500/10 to-amber-500/5",
    "from-green-500/10 to-emerald-500/5",
    "from-zinc-500/10 to-slate-500/5",
  ];

  const handleWithdraw = async (applicationId: number) => {
  const result = await Swal.fire({
    title: t.withdrawConfirmTitle,
    text: t.withdrawConfirmText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t.withdrawConfirmButton,
    cancelButtonText: t.withdrawCancelButton,
    confirmButtonColor: "#dc2626",
  });

  if (!result.isConfirmed) return;

  try {
    setWithdrawingId(applicationId);

    await api.put(`/volunteer-applications/${applicationId}/withdraw`, {});

    await fetchApplications();

    await Swal.fire({
      icon: "success",
      title: t.withdrawSuccessTitle,
      text: t.withdrawSuccessText,
      confirmButtonText: "OK",
    });
  } catch (err) {
    console.error(err);

    await Swal.fire({
      icon: "error",
      title: t.withdrawErrorTitle,
      text: t.withdrawErrorText,
      confirmButtonText: "OK",
    });
  } finally {
    setWithdrawingId(null);
  }
};
  const renderApplicationCard = (item: ApplicationItem) => {
    const withdrawable = canWithdraw(item.status);
    const currentStatusLabel =
      t.statusLabels[item.status as keyof typeof t.statusLabels] || item.status;

    return (
      <motion.article
        key={item.id}
        variants={fadeUp}
        whileHover={{ y: -4 }}
        className="group overflow-hidden rounded-[2rem] border border-foreground/10 bg-background/80 shadow-sm backdrop-blur-sm transition hover:shadow-lg"
      >
        <div className="h-1 w-full bg-gradient-to-r from-foreground/20 via-foreground/10 to-transparent" />

        <div className="p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                statusClassMap[item.status] ||
                "border-foreground/10 bg-foreground/5 text-foreground/70"
              }`}
            >
              {currentStatusLabel}
            </span>

            <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-sm font-semibold text-foreground/80">
              {t.typeLabels[item.event_type]}
            </span>
            {item.event_type === "paid" && item.reward !== undefined && (
              <span className="rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-black text-emerald-600 border border-emerald-500/20 shadow-sm">
                {isArabic ? "مكافأة: " : "Reward: "} {Number(item.reward).toLocaleString()} EGP
              </span>
            )}
          </div>

          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {getTitle(item)}
            </h2>

            <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/70">
              {getDescription(item)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4 transition group-hover:bg-foreground/[0.07]">
              <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                <FaCalendarAlt />
                <span>{t.applicationDate}</span>
              </div>
              <p className="font-semibold text-foreground">
                {formatDate(item.application_date)}
              </p>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4 transition group-hover:bg-foreground/[0.07]">
              <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                <FaCalendarAlt />
                <span>{t.eventDate}</span>
              </div>
              <p className="font-semibold text-foreground">
                {formatDate(item.start_time)}
              </p>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4 transition group-hover:bg-foreground/[0.07]">
              <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                <FaClock />
                <span>{t.time}</span>
              </div>
              <p className="font-semibold text-foreground">
                {formatTime(item.start_time)} - {formatTime(item.end_time)}
              </p>
            </div>

            <div className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4 transition group-hover:bg-foreground/[0.07]">
              <div className="mb-2 flex items-center gap-2 text-sm text-foreground/60">
                <FaLocationDot />
                <span>{t.location}</span>
              </div>
              <p className="font-semibold text-foreground">{item.address}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/10 pt-6">
            <div className="flex flex-wrap items-center gap-5 text-sm text-foreground/65">
              <span className="inline-flex items-center gap-2">
                <FaUsers className="text-foreground/50" />
                {t.capacity}:{" "}
                <span className="font-semibold text-foreground">
                  {item.capacity}
                </span>
              </span>

              <span>
                {t.status}:{" "}
                <span className="font-semibold text-foreground">
                  {currentStatusLabel}
                </span>
              </span>

              <span>
                {t.type}:{" "}
                <span className="font-semibold text-foreground">
                  {t.typeLabels[item.event_type]}
                </span>
              </span>
            </div>

            {withdrawable ? (
              <motion.button
                whileHover={
                  withdrawingId === item.id ? undefined : { scale: 1.015 }
                }
                whileTap={
                  withdrawingId === item.id ? undefined : { scale: 0.985 }
                }
                onClick={() => handleWithdraw(item.id)}
                disabled={withdrawingId === item.id}
                className={`inline-flex min-w-[185px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  withdrawingId === item.id
                    ? "cursor-not-allowed border border-red-500/20 bg-red-500/10 text-red-400"
                    : "border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"
                }`}
              >
                {withdrawingId === item.id ? (
                  <>
                    <div className="scale-75">
                      <Spinner />
                    </div>
                    <span>{t.withdrawing}</span>
                  </>
                ) : (
                  <span>{t.withdraw}</span>
                )}
              </motion.button>
            ) : null}
          </div>
        </div>
      </motion.article>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="space-y-3">
            <div className="h-10 w-72 rounded-2xl bg-foreground/10" />
            <div className="h-5 w-[28rem] rounded-xl bg-foreground/10" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-foreground/10 bg-background/80 p-6"
              >
                <div className="mb-3 h-4 w-28 rounded-lg bg-foreground/10" />
                <div className="h-8 w-16 rounded-lg bg-foreground/10" />
              </div>
            ))}
          </div>

          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-foreground/10 bg-background/80 p-6"
              >
                <div className="mb-4 flex gap-3">
                  <div className="h-8 w-24 rounded-full bg-foreground/10" />
                  <div className="h-8 w-24 rounded-full bg-foreground/10" />
                </div>
                <div className="mb-3 h-8 w-72 rounded-xl bg-foreground/10" />
                <div className="mb-2 h-5 w-full rounded-lg bg-foreground/10" />
                <div className="mb-2 h-5 w-5/6 rounded-lg bg-foreground/10" />
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((__, innerIndex) => (
                    <div
                      key={innerIndex}
                      className="rounded-3xl border border-foreground/10 bg-foreground/5 p-4"
                    >
                      <div className="mb-2 h-4 w-20 rounded-lg bg-foreground/10" />
                      <div className="h-5 w-28 rounded-lg bg-foreground/10" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-500/20 bg-red-500/5 p-8 text-center shadow-sm">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            {t.error}
          </h2>
          <button
            onClick={fetchApplications}
            className="inline-flex items-center justify-center rounded-2xl border border-foreground/15 px-5 py-3 text-sm font-medium transition hover:bg-foreground hover:text-background"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t.title}
            </h1>
            <p className="mt-3 max-w-2xl text-foreground/70">{t.subtitle}</p>
          </div>

          <div className="rounded-[2rem] border border-foreground/10 bg-background/80 p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 text-2xl text-foreground/70">
              <FaClipboardCheck />
            </div>
            <h2 className="mb-3 text-2xl font-semibold">{t.emptyTitle}</h2>
            <p className="mx-auto max-w-xl text-foreground/70">{t.emptyText}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="rounded-[2rem] border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm md:p-8"
        >
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-foreground/70">
            {t.subtitle}
          </p>
        </motion.section>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            { label: t.total, value: stats.total, style: statCardStyles[0] },
            { label: t.pending, value: stats.pending, style: statCardStyles[1] },
            { label: t.accepted, value: stats.accepted, style: statCardStyles[2] },
            { label: t.cancelled, value: stats.cancelled, style: statCardStyles[3] },
          ].map((card) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`rounded-[2rem] border border-foreground/10 bg-gradient-to-br ${card.style} p-6 shadow-sm`}
            >
              <p className="mb-2 text-sm text-foreground/60">{card.label}</p>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </motion.div>
          ))}
        </motion.section>

        <section className="space-y-10">
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {t.activeApplications}
              </h2>
            </div>

            {activeApplications.length ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {activeApplications.map(renderApplicationCard)}
              </motion.div>
            ) : (
              <div className="rounded-[2rem] border border-foreground/10 bg-background/80 p-8 text-center text-foreground/65 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">{t.noActiveTitle}</h3>
                <p>{t.noActiveText}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {t.previousApplications}
              </h2>
            </div>

            {previousApplications.length ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-6"
              >
                {previousApplications.map(renderApplicationCard)}
              </motion.div>
            ) : (
              <div className="rounded-[2rem] border border-foreground/10 bg-background/80 p-8 text-center text-foreground/65 shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">
                  {t.noPreviousTitle}
                </h3>
                <p>{t.noPreviousText}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}