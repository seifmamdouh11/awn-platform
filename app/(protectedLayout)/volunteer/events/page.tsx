"use client";

import api from "@/app/utils/api";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Modal from "@/app/components/Modals/Modal";
import { FaStar } from "react-icons/fa";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
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
  user_rating?: number;
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

export default function AttendedEventsPage() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = volunteerApplicationsTranslations[lang];

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<ApplicationItem | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const openRatingModal = (item: ApplicationItem) => {
    setRatingTarget(item);
    setRatingValue(0);
    setRatingComment("");
    setRatingModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (ratingValue === 0) {
      Swal.fire({ icon: "warning", title: lang === "ar" ? "تنبيه" : "Warning", text: lang === "ar" ? "يرجى اختيار تقييم." : "Please select a rating.", confirmButtonColor: '#febc5a' });
      return;
    }
    setIsSubmittingRating(true);
    try {
      await api.post("/ratings", {
        opportunity_id: ratingTarget?.event_id,
        target_id: ratingTarget?.company_id,
        rating_value: ratingValue,
        comment: ratingComment
      });
      
      Swal.fire({ icon: "success", title: lang === "ar" ? "شكراً لك!" : "Thank You!", text: lang === "ar" ? "تم إرسال التقييم بنجاح." : "Rating submitted successfully.", confirmButtonColor: '#febc5a' });
      setRatingModalOpen(false);
      fetchApplications();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      Swal.fire({ icon: "error", title: lang === "ar" ? "عذراً" : "Error", text: errorMessage, confirmButtonColor: '#febc5a' });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/volunteer-applications/me");

      const data = Array.isArray(response.data) ? response.data : [];

      // STRICT FILTER: Only keep applications with "attended" status
      const attendedData = data.filter(
        (item: ApplicationItem) => item.status === "attended"
      );

      setApplications(attendedData);
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

  const renderApplicationCard = (item: ApplicationItem) => {
    const currentStatusLabel =
      t.statusLabels?.["attended"] ;

    return (
      <motion.article
        key={item.id}
        variants={fadeUp}
        whileHover={{ y: -4 }}
        className="group overflow-hidden rounded-[2rem] border border-yellow-500/20 bg-background/80 shadow-sm backdrop-blur-sm transition hover:shadow-lg"
      >
        <div className="h-1 w-full bg-gradient-to-r from-yellow-500/50 via-amber-500/30 to-transparent" />

        <div className="p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1.5 text-sm font-semibold text-yellow-600 dark:text-yellow-400">
              {currentStatusLabel}
            </span>

            <span className="rounded-full border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-sm font-semibold text-foreground/80">
              {t.typeLabels?.[item.event_type] || item.event_type}
            </span>
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
            </div>

            {item.user_rating ? (
              <div className="mt-4 sm:mt-0 flex flex-col items-center gap-1.5 rounded-2xl bg-yellow-500/10 px-6 py-2.5 border border-yellow-500/20">
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-700/80 dark:text-yellow-400/80">
                  {lang === "ar" ? "تقييمك" : "Your Rating"}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar key={star} size={16} className={star <= item.user_rating! ? "text-[#febc5a]" : "text-foreground/10"} />
                  ))}
                </div>
              </div>
            ) : (
              <motion.button
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => openRatingModal(item)}
                 className="mt-4 sm:mt-0 inline-flex min-w-[150px] items-center justify-center gap-2 rounded-2xl bg-[#febc5a] px-5 py-2.5 text-sm font-semibold text-black shadow-md transition hover:bg-[#eab308]"
              >
                 <FaStar />
                 {lang === "ar" ? "قيّم الجهة" : "Rate Company"}
              </motion.button>
            )}
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
          <div className="grid gap-6">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-foreground/10 bg-background/80 p-6 h-[300px]"
              />
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
              {t.attendedTitle || "Attended Events"} 
            </h1>
            <p className="mt-3 max-w-2xl text-foreground/70">
              {t.attendedSubtitle || "You haven't attended any events yet."}
            </p>
          </div>

          <div className="rounded-[2rem] border border-foreground/10 bg-background/80 p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 text-2xl text-foreground/70">
              <FaClipboardCheck />
            </div>
            <h2 className="mb-3 text-2xl font-semibold">
              {t.emptyAttendedTitle || "No Attendance History"}
            </h2>
            <p className="mx-auto max-w-xl text-foreground/70">
              {t.emptyAttendedText || "Once you complete an event and the organizer marks your attendance, it will show up here."}
            </p>
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
          className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm md:p-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t.attendedTitle || "Attended Events"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-foreground/70">
              {t.attendedSubtitle || "View the history of all the volunteer events you have completed."}
            </p>
          </div>
          
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 px-8 text-center shadow-sm">
             <p className="mb-1 text-sm font-medium text-yellow-700 dark:text-yellow-300">Total Attended</p>
             <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{applications.length}</p>
          </div>
        </motion.section>

        <section className="space-y-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {applications.map(renderApplicationCard)}
          </motion.div>
        </section>

        {/* Rating Modal */}
        <Modal
          isOpen={ratingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          title={lang === "ar" ? "تقييم الجهة المنظمة" : "Rate Organizer"}
          maxWidth="max-w-md"
        >
          <div className="space-y-6">
            <p className="text-center text-sm font-medium text-foreground/70">
              {lang === "ar" ? "ما هو تقييمك لتجربتك في هذا الحدث؟" : "How would you rate your experience with this event?"}
            </p>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <FaStar size={40} className={star <= ratingValue ? "text-[#febc5a]" : "text-foreground/20"} />
                </button>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground/70">
                {lang === "ar" ? "هل ترغب بإضافة تعليق؟ (اختياري)" : "Would you like to leave a comment? (Optional)"}
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder={lang === "ar" ? "اكتب تعليقك هنا..." : "Write your comment here..."}
                rows={3}
                className="w-full resize-none rounded-2xl border border-foreground/10 bg-foreground/5 p-4 text-sm outline-none transition focus:border-[#febc5a] focus:bg-background custom-scrollbar"
              />
            </div>

            <button
              onClick={handleSubmitRating}
              disabled={isSubmittingRating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#febc5a] py-3.5 font-semibold text-black transition hover:bg-[#eab308] disabled:opacity-50"
            >
              {isSubmittingRating ? "..." : (lang === "ar" ? "إرسال التقييم" : "Submit Rating")}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}