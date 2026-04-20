"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import {
  FaUser,
  FaCalendarCheck,
  FaEnvelope,
  FaPen,
  FaCamera,
  FaMagnifyingGlass,
  FaPhone,
  FaWallet,
  FaStar,
  FaClock,
  FaLayerGroup,
  FaArrowRight,
  FaCircleCheck,
} from "react-icons/fa6";
import { useLoggedInData } from "@/app/Context/LoggedInDataContext";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import Spinner from "@/app/components/Spinner/Spinner";
import Modal from "@/app/components/Modals/Modal";
import Link from "next/link";
import { profileTranslations } from "@/app/translations/profile";
import { subscriptionTranslations } from "@/app/translations/subscriptions";

type Skill = {
  id: number;
  name: string;
};

type RecentEvent = {
  id: number;
  title: string;
  title_ar: string;
  title_en: string;
  status: string;
  created_at: string;
  event_type: string;
};

type RecentRating = {
  id: number;
  rating_value: number;
  comment: string;
  created_at: string;
  rater_name: string;
  title: string;
  title_en: string;
  title_ar: string;
};

type Subscription = {
  id: number;
  plan_name: string;
  tier: string;
  end_date: string;
  status: string;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 120,
      duration: 0.5,
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function VolunteerProfilePage() {
  const { lang } = useLang();
  const isRTL = lang === "ar";
  const t = profileTranslations[lang];
  const planT = lang === "ar" ? subscriptionTranslations.ar : subscriptionTranslations.en;

  const { data, refresh } = useLoggedInData();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [ratings, setRatings] = useState<RecentRating[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationalId, setNationalId] = useState("");

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [skillsRes, appsRes, ratingsRes, subRes] = await Promise.all([
        api.get(`/volunteer-skills/me`),
        api.get(`/volunteer-applications/me?limit=3`),
        api.get(`/ratings/target/me?limit=5`),
        api.get(`/subscriptions/me`),
      ]);

      setSkills(skillsRes.data);
      setRecentEvents(appsRes.data);
      setRatings(ratingsRes.data);
      setSubscription(subRes.data);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = async () => {
    setIsModalOpen(true);
    setFirstName(data?.first_name || "");
    setLastName(data?.last_name || "");
    setPhone(data?.phone || "");
    setDescription(data?.description || "");
    setGender(data?.gender || "");
    setDateOfBirth(data?.date_of_birth?.split("T")[0] || "");
    setNationalId(data?.national_id || "");
    setSelectedSkillIds(skills.map((s) => s.id));

    try {
      const response = await api.get(`/skills`);
      setAllSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch all skills", error);
    }
  };

  const toggleSkill = (id: number) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((skillId) => skillId !== id) : [...prev, id]
    );
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      const profilePayload = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        description: description,
        gender: gender,
        date_of_birth: dateOfBirth,
        national_id: nationalId,
      };

      await Promise.all([
        api.put(`/volunteers/me`, profilePayload),
        api.put(`/volunteer-skills/me`, { skill_ids: selectedSkillIds }),
      ]);

      setIsModalOpen(false);
      await fetchData();
      await refresh();

      Swal.fire({
        icon: "success",
        title: t.modal.successTitle,
        text: t.modal.successText,
        confirmButtonColor: "#febc5a",
        customClass: {
          popup: "rounded-3xl",
        },
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t.modal.errorTitle,
        text: error?.response?.data?.error || t.modal.errorText,
        confirmButtonColor: "#febc5a",
        customClass: {
          popup: "rounded-3xl",
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allSkills, searchTerm]);

  const daysRemaining = useMemo(() => {
    if (!subscription?.end_date) return null;
    const end = new Date(subscription.end_date);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [subscription]);

  const getActivePlanName = (sub: Subscription) => {
    return planT.plans.volunteer[sub.tier as 'PRO' | 'ELITE'] || sub.plan_name;
  };

  const subscriptionTheme = useMemo(() => {
    if (!subscription)
      return {
        color: "from-primary/80 to-primary",
        glow: "shadow-primary/30",
        icon: <FaCircleCheck className="text-white" />,
      };
    if (subscription.tier === "ELITE")
      return {
        color: "from-primary to-amber-500",
        glow: "shadow-primary/40",
        icon: <FaStar className="text-white" />,
      };
    return {
      color: "from-muted/60 to-muted/80",
      glow: "shadow-muted/20",
      icon: <FaCircleCheck className="text-white" />,
    };
  }, [subscription]);

  const initials = useMemo(() => {
    if (!data?.first_name) return "";
    const first = data.first_name.charAt(0);
    const last = data.last_name ? data.last_name.charAt(0) : "";
    return (first + last).toUpperCase();
  }, [data]);

  return (
    <div
      className="relative min-h-screen bg-background p-4 md:p-8 lg:p-12 overflow-hidden text-foreground selection:bg-primary/20"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Premium Ambient Background Meshes */}
      <div className="absolute top-[-10%] right-[-5%] -z-10 h-[600px] w-[600px] rounded-full bg-primary/10 dark:bg-primary/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[150px] opacity-50" />

      <div className="mx-auto max-w-6xl space-y-8">
        {/* HEADER PROFILE CARD */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2.5rem] bg-soft-bg/60 dark:bg-soft-bg/20 border border-foreground/15 p-8 md:p-12 group"
        >
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-50" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Avatar Profile */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary/40 to-transparent animate-spin-slow opacity-10 blur-xl" />
              <div className="relative h-32 w-32 md:h-44 md:w-44 rounded-full bg-background p-1.5 shadow-2xl border border-primary/20 dark:border-white/10">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-soft-bg dark:bg-soft-bg/20 text-4xl md:text-6xl font-black text-primary overflow-hidden">
                  {initials || <FaUser className="opacity-30 text-muted" />}
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute bottom-0 right-2 h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-gradient-to-br ${subscriptionTheme.color} p-0.5 shadow-lg ${subscriptionTheme.glow} flex items-center justify-center text-white border-2 border-background`}
              >
                {subscriptionTheme.icon}
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-start space-y-6 w-full">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                    {data?.first_name}{" "}
                    <span className="text-primary">{data?.last_name}</span>
                  </h1>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${subscriptionTheme.color} text-[10px] font-black uppercase tracking-[0.1em] text-white shadow-lg ${subscriptionTheme.glow}`}
                    >
                      {subscriptionTheme.icon}
                      <span>
                        {subscription ? getActivePlanName(subscription) : t.sections.basicPlan}
                      </span>
                      {daysRemaining !== null && (
                        <span className="opacity-80 border-l border-white/20 pl-2 ml-1 font-bold">
                          {daysRemaining} {t.sections.daysLeft}
                        </span>
                      )}
                    </div>
                    {data?.average_rating && (
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-soft-bg dark:bg-soft-bg/20 border border-primary/20 dark:border-white/5 text-primary font-black text-[10px] tracking-wider uppercase">
                        <FaStar size={12} className="mb-0.5" /> {data.average_rating}
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openModal}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-foreground text-background dark:bg-white dark:text-zinc-900 px-8 py-4 text-sm font-black uppercase tracking-widest shadow-2xl hover:shadow-primary/20 transition-all w-full md:w-auto"
                >
                  <FaPen size={12} /> {t.hero.editProfile}
                </motion.button>
              </div>

              {/* Contact Tags */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs font-bold text-muted">
                <div className="flex items-center gap-2.5 py-2.5 px-5 rounded-xl bg-soft-bg dark:bg-soft-bg/10 border border-primary/5 dark:border-white/5 transition-colors hover:border-primary/20">
                  <FaEnvelope className="text-primary opacity-60" /> {data?.email}
                </div>
                {data?.phone && (
                  <div className="flex items-center gap-2.5 py-2.5 px-5 rounded-xl bg-soft-bg dark:bg-soft-bg/10 border border-primary/5 dark:border-white/5 transition-colors hover:border-primary/20">
                    <FaPhone className="text-primary opacity-60" /> {data?.phone}
                  </div>
                )}
                <div className="flex items-center gap-2.5 py-2.5 px-5 rounded-xl bg-soft-bg dark:bg-soft-bg/10 border border-primary/5 dark:border-white/5 transition-colors hover:border-primary/20">
                  <FaClock className="text-primary opacity-60" /> {t.hero.memberSince}{" "}
                  {data?.created_at
                    ? new Date(data.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')
                    : "..."}
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  {skills.slice(0, 8).map((skill) => (
                    <motion.span
                      key={skill.id}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm hover:bg-primary/10 transition-colors"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                  {skills.length > 8 && (
                    <span className="px-4 py-2 rounded-xl bg-soft-bg dark:bg-soft-bg/20 border border-primary/5 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-muted">
                      +{skills.length - 8}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* STATS BENTO GRID */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Total Events */}
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-[2.5rem] bg-soft-bg/60 dark:bg-soft-bg/20 border border-foreground/15 p-8 md:p-12 shadow-xl shadow-primary/5 group hover:-translate-y-2 transition-all duration-500"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/10">
                <FaCalendarCheck size={26} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                  {t.sections.totalEvents}
                </span>
                <div className="text-5xl font-black text-foreground tracking-tighter">
                  {data?.total_attended || 0}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Earnings */}
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-[2.5rem] bg-soft-bg/60 dark:bg-soft-bg/20 border border-foreground/15 p-8 md:p-12 shadow-xl shadow-emerald-500/5 group hover:-translate-y-2 transition-all duration-500"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:-rotate-12 transition-all duration-500 shadow-lg shadow-emerald-500/10">
                <FaWallet size={26} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                  {t.sections.totalEarnings}
                </span>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-black text-foreground tracking-tighter">
                    {data?.total_earnings?.toLocaleString() || "0"}
                  </span>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                    EGP
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Average Rating */}
          <motion.div
            variants={fadeUp}
            onClick={() => setIsReviewsModalOpen(true)}
            className="relative overflow-hidden rounded-[2.5rem] bg-soft-bg/60 dark:bg-soft-bg/20 border border-foreground/15 p-8 md:p-12 shadow-xl shadow-amber-500/5 group hover:-translate-y-2 hover:border-amber-500/30 transition-all duration-500 cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="h-16 w-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-amber-500/10 relative">
                <FaStar size={26} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                  {t.sections.rating}
                </span>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-5xl font-black text-foreground tracking-tighter">
                    {data?.average_rating || "0.0"}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={12}
                        className={
                          i < Math.floor(data?.average_rating || 0)
                            ? "text-amber-500"
                            : "text-muted/20"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                {t.sections.viewReviews}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* MAIN CONTENT GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bio Section */}
          <div className="lg:col-span-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-[2.5rem] bg-soft-bg/60 dark:bg-soft-bg/20 border border-foreground/15 p-8 md:p-12 shadow-2xl shadow-primary/5 h-full group"
            >
              <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-4 uppercase tracking-tighter">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <FaUser size={20} />
                </div>
                {t.sections.bio}
              </h3>
              <p className="text-foreground/80 leading-loose text-base md:text-xl font-medium">
                {data?.description || (
                  <span className="italic opacity-40 font-normal">{t.sections.noBio}</span>
                )}
              </p>
            </motion.div>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-1">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-soft-bg/60 dark:bg-soft-bg/20 border border-foreground/15 p-8 md:p-12 shadow-2xl shadow-primary/5 h-full flex flex-col group"
            >
              <h3 className="text-xl font-black text-foreground mb-10 flex items-center gap-4 uppercase tracking-tighter">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <FaCalendarCheck size={20} />
                </div>
                {t.sections.recentActivity}
              </h3>

              <div className="space-y-10 flex-1 relative">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event, idx) => (
                    <div key={event.id} className="relative flex gap-6 group/item">
                      {idx !== recentEvents.length - 1 && (
                        <div className="absolute left-[19px] top-10 bottom-[-42px] w-[2px] bg-gradient-to-b from-primary/30 to-transparent" />
                      )}
                      <div
                        className={`h-10 w-10 rounded-2xl border-2 flex items-center justify-center z-10 shrink-0 bg-background transition-all duration-300 group-hover/item:scale-110 ${event.status === "attended"
                          ? "border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20"
                          : "border-primary text-primary shadow-lg shadow-primary/20"
                          }`}
                      >
                        {event.status === "attended" ? (
                          <FaCircleCheck size={14} />
                        ) : (
                          <FaClock size={14} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className="text-base font-black text-foreground line-clamp-1 group-hover/item:text-primary transition-colors">
                          {isRTL
                            ? event.title_ar || event.title
                            : event.title_en || event.title}
                        </p>
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-1.5 opacity-60">
                          {event.created_at
                            ? new Date(event.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : "..."}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <FaLayerGroup size={40} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {t.sections.noActivity}
                    </p>
                  </div>
                )}
              </div>

              <Link
                href="/volunteer/applications"
                className="block pt-8 mt-10 border-t border-primary/5"
              >
                <motion.button
                  whileHover={{ x: isRTL ? -10 : 10 }}
                  className="w-full flex items-center justify-center gap-4 text-[10px] font-black text-primary hover:text-primary/80 transition-all uppercase tracking-[0.3em]"
                >
                  {t.sections.viewHistory}
                  <FaArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t.modal.title}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                {t.modal.firstName}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                {t.modal.lastName}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                {t.modal.gender}
              </label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none appearance-none"
                >
                  <option value="" disabled>
                    {t.modal.gender}
                  </option>
                  <option value="male">{t.sections.male}</option>
                  <option value="female">{t.sections.female}</option>
                </select>
                <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-muted ${isRTL ? 'left-4' : 'right-4'}`}>
                  <FaPen size={10} className="opacity-40" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                {t.modal.birthDate}
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                {t.modal.phone}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                {t.modal.nationalId}
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">
                {t.modal.bio}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t.modal.skills}
              </h3>
              <p className="text-xs text-muted mt-1">{t.modal.selectSkills}</p>
            </div>

            <div className="relative group">
              <FaMagnifyingGlass
                className={`absolute top-1/2 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary ${isRTL ? "right-4" : "left-4"
                  }`}
              />
              <input
                type="text"
                placeholder={t.modal.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-xl border border-foreground/10 bg-foreground/5 py-4 text-sm font-bold text-foreground transition-all focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"
                  }`}
              />
            </div>

            <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pt-1 pb-2 custom-scrollbar">
              {filteredSkills.map((skill) => {
                const isSelected = selectedSkillIds.includes(skill.id);
                return (
                  <motion.button
                    key={skill.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(skill.id)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 border ${isSelected
                      ? "bg-primary text-white shadow-md border-primary"
                      : "bg-foreground/5 text-muted border-transparent hover:border-primary/50 hover:bg-foreground/10"
                      }`}
                  >
                    {skill.name}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-muted hover:bg-foreground/5 transition-colors"
            >
              {t.modal.cancel}
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-70 min-w-[120px]"
            >
              {isSaving ? <div className="scale-75"><Spinner /></div> : t.modal.save}
            </button>
          </div>
        </div>
      </Modal>

      {/* REVIEWS MODAL */}
      <Modal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        title={t.sections.reviews}
        maxWidth="max-w-2xl"
      >
        {(() => {
          const avgRating = ratings.length
            ? ratings.reduce((s, r) => s + r.rating_value, 0) / ratings.length
            : 0;
          const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          ratings.forEach(r => { ratingCounts[r.rating_value] = (ratingCounts[r.rating_value] || 0) + 1; });

          const [modalFilter, setModalFilter] = React.useState<number | null>(null);
          const visibleReviews = modalFilter ? ratings.filter(r => r.rating_value === modalFilter) : ratings;

          return (
            <div className="space-y-6 py-4">
              {ratings.length > 0 && (
                <>
                  {/* Stats row */}
                  <div className="grid grid-cols-5 gap-3">
                    {/* Average */}
                    <div className="col-span-2 flex flex-col items-center justify-center p-5 rounded-[2rem] bg-foreground text-background text-center gap-1 relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/10 blur-2xl" />
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 relative z-10">{isRTL ? "متوسط" : "Avg Rating"}</p>
                      <p className="text-5xl font-black tabular-nums relative z-10">{avgRating.toFixed(1)}</p>
                      <div className="flex gap-0.5 relative z-10">
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} size={10} className={s <= Math.round(avgRating) ? "text-amber-400" : "text-white/20"} />
                        ))}
                      </div>
                      <p className="text-[9px] opacity-30 font-bold relative z-10">{ratings.length} {isRTL ? "تقييم" : "reviews"}</p>
                    </div>

                    {/* Breakdown bars */}
                    <div className="col-span-3 flex flex-col justify-center gap-1.5 p-4 rounded-[2rem] border border-foreground/10 bg-foreground/5">
                      {[5,4,3,2,1].map(star => {
                        const count = ratingCounts[star] || 0;
                        const pct = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-[10px] font-black w-3 tabular-nums">{star}</span>
                            <FaStar size={8} className="text-amber-400 shrink-0" />
                            <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.6, delay: (5 - star) * 0.08 }}
                                className="h-full rounded-full bg-amber-400"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-muted w-4 text-right tabular-nums">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Star filter pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setModalFilter(null)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${!modalFilter ? 'bg-foreground text-background border-foreground' : 'border-foreground/10 text-muted hover:border-foreground/30'}`}
                    >
                      {isRTL ? "الكل" : "All"}
                    </button>
                    {[5,4,3,2,1].map(s => (
                      <button
                        key={s}
                        onClick={() => setModalFilter(modalFilter === s ? null : s)}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${modalFilter === s ? 'bg-amber-400 text-black border-amber-400' : 'border-foreground/10 text-muted hover:border-amber-400/40'}`}
                      >
                        {s} <FaStar size={9} />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Reviews list */}
              <div className="space-y-4">
                {visibleReviews.length > 0 ? (
                  visibleReviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-[2rem] border border-foreground/10 bg-foreground/5 p-6 shadow-xl shadow-primary/5 group/review transition-all hover:scale-[1.01] hover:border-primary/20"
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-base shadow-inner shrink-0">
                            {review.rater_name?.charAt(0) || "C"}
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground">
                              {review.rater_name || "Company"}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mt-0.5 opacity-70">
                              {isRTL ? review.title_ar || review.title : review.title_en || review.title}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                size={12}
                                className={i < review.rating_value ? "text-amber-400" : "text-muted/20"}
                              />
                            ))}
                          </div>
                          <p className="text-[9px] font-bold text-muted opacity-50">
                            {new Date(review.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm font-medium text-foreground/70 leading-relaxed mt-3 italic pl-4 border-l-2 border-primary/20">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 border border-foreground/10 bg-foreground/5 rounded-[2rem]">
                    <FaStar size={32} className="text-muted mb-4 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                      {t.sections.noReviews}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

    </div>
  );
}