"use client";

import React, { useEffect, useState } from "react";
import api from "@/app/utils/api";
import Link from "next/link";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

type EventItem = {
  id: number;
  title?: string;
  title_ar?: string | null;
  title_en?: string | null;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  address?: string | null;
  city?: string | null;
  status?: string;
  event_type?: "volunteer" | "paid";
  start_time?: string;
  end_time?: string;
  category_name?: string | null;
  category_name_ar?: string | null;
  category_name_en?: string | null;
};

export default function OpportunitiesSection() {
  const { lang } = useLang();
  const router = useRouter();
  const isArabic = lang === "ar";

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const t = translations[lang];

  const handleViewOpportunity = async () => {
    const result = await Swal.fire({
      title: isArabic
        ? "مطلوب حساب متطوع"
        : "Volunteer account required",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isArabic ? "تسجيل الدخول" : "Sign In",
      cancelButtonText: isArabic ? "إلغاء" : "Cancel",
      reverseButtons: isArabic,
    });

    if (result.isConfirmed) {
      router.push("/login/volunteer");
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/events", {
          params: { lang },
        });

        const data = Array.isArray(res.data)
          ? res.data
          : [];

        setEvents(data);
      } catch (err) {
        console.log(err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, [lang, t.error]);

  const featuredEvents = events
    .filter(
      (event) =>
        event.status !== "closed" &&
        event.status !== "cancelled"
    )
    .slice(0, 3);

  const getEventTitle = (event: EventItem) => {
    if (lang === "ar") {
      return (
        event.title_ar ||
        event.title ||
        t.untitled
      );
    }
    return (
      event.title_en ||
      event.title ||
      t.untitled
    );
  };

  const getEventDescription = (
    event: EventItem
  ) => {
    if (lang === "ar") {
      return (
        event.description_ar ||
        event.description ||
        t.noDescription
      );
    }
    return (
      event.description_en ||
      event.description ||
      t.noDescription
    );
  };

  const getCategoryName = (
    event: EventItem
  ) => {
    if (lang === "ar") {
      return (
        event.category_name_ar ||
        event.category_name ||
        t.generalCategory
      );
    }
    return (
      event.category_name_en ||
      event.category_name ||
      t.generalCategory
      );
  };

  const formatDate = (date?: string) => {
    if (!date) return t.noDate;

    return new Date(date).toLocaleDateString(
      isArabic ? "ar-EG" : "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header Animation */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {t.title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-foreground/60 sm:text-base">
            {t.description}
          </p>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-foreground/10 bg-background/80 p-6 animate-pulse"
              >
                <div className="h-6 w-24 rounded bg-foreground/10" />
                <div className="mt-4 h-7 w-3/4 rounded bg-foreground/10" />
                <div className="mt-3 h-4 w-full rounded bg-foreground/10" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
            <p className="text-sm text-red-500">
              {error}
            </p>
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-foreground/10 bg-background/80 p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              {t.emptyTitle}
            </h3>
            <p className="mt-2 text-sm text-foreground/60">
              {t.emptyDescription}
            </p>
          </div>
        ) : (

          /* Cards stagger animation */
          <motion.div
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.18,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {featuredEvents.map((event) => (
              <motion.article
                key={event.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 35,
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                whileHover={{
                  y: -6,
                  scale: 1.01,
                }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-foreground/10 bg-background/80 p-6 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/70">
                    {getCategoryName(event)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      event.event_type === "paid"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-orange-500/10 text-orange-600"
                    }`}
                  >
                    {event.event_type === "paid"
                      ? t.paid
                      : t.volunteer}
                  </span>
                </div>

                <h3 className="mt-5 line-clamp-2 text-xl font-bold text-foreground">
                  {getEventTitle(event)}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-foreground/60">
                  {getEventDescription(event)}
                </p>

                <div className="mt-6">
                  <button
                    onClick={handleViewOpportunity}
                    className="inline-flex cursor-pointer items-center rounded-xl border border-foreground/10 px-4 py-2 text-sm font-semibold"
                  >
                    {lang === "ar"
                      ? "عرض الفرصة"
                      : "View Opportunity"}
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

const translations = {
    en: {
        title: "Featured Opportunities",
        description:
            "Explore available opportunities and find the ones that match your interests and goals.",
        volunteer: "Volunteer",
        paid: "Paid",
        viewDetails: "View Details",
        viewAll: "View All Opportunities",
        locationLabel: "Location",
        dateLabel: "Date",
        noDate: "Not specified",
        noLocation: "Not specified",
        noDescription: "No description available.",
        generalCategory: "General",
        untitled: "Untitled opportunity",
        emptyTitle: "No opportunities yet",
        emptyDescription: "Check back soon for new opportunities.",
        error: "Something went wrong while loading opportunities.",
    },
    ar: {
        title: "الفرص المميزة",
        description:
            "استكشف الفرص المتاحة واعثر على ما يناسب اهتماماتك وأهدافك.",
        volunteer: "تطوع",
        paid: "مدفوع",
        viewDetails: "عرض التفاصيل",
        viewAll: "عرض جميع الفرص",
        locationLabel: "المكان",
        dateLabel: "التاريخ",
        noDate: "غير محدد",
        noLocation: "غير محدد",
        noDescription: "لا يوجد وصف متاح.",
        generalCategory: "عام",
        untitled: "فرصة بدون عنوان",
        emptyTitle: "لا توجد فرص متاحة حاليًا",
        emptyDescription: "تابعنا لاحقًا للاطلاع على فرص جديدة.",
        error: "حدث خطأ أثناء تحميل الفرص.",
    },
} as const;