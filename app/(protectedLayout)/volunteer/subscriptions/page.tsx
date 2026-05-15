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
  TrendingUp,
  Lock,
  BadgeCheck
} from "lucide-react";
import Swal from "sweetalert2";
import { SubscriptionPlan, UserSubscription } from "@/app/type/subscription";
import { subscriptionTranslations } from "@/app/translations/subscriptions";

const TIER_ORDER: Record<string, number> = {
  SILVER: 1,
  GOLD: 2,
};

const translations = {
  en: {
    title: "Premium Tiers",
    subtitle: "Unlock exclusive benefits and maximize your impact",
    activeSub: "Active Subscription",
    expiresOn: "Expires on",
    viewPlans: "Upgrade to PRO",
    monthly: "Monthly",
    annual: "Annual",
    subscribe: "Subscribe Now",
    upgrade: "Upgrade Plan",
    currentPlan: "Current Plan",
    downgradeBlocked: "Downgrade unavailable",
    upgradeAvailable: "Upgrade available below",
    insufficient: "Insufficient balance",
    success: "Subscription successful!",
    alreadySubscribed: "You are already a PRO member",
    fallbackError: "Something went wrong, please try again",
    currency: "EGP",
    benefits: {
      withdrawal: "0% Withdrawal Fees",
      priority: "Priority Support",
      badge: "Pro Badge",
      earlyAccess: "Early Access to Big Events",
      support247: "24/7 Support",
      priorityApps: "Priority in Applications"
    },
    confirmTitle: "Confirm Subscription",
    confirmText: "Are you sure you want to subscribe to {plan} for {price} EGP?",
    upgradeText: "You are upgrading to {plan}. A credit for your remaining days will be applied automatically.",
    cancel: "Cancel",
    confirm: "Yes, Subscribe",
    walletBalance: "Wallet Balance",
    deposit: {
      title: "Add Funds to Wallet",
      subtitle: "Top up your balance to unlock premium features",
      amountLabel: "Deposit Amount",
      methodLabel: "Payment Method",
      refPlaceholder: "Reference ID (Last 6 digits)",
      notesLabel: "Notes",
      submit: "Confirm Deposit",
      success: "Deposit request submitted! Please wait for admin approval.",
      successInstant: "Funds added successfully via PayPal!",
      methods: {
        wallet: "Mobile Wallet",
        paypal: "PayPal",
        bank: "Bank Transfer"
      },
      info: {
        bank: "Transfer to: AWN Foundation\nBank: CIB Egypt\nIBAN: EG0010002000300040005000",
        wallet: "Send to Vodafone Cash: 01012345678"
      },
      minDeposit: "Minimum deposit is 50 EGP",
      addFunds: "Add Funds",
      addFundsConfirm: "Would you like to add funds?",
      failed: "Failed to subscribe"
    },
    popular: "Popular",
    comingSoon: "More tiers coming soon"
  },
  ar: {
    title: "عضويات مميزة",
    subtitle: "افتح مزايا حصرية وضاعف تأثيرك",
    activeSub: "اشتراك نشط",
    expiresOn: "ينتهي في",
    viewPlans: "ترقية إلى PRO",
    monthly: "شهري",
    annual: "سنوي",
    subscribe: "اشترك الآن",
    upgrade: "ترقية الخطة",
    currentPlan: "خطتك الحالية",
    downgradeBlocked: "الخفض غير متاح",
    upgradeAvailable: "ترقية متاحة أدناه",
    insufficient: "الرصيد غير كافٍ",
    success: "تم الاشتراك بنجاح!",
    alreadySubscribed: "أنت مشترك بالفعل في فئة PRO",
    fallbackError: "حدث خطأ ما، يرجى المحاولة مرة أخرى",
    currency: "ج.م",
    benefits: {
      withdrawal: "0% مصاريف سحب",
      priority: "دعم فني ذو أولوية",
      badge: "شارة المحترف",
      earlyAccess: "وصول مبكر للفرص الكبيرة",
      support247: "دعم فني 24/7",
      priorityApps: "أولوية في الطلبات"
    },
    confirmTitle: "تأكيد الاشتراك",
    confirmText: "هل أنت متأكد من رغبتك في الاشتراك في {plan} بمبلغ {price} جنيه؟",
    upgradeText: "سوف يتم ترقية حسابك إلى {plan}. سيتم خصم مبلغ الخطة ناقص رصيد الأيام المتبقية من اشتراكك الحالي.",
    cancel: "إلغاء",
    confirm: "نعم، اشترك",
    walletBalance: "رصيد المحفظة",
    deposit: {
      title: "شحن رصيد المحفظة",
      subtitle: "قم بزيادة رصيدك لتفعيل العضويات المميزة",
      amountLabel: "مبلغ الإيداع",
      methodLabel: "طريقة الدفع",
      refPlaceholder: "رقم المرجع (آخر 6 أرقام)",
      notesLabel: "ملاحظات",
      submit: "تأكيد الإيداع",
      success: "تم إرسال طلب الشحن! بانتظار مراجعة المسؤول.",
      successInstant: "تم شحن الرصيد بنجاح عبر PayPal!",
      methods: {
        wallet: "محفظة موبايل",
        paypal: "بايبال",
        bank: "تحويل بنكي"
      },
      info: {
        bank: "حول إلى: مؤسسة عون (AWN)\nالبنك: CIB مصر\nIBAN: EG0010002000300040005000",
        wallet: "حول إلى فودافون كاش: 01012345678"
      },
      minDeposit: "الحد الأدنى للإيداع هو 50 ج.م",
      addFunds: "إضافة رصيد",
      addFundsConfirm: "هل تود إضافة رصيد؟",
      failed: "فشل الاشتراك"
    },
    popular: "الأكثر مبيعاً",
    comingSoon: "المزيد من الفئات قريباً"
  }
};

export default function SubscriptionsPage() {
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

  // Deposit states
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState<"wallet" | "paypal" | "bank">("wallet");
  const [referenceId, setReferenceId] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const [submittingDeposit, setSubmittingDeposit] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resPlans = await api.get("/subscriptions/plans");
      const resMe = await api.get("/subscriptions/me");
      const resProfile = await api.get("/volunteers/me");

      const sub = resMe.data;
      setPlans(resPlans.data);
      setActiveSub(sub);
      setBalance(Number(resProfile.data.balance || 0));

      // Auto-select billing tab to match active sub's cycle
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
    const planLevel = TIER_ORDER[plan.tier?.toUpperCase()] ?? 0;
    const activeLevel = TIER_ORDER[activeSub.tier?.toUpperCase()] ?? 0;
    const planIsMonthly = plan.duration_days <= 31;

    // Exact match: same tier AND same cycle
    if (plan.tier?.toUpperCase() === activeSub.tier?.toUpperCase() && planIsMonthly === isActiveMonthly) return 'current';

    // Higher tier = always upgrade
    if (planLevel > activeLevel) return 'upgrade';

    // Lower tier = always downgrade
    if (planLevel < activeLevel) return 'downgrade';

    // Same tier, different cycle
    if (plan.tier?.toUpperCase() === activeSub.tier?.toUpperCase()) {
      if (!planIsMonthly && isActiveMonthly) return 'upgrade';  // monthly → annual ✅
      if (planIsMonthly && !isActiveMonthly) return 'downgrade'; // annual → monthly 🔒
    }

    return 'new';
  };

  const getPlanName = (plan: SubscriptionPlan) => {
    // @ts-ignore
    return planT.plans.volunteer.tiers[plan.tier] || plan.name;
  };

  const getPlanDescription = (plan: SubscriptionPlan) => {
    // @ts-ignore
    return planT.plans.volunteer.descriptions[plan.tier] || plan.description;
  };

  const getActivePlanName = (sub: UserSubscription) => {
    // @ts-ignore
    return planT.plans.volunteer.tiers[sub.tier] || sub.plan_name;
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    const status = getPlanStatus(plan);
    const isUpgrade = status === 'upgrade';

    if (balance < plan.price) {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: t.insufficient,
        text: `${t.walletBalance}: ${balance} ${t.currency}. ${t.deposit.addFundsConfirm}`,
        showCancelButton: true,
        confirmButtonText: t.deposit.addFunds,
        cancelButtonText: t.cancel,
        confirmButtonColor: "#febc5a",
      });
      if (isConfirmed) {
        setDepositAmount((plan.price - balance).toString());
        setDepositOpen(true);
      }
      return;
    }

    const planDisplayName = getPlanName(plan);
    const confirmMessage = isUpgrade 
      ? t.upgradeText.replace("{plan}", planDisplayName)
      : t.confirmText.replace("{plan}", planDisplayName).replace("{price}", plan.price.toString()) + ` ${t.currency}`;

    const { isConfirmed } = await Swal.fire({
      title: t.confirmTitle,
      text: confirmMessage,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t.confirm,
      cancelButtonText: t.cancel,
      confirmButtonColor: "#febc5a",
      cancelButtonColor: "#ef4444"
    });

    if (!isConfirmed) return;

    try {
      setSubmitting(plan.id);
      await api.post("/subscriptions/subscribe", { planId: plan.id });

      await Swal.fire({
        icon: "success",
        title: isUpgrade ? t.upgrade : t.success,
        timer: 2000,
        showConfirmButton: false
      });

      fetchData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || t.fallbackError
      });
    } finally {
      setSubmitting(null);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(depositAmount);
    if (val < 50) return Swal.fire({ icon: "error", title: t.deposit.minDeposit });

    try {
      setSubmittingDeposit(true);
      await api.post("/volunteer-wallet/deposit", {
        amount: val,
        method: depositMethod,
        reference_id: referenceId,
        user_notes: userNotes
      });

      await Swal.fire({
        icon: depositMethod === "paypal" ? "success" : "info",
        title: depositMethod === "paypal" ? t.deposit.successInstant : t.deposit.success,
        timer: 3000,
        showConfirmButton: false
      });

      setDepositOpen(false);
      setDepositAmount("");
      setReferenceId("");
      setUserNotes("");
      fetchData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || t.fallbackError
      });
    } finally {
      setSubmittingDeposit(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#febc5a]" />
      </div>
    );
  }

  const filteredPlans = plans.filter(p =>
    p.user_type === 'volunteer' &&
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
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#febc5a]/10 border border-[#febc5a]/20 text-[#d97706] text-xs font-black uppercase tracking-widest"
        >
          <Sparkles size={14} />
          {t.viewPlans}
        </motion.div>
        <h1 className="p-2 text-3xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {t.title}
        </h1>
        <p className="text-lg text-foreground/50 font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* Active Subscription Status */}
      <AnimatePresence>
        {activeSub && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[3rem] bg-gradient-to-br from-[#febc5a] to-[#d97706] text-black shadow-2xl shadow-[#febc5a]/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Crown size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest opacity-70">
                  <ShieldCheck size={16} />
                  {t.activeSub}
                </div>
                <h2 className="text-4xl font-black">{getActivePlanName(activeSub)}</h2>
                <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                  <Clock size={16} />
                  {t.expiresOn}: {new Date(activeSub.end_date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                </div>
                {activeSub.tier !== 'ELITE' && (
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-black/10 text-black text-[10px] font-black uppercase tracking-widest">
                    <TrendingUp size={11} />
                    {t.upgradeAvailable}
                  </div>
                )}
              </div>
              <div className="bg-black/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{t.walletBalance}</p>
                <p className="text-2xl font-black">{balance.toLocaleString()} {t.currency}</p>
                <button
                  onClick={() => setDepositOpen(true)}
                  className="mt-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  {t.deposit.addFunds} <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="p-1 bg-foreground/5 rounded-2xl flex items-center border border-foreground/5">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${billingCycle === "monthly" ? "bg-background shadow-lg text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
          >
            {t.monthly}
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${billingCycle === "annual" ? "bg-background shadow-lg text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
          >
            {t.annual}
            <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">-10%</span>
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {filteredPlans.map((plan) => {
          const status = getPlanStatus(plan);
          const isCurrent = status === 'current';
          const isDowngrade = status === 'downgrade';
          const isUpgrade = status === 'upgrade';

          return (
            <motion.div
              key={plan.id}
              whileHover={!isCurrent && !isDowngrade ? { y: -10 } : {}}
              className={`flex flex-col p-8 rounded-[3rem] border transition-all relative overflow-hidden group
                ${isCurrent
                  ? 'bg-[#febc5a]/5 border-[#febc5a]/40'
                  : isDowngrade
                  ? 'bg-foreground/[0.02] border-dashed border-foreground/10 opacity-50'
                  : 'bg-background border-foreground/5 shadow-xl hover:shadow-2xl'
                }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-[#febc5a] text-black text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-bl-3xl flex items-center gap-1.5">
                  <BadgeCheck size={12} />
                  {t.currentPlan}
                </div>
              )}
              {isUpgrade && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-bl-3xl flex items-center gap-1.5">
                  <TrendingUp size={12} />
                  {t.upgrade}
                </div>
              )}
              {!activeSub && plan.tier === "ELITE" && (
                <div className="absolute top-0 right-0 bg-[#febc5a] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl">
                  {t.popular}
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className={`p-3 rounded-2xl inline-block ${isCurrent ? 'bg-[#febc5a]/10 text-[#d97706]' : 'bg-foreground/5 text-[#d97706]'}`}>
                    <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-black">{getPlanName(plan)}</h3>
                  <p className="text-sm text-foreground/50 font-medium leading-relaxed">{getPlanDescription(plan)}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter">{Number(plan.price).toLocaleString()}</span>
                  <span className="text-sm font-bold text-foreground/40">{t.currency} / {billingCycle === 'monthly' ? t.monthly.toLowerCase() : t.annual.toLowerCase()}</span>
                </div>

                <div className="space-y-4 pt-4 border-t border-foreground/5">
                  {plan.benefits.withdrawal_fee === 0 && (
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.withdrawal}</span>
                    </div>
                  )}
                  {plan.benefits.pro_badge && (
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.badge}</span>
                    </div>
                  )}
                  {plan.benefits.support_24_7 && (
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.support247}</span>
                    </div>
                  )}
                  {plan.benefits.priority_applications && (
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.priorityApps}</span>
                    </div>
                  )}
                  {/* Fallback for old priority field */}
                  {plan.benefits.priority && !plan.benefits.support_24_7 && (
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.priority}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8">
                {isCurrent ? (
                  <div className="w-full py-5 rounded-[2rem] bg-[#febc5a]/10 text-[#d97706] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-[#febc5a]/30">
                    <BadgeCheck size={18} />
                    {t.currentPlan}
                  </div>
                ) : isDowngrade ? (
                  <div className="w-full py-5 rounded-[2rem] bg-foreground/5 text-foreground/30 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed border-2 border-dashed border-foreground/10">
                    <Lock size={16} />
                    {t.downgradeBlocked}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!submitting}
                    className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2
                      ${isUpgrade
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                        : 'bg-foreground text-background hover:opacity-90 group-hover:bg-[#febc5a] group-hover:text-black'
                      }`}
                  >
                    {submitting === plan.id ? <Loader2 size={18} className="animate-spin" /> : (
                      <>
                        {isUpgrade && <TrendingUp size={18} />}
                        {isUpgrade ? t.upgrade : t.subscribe}
                        {!isUpgrade && <ArrowRight size={18} />}
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredPlans.length === 1 && (
          <div className="hidden lg:flex flex-col p-8 rounded-[3rem] bg-foreground/[0.02] border border-dashed border-foreground/10 items-center justify-center text-center space-y-4 opacity-40">
            <Wallet size={48} />
            <p className="font-bold text-sm">{t.comingSoon}</p>
          </div>
        )}
      </div>

      {/* Wallet Balance Info Card */}
      <div className="max-w-md mx-auto p-6 rounded-[2.5rem] bg-foreground/5 border border-foreground/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-foreground/10 rounded-2xl text-foreground/60">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{t.walletBalance}</p>
            <p className="font-black">{balance.toLocaleString()} {t.currency}</p>
          </div>
        </div>
        <button
          onClick={() => setDepositOpen(true)}
          className="text-[#d97706] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1"
        >
          {t.deposit.addFunds}
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Quick Deposit Modal */}
      <AnimatePresence>
        {depositOpen && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDepositOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-background border border-foreground/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="p-8 border-b border-foreground/5 bg-gradient-to-br from-[#febc5a]/5 to-transparent">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-[#febc5a]/10 rounded-2xl text-[#d97706]"><Zap size={24} /></div>
                  <h2 className="text-2xl font-black">{t.deposit.title}</h2>
                </div>
                <p className="text-sm text-foreground/40 font-medium">{t.deposit.subtitle}</p>
              </div>

              <form onSubmit={handleDeposit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">{t.deposit.methodLabel}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["wallet", "paypal", "bank"] as const).map((m) => (
                      <button key={m} type="button" onClick={() => setDepositMethod(m)} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${depositMethod === m ? "border-[#febc5a] bg-[#febc5a]/10 text-[#d97706]" : "border-foreground/5 bg-foreground/5 text-foreground/40"}`}>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{t.deposit.methods[m]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {depositMethod !== "paypal" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 border-l-4 border-[#febc5a] pl-4 py-1">
                    <p className="text-[11px] font-bold text-foreground/60 whitespace-pre-line leading-relaxed">
                      {depositMethod === "bank" ? t.deposit.info.bank : t.deposit.info.wallet}
                    </p>
                    <input required value={referenceId} onChange={(e) => setReferenceId(e.target.value)} placeholder={t.deposit.refPlaceholder} className="w-full h-12 px-5 bg-foreground/5 border-none rounded-xl text-sm font-bold" />
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">{t.deposit.amountLabel}</label>
                  <input type="number" required min={50} value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} className="w-full h-16 px-6 bg-foreground/5 border border-foreground/5 rounded-2xl text-xl font-black focus:ring-2 focus:ring-[#febc5a]/50 outline-none" placeholder="0.00" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setDepositOpen(false)} className="flex-1 py-4 rounded-2xl border border-foreground/10 font-bold transition hover:bg-foreground/5">{t.cancel}</button>
                  <button type="submit" disabled={submittingDeposit} className="flex-[2] py-4 rounded-2xl bg-foreground text-background font-black flex items-center justify-center gap-2">
                    {submittingDeposit ? <Loader2 className="animate-spin w-5 h-5" /> : t.deposit.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
