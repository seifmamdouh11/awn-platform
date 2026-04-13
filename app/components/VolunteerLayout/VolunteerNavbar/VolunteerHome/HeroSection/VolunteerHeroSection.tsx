"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRightLong, FaRegCalendar, FaUserCheck } from "react-icons/fa6";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { useLoggedInData } from "@/app/Context/LoggedInDataContext";

type LangType = "en" | "ar";

export default function VolunteerHeroSection() {
  const { lang } = useLang();
  const { data, loading } = useLoggedInData();

  const t = heroTranslations[lang as LangType] || heroTranslations.en;

  const fullName = useMemo(() => {
    return [data?.first_name, data?.last_name].filter(Boolean).join(" ").trim();
  }, [data]);

  const firstName = useMemo(() => {
    return data?.first_name || t.volunteer;
  }, [data, t.volunteer]);

  const memberSince = useMemo(() => {
    if (!data?.created_at) return t.notAvailable;

    try {
      return new Date(data.created_at).toLocaleDateString(
        lang === "ar" ? "ar-EG" : "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return t.notAvailable;
    }
  }, [data, lang, t.notAvailable]);

  const statusConfig = useMemo(() => {
    switch (data?.status) {
      case "active":
        return {
          label: t.active,
          className:
            "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
      case "pending":
        return {
          label: t.pending,
          className:
            "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
      case "blocked":
        return {
          label: t.blocked,
          className:
            "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400",
        };
      default:
        return {
          label: t.unknown,
          className:
            "border-foreground/10 bg-foreground/[0.05] text-foreground/70",
        };
    }
  }, [data, t]);

  return (
    <motion.section
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[32px] border border-foreground/10 bg-background px-6 py-8 shadow-sm sm:px-8 sm:py-10 lg:px-10 lg:py-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-sky-500/5 dark:to-cyan-500/10" />
      </div>

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-foreground/55"
          >
            {t.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {loading ? t.loadingTitle : t.welcome.replace("{name}", firstName)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.16, duration: 0.35 }}
            className="mt-4 max-w-xl text-sm leading-7 text-foreground/70 sm:text-base"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.22, duration: 0.35 }}
            className="mt-7 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/volunteer/opportunities"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-foreground transition hover:translate-y-[-1px] hover:shadow-md"
            >
              {t.primaryCta}
              <FaArrowRightLong
                className={`${lang === "ar" ? "rotate-180" : ""}`}
              />
            </Link>

            <Link
              href="/volunteer/applications"
              className="inline-flex items-center justify-center rounded-full border border-foreground/10 bg-background/70 px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground"
            >
              {t.secondaryCta}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.28, duration: 0.35 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${statusConfig.className}`}
            >
              <FaUserCheck className="text-sm" />
              <span>
                {t.statusLabel}: {loading ? t.loadingChip : statusConfig.label}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-4 py-2 text-sm font-medium text-foreground/75">
              <FaRegCalendar className="text-sm" />
              <span>
                {t.memberSinceLabel}: {loading ? t.loadingChip : memberSince}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-4 py-2 text-sm font-medium text-foreground/75">
              <span className="font-semibold">
                {loading ? "..." : fullName || t.volunteer}
              </span>
            </div>
          </motion.div>

          {data?.status === "pending" && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: 0.34, duration: 0.3 }}
              className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"
            >
              {t.pendingMessage}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ delay: 0.16, duration: 0.4 }}
          className="relative hidden min-h-[300px] lg:flex lg:items-center lg:justify-center"
        >
          <div className="relative h-[320px] w-full max-w-[420px]">
            <div className="absolute left-10 top-5 h-24 w-24 rounded-3xl bg-primary/15 blur-2xl" />
            <div className="absolute bottom-12 right-8 h-28 w-28 rounded-full bg-sky-500/15 blur-2xl dark:bg-cyan-500/15" />

            <div className="absolute left-0 top-10 w-52 rounded-[28px] border border-foreground/10 bg-background/85 p-5 shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/45">
                {t.cardOneTitle}
              </p>
              <p className="mt-3 text-lg font-bold text-foreground">
                {t.cardOneValue}
              </p>
              <p className="mt-1 text-sm text-foreground/60">
                {t.cardOneDesc}
              </p>
            </div>

            <div className="absolute right-0 top-28 w-56 rounded-[28px] border border-foreground/10 bg-background/85 p-5 shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/45">
                {t.cardTwoTitle}
              </p>
              <p className="mt-3 text-lg font-bold text-foreground">
                {t.cardTwoValue}
              </p>
              <p className="mt-1 text-sm text-foreground/60">
                {t.cardTwoDesc}
              </p>
            </div>

            <div className="absolute bottom-0 left-12 w-60 rounded-[28px] border border-foreground/10 bg-background/85 p-5 shadow-lg backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground/45">
                {t.cardThreeTitle}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-foreground/75">
                  {t.cardThreeValue}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground/60">
                {t.cardThreeDesc}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

const heroTranslations = {
  en: {
    eyebrow: "Volunteer Dashboard",
    volunteer: "Volunteer",
    notAvailable: "N/A",
    loadingTitle: "Loading your dashboard...",
    welcome: "Welcome back, {name} 👋",
    subtitle:
      "Explore volunteer opportunities, track your applications, and stay connected with your upcoming events.",
    primaryCta: "Browse Opportunities",
    secondaryCta: "My Applications",
    statusLabel: "Status",
    memberSinceLabel: "Member since",
    loadingChip: "Loading...",
    active: "Active",
    pending: "Under Review",
    blocked: "Blocked",
    unknown: "Unknown",
    pendingMessage:
      "Your account is currently under review. Some actions may remain limited until approval.",
    cardOneTitle: "Opportunities",
    cardOneValue: "Find your next impact",
    cardOneDesc: "Browse open roles that match your time and interests.",
    cardTwoTitle: "Applications",
    cardTwoValue: "Track every update",
    cardTwoDesc: "Follow pending, accepted, and attended applications easily.",
    cardThreeTitle: "Community",
    cardThreeValue: "Ready to contribute",
    cardThreeDesc: "Stay connected with meaningful events and real-world impact.",
  },
  ar: {
    eyebrow: "لوحة المتطوع",
    volunteer: "متطوع",
    notAvailable: "غير متاح",
    loadingTitle: "جارٍ تحميل صفحتك...",
    welcome: "مرحبًا بعودتك، {name} 👋",
    subtitle:
      "استكشف الفرص التطوعية، وتابع طلباتك، وابقَ على اطلاع بفعالياتك القادمة بكل سهولة.",
    primaryCta: "تصفح الفرص",
    secondaryCta: "طلباتي",
    statusLabel: "الحالة",
    memberSinceLabel: "عضو منذ",
    loadingChip: "جارٍ التحميل...",
    active: "نشط",
    pending: "قيد المراجعة",
    blocked: "محظور",
    unknown: "غير معروف",
    pendingMessage:
      "حسابك قيد المراجعة حاليًا، وقد تظل بعض الإجراءات محدودة حتى يتم اعتماده.",
    cardOneTitle: "الفرص",
    cardOneValue: "اعثر على فرصتك التالية",
    cardOneDesc: "تصفح الفرص المفتوحة المناسبة لوقتك واهتماماتك.",
    cardTwoTitle: "الطلبات",
    cardTwoValue: "تابع كل تحديث",
    cardTwoDesc: "تابع الطلبات المعلقة والمقبولة والمنجزة بسهولة.",
    cardThreeTitle: "المجتمع",
    cardThreeValue: "جاهز للمساهمة",
    cardThreeDesc: "ابقَ قريبًا من الفعاليات المؤثرة وصناعة الأثر الحقيقي.",
  },
} satisfies Record<LangType, Record<string, string>>;