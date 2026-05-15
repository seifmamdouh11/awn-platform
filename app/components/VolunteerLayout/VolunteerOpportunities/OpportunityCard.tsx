"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { formatDate, getLocalizedText } from "@/app/utils/localization";
import { Opportunity } from "@/app/type/opportunity";

interface OpportunityCardProps {
  opportunity: Opportunity;
  t: any;
  isArabic: boolean;
}

export default function OpportunityCard({ opportunity, t, isArabic }: OpportunityCardProps) {
  const isClosed = opportunity.status === "closed";

  const title = getLocalizedText(
    opportunity.title_ar,
    opportunity.title_en,
    opportunity.title,
    isArabic,
    t.card.untitled
  );

  const description = getLocalizedText(
    opportunity.description_ar,
    opportunity.description_en,
    opportunity.description,
    isArabic,
    t.card.noDescription
  );

  const localizedStatus = t.values[opportunity.status] || opportunity.status;
  const localizedType = t.values[opportunity.event_type] || opportunity.event_type;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      className={`group relative flex flex-col justify-between rounded-[2rem] border bg-background p-6 shadow-sm transition-all hover:shadow-xl ${opportunity.is_featured 
          ? "border-amber-500/20 shadow-amber-500/[0.05] hover:shadow-amber-500/10" 
          : "border-foreground/5 hover:shadow-primary/5"}`}
    >
      {/* Featured Badge */}
      {opportunity.is_featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 z-10 border border-white/20">
          <FaStar size={10} className="mb-0.5" />
          {isArabic ? "فرصة مميزة" : "Featured"}
        </div>
      )}

      {/* Top Section: Badges & Title */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${opportunity.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
                }`}
            >
              {localizedStatus}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
              {localizedType}
            </span>
            {opportunity.event_type === "paid" && opportunity.reward !== undefined && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100 shadow-sm">
                {isArabic ? "مكافأة: " : "Reward: "} {Math.round(opportunity.reward).toLocaleString()} EGP
              </span>
            )}
          </div>
          {/* Subtle ID */}
          <div className="text-foreground/20 italic text-xs font-mono">
            #{opportunity.id}
          </div>
        </div>

        {opportunity.company_name && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              {opportunity.company_name}
            </span>
            {!!opportunity.company_verified && (
              <span className="text-blue-500 flex-shrink-0" title={isArabic ? "شركة موثّقة" : "Verified Company"}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.3 14.29L7.7 12.3a.996.996 0 111.41-1.41l1.59 1.59 4.29-4.3a.996.996 0 111.41 1.42l-5 5a.996.996 0 01-1.41 0l-.29-.31z"/>
                </svg>
              </span>
            )}
            {opportunity.company_rating && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                {opportunity.company_rating} <FaStar size={10} className="mb-0.5" />
              </span>
            )}
          </div>
        )}

        <h2 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h2>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/50">
          {description}
        </p>

        {/* Info Grid: Modern 2x2 Layout */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl bg-foreground/[0.02] p-4 border border-foreground/[0.03]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm text-primary">
              <Users size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-foreground/40 font-bold">
                {t.card.capacity}
              </span>
              <span className="text-sm font-bold text-foreground">
                {opportunity.capacity}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm text-primary">
              <MapPin size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-foreground/40 font-bold">
                {t.card.location}
              </span>
              <span className="text-sm font-bold text-foreground truncate max-w-[80px]">
                {opportunity.address || "Remote"}
              </span>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 border-t border-foreground/5 pt-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm text-primary">
              <Calendar size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-foreground/40 font-bold">
                {t.card.startDate}
              </span>
              <span className="text-sm font-bold text-foreground">
                {formatDate(opportunity.start_time, isArabic)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Action */}
      <div className="mt-6 flex items-center justify-between">
        <Link
          href={isClosed ? "#" : `/volunteer/opportunities/${opportunity.id}`}
          onClick={(e) => isClosed && e.preventDefault()}
          aria-disabled={isClosed}
          className={`group/btn relative flex items-center gap-3 overflow-hidden rounded-full px-6 py-3 text-sm font-bold transition-all ${isClosed
              ? "bg-gray-300 text-gray-500 cursor-not-allowed grayscale"
              : "bg-[#febc5a] text-background hover:bg-foreground hover:text-background"
            }`}
        >
          <span className="relative z-10">
            {isClosed ? t.card.closed : t.card.viewOpportunity}
          </span>
          <ArrowRight
            size={18}
            className="relative z-10 group-hover/btn:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </motion.div>
  );
}