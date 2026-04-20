"use client";

import React, { useState, useEffect } from "react";
import api from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import {
  Check,
  Sparkles,
  Crown,
  Zap,
  Wallet,
  Clock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Building2,
  Percent,
  Stars
} from "lucide-react";
import Swal from "sweetalert2";
import { SubscriptionPlan, UserSubscription } from "@/app/type/subscription";

const translations = {
  en: {
    title: "Business Growth Plans",
    subtitle: "Scale your recruitment and reduce platform overhead",
    activeSub: "Active Plan",
    expiresOn: "Renews/Expires on",
    viewPlans: "Business Tiers",
    monthly: "Monthly Billing",
    annual: "Annual Billing (Save 10%)",
    subscribe: "Activate Plan",
    insufficient: "Insufficient balance",
    success: "Plan activated successfully!",
    benefits: {
      commission: "Reduced Commission",
      featured: "Featured Posts",
      priority: "Priority Application Review",
      unlimited: "Unlimited Featured Posts"
    },
    confirmTitle: "Activate subscription?",
    confirmText: "Activate {plan} for {price} EGP? This will be deducted from your wallet balance.",
    cancel: "Cancel",
    confirm: "Yes, Activate",
    walletBalance: "Available Balance",
    errorTitle: "Error",
    fallbackError: "Failed to activate plan",
    mostAdvanced: "Most Advanced",
    perCycle: "EGP / Cycle"
  },
  ar: {
    title: "خطط نمو الأعمال",
    subtitle: "وسع نطاق توظيفك وقلل التكاليف الإدارية",
    activeSub: "الخطة النشطة",
    expiresOn: "تنتهي في",
    viewPlans: "فئات الأعمال",
    monthly: "دفع شهري",
    annual: "دفع سنوي (خصم 10%)",
    subscribe: "تفعيل الخطة",
    insufficient: "الرصيد غير كافٍ",
    success: "تم تفعيل الخطة بنجاح!",
    benefits: {
      commission: "عمولة مخفضة",
      featured: "فرص مميزة",
      priority: "مراجعة ذات أولوية للطلبات",
      unlimited: "فرص مميزة غير محدودة"
    },
    confirmTitle: "تأكيد الاشتراك؟",
    confirmText: "تفعيل {plan} مقابل {price} جنيه؟ سيتم خصم المبلغ من رصيد محفظتك.",
    cancel: "إلغاء",
    confirm: "نعم، تفعيل",
    walletBalance: "الرصيد المتاح",
    errorTitle: "خطأ",
    fallbackError: "فشل تفعيل الخطة",
    mostAdvanced: "الأكثر تميزاً",
    perCycle: "ج.م / دورة"
  }
};

export default function CompanySubscriptionsPage() {
  const { lang } = useLang();
  const t = lang === "ar" ? translations.ar : translations.en;
  const isRTL = lang === "ar";

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeSub, setActiveSub] = useState<UserSubscription | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetching sequentially to avoid Promise "damage" per user preference
      const resPlans = await api.get("/subscriptions/plans");
      const resMe = await api.get("/subscriptions/me");
      const resProfile = await api.get("/companies/me"); // Note: Using companies/me for balance if available, or company-wallet/me
      const resWallet = await api.get("/company-wallet/me");

      setPlans(resPlans.data);
      setActiveSub(resMe.data);
      setBalance(Number(resWallet.data.balance || 0));
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (balance < plan.price) {
      return Swal.fire({
        icon: "error",
        title: t.insufficient,
        text: `${t.walletBalance}: ${balance} ${isRTL ? 'ج.م' : 'EGP'}`
      });
    }

    const { isConfirmed } = await Swal.fire({
      title: t.confirmTitle,
      text: t.confirmText.replace("{plan}", plan.name).replace("{price}", plan.price.toString()),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t.confirm,
      cancelButtonText: t.cancel,
      confirmButtonColor: "#FA8112",
      cancelButtonColor: "#ef4444"
    });

    if (!isConfirmed) return;

    try {
      setSubmitting(plan.id);
      await api.post("/subscriptions/subscribe", { planId: plan.id });

      await Swal.fire({
        icon: "success",
        title: t.success,
        timer: 2000,
        showConfirmButton: false
      });

      fetchData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: t.errorTitle,
        text: err.response?.data?.error || t.fallbackError
      });
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-[#FA8112]" />
      </div>
    );
  }

  const filteredPlans = plans.filter(p =>
    billingCycle === "monthly" ? p.duration_days <= 31 : p.duration_days > 31
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="relative overflow-hidden text-center space-y-6 max-w-4xl mx-auto mb-16 px-6">
        <motion.div
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border-2 border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <Building2 size={16} />
          {t.viewPlans}
        </motion.div>
        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground">
          {t.title}
        </h1>
        <p className="text-lg md:text-xl text-muted font-bold uppercase tracking-widest leading-loose opacity-60">
          {t.subtitle}
        </p>
      </div>

      {/* Active Subscription Status */}
      <AnimatePresence>
        {activeSub && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 md:p-14 rounded-[4rem] bg-foreground text-background shadow-2xl relative overflow-hidden group"
          >
            {/* Bento-style glow */}
            <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-[100px] transition-opacity group-hover:opacity-40" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                  <ShieldCheck size={20} className="text-primary" />
                  {t.activeSub}
                </div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter">{activeSub.plan_name}</h2>
                <div className="flex items-center gap-3 text-sm font-bold opacity-50">
                  <Clock size={16} />
                  {t.expiresOn}: {new Date(activeSub.end_date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-2xl px-6 sm:px-10 py-6 sm:py-8 rounded-3xl md:rounded-[3rem] border-2 border-white/5 flex flex-col items-center shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">{t.walletBalance}</p>
                <p className="text-4xl font-black tabular-nums">{balance.toLocaleString()} <span className="text-sm opacity-50">{isRTL ? 'ج.م' : 'EGP'}</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeSub && (
        <>
          {/* Billing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="p-2 bg-soft-bg dark:bg-foreground/5 rounded-[2rem] flex items-center border-2 border-muted/10 dark:border-white/5 shadow-inner">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-10 py-4 rounded-[1.75rem] text-[10px] uppercase tracking-[0.2em] font-black transition-all ${billingCycle === "monthly" ? "bg-white dark:bg-white/10 shadow-2xl text-foreground ring-1 ring-black/5" : "text-muted hover:text-foreground/60"}`}
              >
                {t.monthly}
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-10 py-4 rounded-[1.75rem] text-[10px] uppercase tracking-[0.2em] font-black transition-all ${billingCycle === "annual" ? "bg-white dark:bg-white/10 shadow-2xl text-foreground ring-1 ring-black/5" : "text-muted hover:text-foreground/60"}`}
              >
                {t.annual}
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto pb-12">
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -12 }}
                className="flex flex-col p-12 rounded-[4.5rem] bg-white dark:bg-soft-bg/20 border-2 border-muted/10 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-primary/40 transition-all relative overflow-hidden group"
              >
                {plan.tier === "ELITE" && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-bl-[2.5rem] shadow-lg">
                      {t.mostAdvanced}
                    </div>
                )}

                <div className="space-y-10 flex-1">
                  <div className="space-y-4">
                    <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border-2 border-primary/10">
                      {plan.tier === "PRO" ? <Percent size={32} /> : <Stars size={32} />}
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter">{plan.name}</h3>
                    <p className="text-sm text-muted font-bold uppercase tracking-widest leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter tabular-nums">{Number(plan.price).toLocaleString()}</span>
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">{t.perCycle}</span>
                  </div>

                  <div className="space-y-6 pt-10 border-t-2 border-muted/10 dark:border-white/5">
                    {Object.entries(plan.benefits).map(([key, val], idx) => {
                      let label = "";
                      if (key === 'commission_rate') label = `${t.benefits.commission}: ${val}%`;
                      if (key === 'featured_posts') label = val === -1 ? t.benefits.unlimited : `${val} ${t.benefits.featured}`;
                      if (!label) return null;

                      return (
                        <div key={idx} className="flex items-center gap-5">
                          <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <Check size={16} strokeWidth={4} />
                          </div>
                          <span className="text-sm font-black text-foreground/80 tracking-tight">{label}</span>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-5">
                      <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Check size={16} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-black text-foreground/80 tracking-tight">{t.benefits.priority}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-12">
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!submitting}
                    className="w-full py-6 rounded-[2.5rem] bg-primary text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-primary-hover shadow-xl shadow-primary/20 active:scale-[0.95] disabled:opacity-50 flex items-center justify-center gap-3 group"
                  >
                    {submitting === plan.id ? <Loader2 size={24} className="animate-spin" /> : (
                      <>
                        {t.subscribe}
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Wallet Balance Refresher */}
      {!activeSub && (
        <div className="max-w-2xl mx-auto p-10 rounded-[4rem] bg-white dark:bg-soft-bg/20 border-2 border-muted/10 dark:border-white/5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-primary/5 rounded-[2rem] text-primary border-2 border-primary/10">
              <Wallet size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-2">{t.walletBalance}</p>
              <p className="text-3xl font-black tabular-nums">{balance.toLocaleString()} <span className="text-sm opacity-50 uppercase tracking-widest ml-1">{isRTL ? 'ج.م' : 'EGP'}</span></p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/company/wallet'}
            className="group h-14 w-14 rounded-full border-2 border-muted/10 dark:border-white/5 flex items-center justify-center text-muted hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
