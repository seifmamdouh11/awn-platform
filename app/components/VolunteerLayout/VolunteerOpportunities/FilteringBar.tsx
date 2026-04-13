"use client";

import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { volunteerOpportunitiesTranslations } from "@/app/translations/volunteerOpportunitiesTranslations";
import React from "react";
import { FiRotateCcw, FiSearch } from "react-icons/fi";

type Props = {
  search: string;
  status: string;
  type: string;
  capacity: string;
  categoryId: string;
  categories: any[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
};

export default function FilteringBar({
  search,
  status,
  type,
  capacity,
  categoryId,
  categories,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onCapacityChange,
  onCategoryChange,
  onReset,
}: Props) {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = volunteerOpportunitiesTranslations[lang];

  return (
    <div className="w-full rounded-2xl border border-foreground/10 bg-background/80 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <FiSearch
            className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm text-foreground/40 ${isArabic ? "right-3" : "left-3"
              }`}
          />

          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.filters.searchPlaceholder}
            className={`h-11 w-full rounded-xl border border-foreground/10 bg-background text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-foreground/20 focus:ring-2 focus:ring-foreground/5 ${isArabic ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"
              }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm text-foreground outline-none transition hover:border-foreground/20 focus:border-foreground/20"
          >
            <option value="all">{t.filters.allCategories}</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {isArabic ? cat.category_name_ar || cat.category_name : cat.category_name_en || cat.category_name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm text-foreground outline-none transition hover:border-foreground/20 focus:border-foreground/20"
          >
            <option value="all">{t.filters.allStatus}</option>
            <option value="open">{t.filters.open}</option>
            <option value="closed">{t.filters.closed}</option>
          </select>

          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm text-foreground outline-none transition hover:border-foreground/20 focus:border-foreground/20"
          >
            <option value="all">{t.filters.allTypes}</option>
            <option value="volunteer">{t.filters.volunteer}</option>
            <option value="paid">{t.filters.paid}</option>
          </select>

          <select
            value={capacity}
            onChange={(e) => onCapacityChange(e.target.value)}
            className="h-11 rounded-xl border border-foreground/10 bg-background px-3 text-sm text-foreground outline-none transition hover:border-foreground/20 focus:border-foreground/20"
          >
            <option value="all">{t.filters.capacity}</option>
            <option value="1-25">{t.filters.range1}</option>
            <option value="26-50">{t.filters.range2}</option>
            <option value="51-100">{t.filters.range3}</option>
            <option value="101-200">{t.filters.range4}</option>
          </select>

          <button
            type="button"
            onClick={onReset}
            className={`
            flex h-11 items-center gap-2 rounded-xl border border-foreground/10 bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90
            `}
          >
            <FiRotateCcw className="text-sm" />
            {t.filters.reset}
          </button>
        </div>
      </div>
    </div>
  );
}