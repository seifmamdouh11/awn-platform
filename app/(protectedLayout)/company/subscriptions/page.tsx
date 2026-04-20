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
  Stars,
  TrendingUp,
  Lock,
  BadgeCheck
} from "lucide-react";
import Swal from "sweetalert2";
import { SubscriptionPlan, UserSubscription } from "@/app/type/subscription";
import { subscriptionTranslations } from "@/app/translations/subscriptions";

const TIER_ORDER: Record<string, number> = {
  PRO: 1,
  ELITE: 2,
};

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
    upgrade: "Upgrade Plan",
    currentPlan: "Current Plan",
    downgradeBlocked: "Downgrade unavailable",
    upgradeSection: "Upgrade available",
    insufficient: "Insufficient balance",
    success: "Plan activated successfully!",
    upgradeSuccess: "Plan upgraded successfully!",
    benefits: {
      commission: "Reduced Commission",
      featured: "Featured Posts",
      priority: "Priority Application Review",
      unlimited: "Unlimited Featured Posts"
    },
    confirmTitle: "Activate subscription?",
    confirmUpgradeTitle: "Upgrade Plan?",
    confirmText: "Activate {plan} for {price} EGP? This will be deducted from your wallet balance.",
    confirmUpgradeText: "Upgrade to {plan} for {price} EGP? Your current plan will be replaced.",
    cancel: "Cancel",
    confirm: "Yes, Activate",
    confirmUpgrade: "Yes, Upgrade",
    walletBalance: "Available Balance",
    errorTitle: "Error",
    fallbackError: "Failed to activate plan",
    mostAdvanced: "Most Advanced",
    perCycle: "EGP / Cycle",
    addFunds: "Add Funds"
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
    upgrade: "ترقية الخطة",
    currentPlan: "خطتك الحالية",
    downgradeBlocked: "الخفض غير متاح",
    upgradeSection: "ترقية متاحة",
    insufficient: "الرصيد غير كافٍ",
    success: "تم تفعيل الخطة بنجاح!",
    upgradeSuccess: "تم ترقية الخطة بنجاح!",
    benefits: {
      commission: "عمولة مخفضة",
      featured: "فرص مميزة",
      priority: "مراجعة ذات أولوية للطلبات",
      unlimited: "فرص مميزة غير محدودة"
    },
    confirmTitle: "تأكيد الاشتراك؟",
    confirmUpgradeTitle: "ترقية الخطة؟",
    confirmText: "تفعيل {plan} مقابل {price} جنيه؟ سيتم خصم المبلغ من رصيد محفظتك.",
    confirmUpgradeText: "الترقية إلى {plan} مقابل {price} جنيه؟ سيتم استبدال خطتك الحالية.",
    cancel: "إلغاء",
    confirm: "نعم، تفعيل",
    confirmUpgrade: "نعم، ارقِّ",
    walletBalance: "الرصيد المتاح",
    errorTitle: "خطأ",
    fallbackError: "فشل تفعيل الخطة",
    mostAdvanced: "الأكثر تميزاً",
    perCycle: "ج.م / دورة",
    addFunds: "إضافة رصيد"
  }
};

export default function CompanySubscriptionsPage() {
  const { lang } = useLang();
  const t = lang === "ar" ? translations.ar : translations.en;
  const planT = lang === "ar" ? subscriptionTranslations.ar : subscriptionTranslations.en;
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
      const resPlans = await api.get("/subscriptions/plans");
      const resMe = await api.get("/subscriptions/me");
      await api.get("/companies/me");
      const resWallet = await api.get("/company-wallet/me");

      const sub = resMe.data;
      setPlans(resPlans.data);
      setActiveSub(sub);
      setBalance(Number(resWallet.data.balance || 0));

      // Auto-select billing tab to match the active subscription's cycle
      if (sub) {
        const days = Math.round(
          (new Date(sub.end_date).getTime() - new Date(sub.start_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        setBillingCycle(days <= 60 ? 'monthly' : 'annual');
      }
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute the active subscription's billing cycle from its date range
  const activeSubDays = activeSub
    ? Math.round(
        (new Date(activeSub.end_date).getTime() - new Date(activeSub.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;
  const isActiveMonthly = activeSubDays <= 60;

  const getPlanStatus = (plan: SubscriptionPlan): 'current' | 'upgrade' | 'downgrade' | 'new' => {
    if (!activeSub) return 'new';
    const planLevel = TIER_ORDER[plan.tier] ?? 0;
    const activeLevel = TIER_ORDER[activeSub.tier] ?? 0;
    const planIsMonthly = plan.duration_days <= 31;

    // Exact match: same tier AND same billing cycle as active sub
    if (plan.tier === activeSub.tier && planIsMonthly === isActiveMonthly) return 'current';

    // Higher tier = always upgrade (regardless of cycle)
    if (planLevel > activeLevel) return 'upgrade';

    // Lower tier = always downgrade
    if (planLevel < activeLevel) return 'downgrade';

    // Same tier, different cycle
    if (plan.tier === activeSub.tier) {
      if (!planIsMonthly && isActiveMonthly) return 'upgrade';  // monthly → annual ✅
      if (planIsMonthly && !isActiveMonthly) return 'downgrade'; // annual → monthly 🔒
    }

    return 'new';
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    const status = getPlanStatus(plan);
    const isUpgrade = status === 'upgrade';

    if (balance < plan.price) {
      return Swal.fire({
        icon: "warning",
        title: t.insufficient,
        text: `${t.walletBalance}: ${balance.toLocaleString()} ${isRTL ? 'ج.م' : 'EGP'}`,
        showCancelButton: true,
        confirmButtonText: t.addFunds,
        cancelButtonText: t.cancel,
        confirmButtonColor: "#FA8112",
      }).then((result) => {
        if (result.isConfirmed) window.location.href = '/company/wallet';
      });
    }

    const planDisplayName = getPlanName(plan);
    const { isConfirmed } = await Swal.fire({
      title: isUpgrade ? t.confirmUpgradeTitle : t.confirmTitle,
      text: (isUpgrade ? t.confirmUpgradeText : t.confirmText)
        .replace("{plan}", planDisplayName)
        .replace("{price}", Number(plan.price).toLocaleString()),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isUpgrade ? t.confirmUpgrade : t.confirm,
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
        title: isUpgrade ? t.upgradeSuccess : t.success,
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

  const getPlanName = (plan: SubscriptionPlan) => {
    return planT.plans.company[plan.tier as 'PRO' | 'ELITE'] || plan.name;
  };

  const getPlanDescription = (plan: SubscriptionPlan) => {
    return planT.plans.company.descriptions[plan.tier as 'PRO' | 'ELITE'] || plan.description;
  };

  const getActivePlanName = (sub: UserSubscription) => {
    return planT.plans.company[sub.tier as 'PRO' | 'ELITE'] || sub.plan_name;
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredPlans = plans.filter(p =>
    p.user_type === 'company' &&
    (billingCycle === "monthly" ? p.duration_days <= 31 : p.duration_days > 31)
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
            <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-[100px] transition-opacity group-hover:opacity-40" />
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Crown size={160} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                  <ShieldCheck size={20} className="text-primary" />
                  {t.activeSub}
                </div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter">{getActivePlanName(activeSub)}</h2>
                <div className="flex items-center gap-3 text-sm font-bold opacity-50">
                  <Clock size={16} />
                  {t.expiresOn}: {new Date(activeSub.end_date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                </div>
                {/* Upgrade hint badge */}
                {activeSub.tier !== 'ELITE' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp size={12} />
                    {t.upgradeSection}
                  </div>
                )}
              </div>
              <div className="bg-white/5 backdrop-blur-2xl px-6 sm:px-10 py-6 sm:py-8 rounded-3xl md:rounded-[3rem] border-2 border-white/5 flex flex-col items-center shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">{t.walletBalance}</p>
                <p className="text-4xl font-black tabular-nums">{balance.toLocaleString()} <span className="text-sm opacity-50">{isRTL ? 'ج.م' : 'EGP'}</span></p>
                <button
                  onClick={() => window.location.href = '/company/wallet'}
                  className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
                >
                  {t.addFunds} <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billing Toggle – always visible */}
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

      {/* Pricing Grid – always visible */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto pb-12">
        {filteredPlans.map((plan) => {
          const status = getPlanStatus(plan);
          const isCurrent = status === 'current';
          const isDowngrade = status === 'downgrade';
          const isUpgrade = status === 'upgrade';

          return (
            <motion.div
              key={plan.id}
              whileHover={!isCurrent && !isDowngrade ? { y: -12 } : {}}
              className={`flex flex-col p-12 rounded-[4.5rem] border-2  transition-all relative overflow-hidden group
                ${isCurrent
                  ? 'bg-primary/5 border-primary/30 dark:border-primary/50'
                  : isDowngrade
                    ? 'bg-foreground/[0.02] border-dashed border-muted/20 dark:border-white/5 opacity-50'
                    : 'bg-white dark:bg-soft-bg/20 border-muted/10 dark:border-white/5 hover:border-primary/40'
                }`}
            >
              {/* Badge labels */}
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-bl-[2.5rem] shadow-lg flex items-center gap-2">
                  <BadgeCheck size={14} />
                  {t.currentPlan}
                </div>
              )}
              {isUpgrade && !isCurrent && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-bl-[2.5rem] shadow-lg flex items-center gap-2">
                  <TrendingUp size={14} />
                  {t.upgrade}
                </div>
              )}
              {plan.tier === "ELITE" && !activeSub && (
                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] px-10 py-4 rounded-bl-[2.5rem] shadow-lg">
                  {t.mostAdvanced}
                </div>
              )}

              <div className="space-y-10 flex-1">
                <div className="space-y-4">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border-2 ${isCurrent ? 'bg-primary/10 text-primary border-primary/20' : 'bg-primary/5 text-primary border-primary/10'}`}>
                    {plan.tier === "PRO" ? <Percent size={32} /> : <Stars size={32} />}
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter">{getPlanName(plan)}</h3>
                  <p className="text-sm text-muted font-bold uppercase tracking-widest leading-relaxed">{getPlanDescription(plan)}</p>
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
                {isCurrent ? (
                  <div className="w-full py-6 rounded-[2.5rem] bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-2 border-primary/20">
                    <BadgeCheck size={20} />
                    {t.currentPlan}
                  </div>
                ) : isDowngrade ? (
                  <div className="w-full py-6 rounded-[2.5rem] bg-foreground/5 text-foreground/30 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 cursor-not-allowed border-2 border-dashed border-foreground/10">
                    <Lock size={16} />
                    {t.downgradeBlocked}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!submitting}
                    className={`w-full py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.95] disabled:opacity-50 flex items-center justify-center gap-3 group
                      ${isUpgrade
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                      }`}
                  >
                    {submitting === plan.id ? <Loader2 size={24} className="animate-spin" /> : (
                      <>
                        {isUpgrade ? (
                          <><TrendingUp size={18} />{t.upgrade}</>
                        ) : (
                          <>{t.subscribe}<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>
                        )}
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Wallet Balance Card */}
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
