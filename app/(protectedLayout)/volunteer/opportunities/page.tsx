"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/app/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "@/app/components/Spinner/Spinner";
import FilteringBar from "@/app/components/VolunteerLayout/VolunteerOpportunities/FilteringBar";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { volunteerOpportunitiesTranslations } from "@/app/translations/volunteerOpportunitiesTranslations";
import { getLocalizedText } from "@/app/utils/localization";
import { Opportunity } from "@/app/type/opportunity";
import OpportunityCard from "@/app/components/VolunteerLayout/VolunteerOpportunities/OpportunityCard";
import { useEventsCategories } from "@/app/Context/EventsCategories";

export default function VolunteerOpportunities() {
  const { lang } = useLang();
  const t = volunteerOpportunitiesTranslations[lang];
  const isArabic = lang === "ar";

  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [capacity, setCapacity] = useState("all");
  const [categoryId, setCategoryId] = useState("all");

  const { categories } = useEventsCategories();

  const getOpportunities = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events");
      setOpportunities(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOpportunities();
  }, []);

  const handleReset = () => {
    setIsResetting(true);
    setSearch("");
    setStatus("all");
    setType("all");
    setCapacity("all");
    setCategoryId("all");

    setTimeout(() => {
      setIsResetting(false);
    }, 500);
  };

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      if (opportunity.is_deleted === 1) return false;

      const searchableTitle = getLocalizedText(
        opportunity.title_ar,
        opportunity.title_en,
        opportunity.title,
        isArabic,
        ""
      ).toLowerCase().trim();

      const matchesSearch = searchableTitle.includes(search.toLowerCase().trim());
      const matchesStatus = status === "all" || opportunity.status === status;
      const matchesType = type === "all" || opportunity.event_type === type;

      const matchesCapacity = (() => {
        if (capacity === "all") return true;
        if (capacity === "1-25") return opportunity.capacity >= 1 && opportunity.capacity <= 25;
        if (capacity === "26-50") return opportunity.capacity >= 26 && opportunity.capacity <= 50;
        if (capacity === "51-100") return opportunity.capacity >= 51 && opportunity.capacity <= 100;
        if (capacity === "101-200") return opportunity.capacity >= 101 && opportunity.capacity <= 200;
        return true;
      })();

      const matchesCategory = categoryId === "all" || String(opportunity.category_id) === categoryId;

      return matchesSearch && matchesStatus && matchesType && matchesCapacity && matchesCategory;
    });
  }, [opportunities, search, status, type, capacity, categoryId, isArabic]);

  if (loading) {
    return (
      <motion.div
        className="flex min-h-[50vh] items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Spinner />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6 p-6 md:space-y-10 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <motion.h1
          className="text-3xl font-bold text-foreground md:text-4xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          {t.title}
        </motion.h1>

        <motion.p
          className="max-w-2xl text-sm text-foreground/50 md:text-base"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          {t.description}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        <FilteringBar
          search={search}
          status={status}
          type={type}
          capacity={capacity}
          categoryId={categoryId}
          categories={categories}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onTypeChange={setType}
          onCapacityChange={setCapacity}
          onCategoryChange={setCategoryId}
          onReset={handleReset}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {isResetting ? (
          <motion.div
            key="reset-loader"
            className="flex min-h-[300px] items-center justify-center rounded-3xl border border-foreground/10 bg-background"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              initial={{ opacity: 0, rotate: -8 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Spinner />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="cards-grid"
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 8 }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  t={t}
                  isArabic={isArabic}
                />
              ))
            ) : (
              <motion.div
                className="col-span-full rounded-3xl border border-dashed border-foreground/10 bg-background p-10 text-center text-foreground/60"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {t.empty}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}