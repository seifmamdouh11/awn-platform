"use client";

import React, { useState, useEffect, useMemo } from "react";
import api from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import {
  Star,
  MessageSquare,
  TrendingUp,
  User,
  Calendar,
  Loader2,
  Building2,
  Filter,
  ChevronDown
} from "lucide-react";

interface Review {
  id: number;
  rating_value: number;
  comment: string | null;
  created_at: string;
  title: string | null;
  title_en: string | null;
  title_ar: string | null;
  rater_name: string;
}

const translations = {
  en: {
    title: "Reviews & Ratings",
    subtitle: "See what volunteers are saying about your opportunities",
    badge: "Company Reviews",
    averageRating: "Average Rating",
    totalReviews: "Total Reviews",
    ratingBreakdown: "Rating Breakdown",
    recentReviews: "Recent Reviews",
    noReviews: "No reviews yet",
    noReviewsSubtitle: "Your reviews will appear here once volunteers complete your opportunities",
    from: "for opportunity",
    anonymous: "Anonymous Volunteer",
    filter: "Filter by stars",
    allRatings: "All Ratings",
    stars: "Stars",
    verified: "Verified Review"
  },
  ar: {
    title: "التقييمات والمراجعات",
    subtitle: "شاهد ما يقوله المتطوعون عن فرصك",
    badge: "مراجعات الشركة",
    averageRating: "متوسط التقييم",
    totalReviews: "إجمالي المراجعات",
    ratingBreakdown: "توزيع التقييمات",
    recentReviews: "المراجعات الأخيرة",
    noReviews: "لا توجد مراجعات بعد",
    noReviewsSubtitle: "ستظهر مراجعاتك هنا بمجرد إكمال المتطوعين لفرصك",
    from: "لفرصة",
    anonymous: "متطوع مجهول",
    filter: "تصفية حسب النجوم",
    allRatings: "كل التقييمات",
    stars: "نجوم",
    verified: "مراجعة موثقة"
  }
};

function StarDisplay({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= value ? "text-[#febc5a] fill-[#febc5a]" : "text-foreground/20 fill-foreground/10"}
        />
      ))}
    </div>
  );
}

export default function CompanyReviewsPage() {
  const { lang } = useLang();
  const t = lang === "ar" ? translations.ar : translations.en;
  const isRTL = lang === "ar";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get("/ratings/target/me");
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating_value, 0) / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { counts[r.rating_value] = (counts[r.rating_value] || 0) + 1; });
    return counts;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (!filterStars) return reviews;
    return reviews.filter(r => r.rating_value === filterStars);
  }, [reviews, filterStars]);

  const getOpportunityTitle = (review: Review) => {
    if (lang === "ar" && review.title_ar) return review.title_ar;
    if (review.title_en) return review.title_en;
    return review.title || "—";
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-8 space-y-10"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
          <Building2 size={14} />
          {t.badge}
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
          {t.title}
        </h1>
        <p className="text-base text-muted font-bold uppercase tracking-widest opacity-60">
          {t.subtitle}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Average Rating Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="col-span-1 p-8 rounded-[3rem] bg-foreground text-background relative overflow-hidden flex flex-col items-center justify-center text-center gap-3 shadow-2xl"
        >
          <div className="absolute inset-0 bg-primary/10 blur-3xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 relative z-10">{t.averageRating}</p>
          <p className="text-7xl font-black tabular-nums relative z-10">
            {reviews.length > 0 ? averageRating.toFixed(1) : "—"}
          </p>
          <div className="relative z-10">
            <StarDisplay value={Math.round(averageRating)} size={20} />
          </div>
          <p className="text-xs opacity-40 font-bold relative z-10">{reviews.length} {t.totalReviews}</p>
        </motion.div>

        {/* Rating Breakdown */}
        <motion.div
          whileHover={{ y: -4 }}
          className="col-span-2 p-8 rounded-[3rem] bg-white dark:bg-soft-bg/20 border-2 border-muted/10 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60">{t.ratingBreakdown}</p>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <span className="text-sm font-black tabular-nums">{star}</span>
                  <Star size={12} className="text-[#febc5a] fill-[#febc5a]" />
                </div>
                <div className="flex-1 h-3 rounded-full bg-foreground/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                    className="h-full rounded-full bg-[#febc5a]"
                  />
                </div>
                <span className="text-xs font-bold text-muted w-8 text-right tabular-nums">{count}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Filter + Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tighter">{t.recentReviews}</h2>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-foreground/5 border border-foreground/10 text-sm font-bold hover:bg-foreground/10 transition-all"
            >
              <Filter size={14} />
              {filterStars ? `${filterStars} ${t.stars}` : t.allRatings}
              <ChevronDown size={14} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute top-full mt-2 right-0 bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden z-20 min-w-[160px]"
                >
                  <button
                    onClick={() => { setFilterStars(null); setFilterOpen(false); }}
                    className={`w-full px-5 py-3 text-sm font-bold text-left hover:bg-foreground/5 transition-colors ${!filterStars ? 'text-primary' : ''}`}
                  >
                    {t.allRatings}
                  </button>
                  {[5, 4, 3, 2, 1].map(s => (
                    <button
                      key={s}
                      onClick={() => { setFilterStars(s); setFilterOpen(false); }}
                      className={`w-full px-5 py-3 text-sm font-bold text-left hover:bg-foreground/5 transition-colors flex items-center gap-2 ${filterStars === s ? 'text-primary' : ''}`}
                    >
                      <Star size={12} className="text-[#febc5a] fill-[#febc5a]" />
                      {s} {t.stars}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 space-y-4 rounded-[3rem] bg-foreground/[0.02] border-2 border-dashed border-foreground/10"
          >
            <div className="p-6 rounded-full bg-foreground/5">
              <MessageSquare size={40} className="text-foreground/20" />
            </div>
            <p className="text-xl font-black text-foreground/30">{t.noReviews}</p>
            <p className="text-sm text-foreground/20 font-medium max-w-xs text-center">{t.noReviewsSubtitle}</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-6 md:p-8 rounded-[2.5rem] bg-white dark:bg-soft-bg/20 border-2 border-muted/10 dark:border-white/5 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-primary/20 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    {/* Avatar */}
                    <div className="shrink-0 h-12 w-12 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-lg">
                      {review.rater_name ? review.rater_name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Top row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <p className="font-black text-foreground">{review.rater_name || t.anonymous}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              {t.verified}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StarDisplay value={review.rating_value} size={16} />
                          <div className="flex items-center gap-1 text-[10px] text-muted opacity-50">
                            <Calendar size={10} />
                            {new Date(review.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Opportunity */}
                      {getOpportunityTitle(review) !== "—" && (
                        <p className="text-[11px] font-bold text-primary/70 uppercase tracking-widest">
                          {t.from}: {getOpportunityTitle(review)}
                        </p>
                      )}

                      {/* Comment */}
                      {review.comment && (
                        <p className="text-sm text-foreground/70 font-medium leading-relaxed border-l-4 border-primary/20 pl-4">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
