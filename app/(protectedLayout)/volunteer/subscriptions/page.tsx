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
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";
import { SubscriptionPlan, UserSubscription } from "@/app/type/subscription";

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
    insufficient: "Insufficient balance",
    success: "Subscription successful!",
    alreadySubscribed: "You are already a PRO member",
    benefits: {
      withdrawal: "0% Withdrawal Fees",
      priority: "Priority Support",
      badge: "PRO Volunteer Badge",
      earlyAccess: "Early Access to Big Events"
    },
    confirmTitle: "Confirm Subscription",
    confirmText: "Are you sure you want to subscribe to {plan} for {price} EGP?",
    cancel: "Cancel",
    confirm: "Yes, Subscribe",
    walletBalance: "Wallet Balance"
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
    insufficient: "الرصيد غير كافٍ",
    success: "تم الاشتراك بنجاح!",
    alreadySubscribed: "أنت مشترك بالفعل في فئة PRO",
    benefits: {
      withdrawal: "0% مصاريف سحب",
      priority: "دعم فني ذو أولوية",
      badge: "شارة متطوع PRO",
      earlyAccess: "وصول مبكر للفرص الكبيرة"
    },
    confirmTitle: "تأكيد الاشتراك",
    confirmText: "هل أنت متأكد من رغبتك في الاشتراك في {plan} بمبلغ {price} جنيه؟",
    cancel: "إلغاء",
    confirm: "نعم، اشترك",
    walletBalance: "رصيد المحفظة"
  }
};

export default function SubscriptionsPage() {
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
      // Fetching sequentially to avoid Promises "damaging" the code logic per user request
      const resPlans = await api.get("/subscriptions/plans");
      const resMe = await api.get("/subscriptions/me");
      const resProfile = await api.get("/volunteers/me");
      
      setPlans(resPlans.data);
      setActiveSub(resMe.data);
      setBalance(Number(resProfile.data.balance || 0));
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
        text: `${t.walletBalance}: ${balance} EGP`
      });
    }

    const { isConfirmed } = await Swal.fire({
      title: t.confirmTitle,
      text: t.confirmText.replace("{plan}", plan.name).replace("{price}", plan.price.toString()),
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
        title: t.success,
        timer: 2000,
        showConfirmButton: false
      });
      
      fetchData();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to subscribe"
      });
    } finally {
      setSubmitting(null);
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
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#febc5a]/10 border border-[#febc5a]/20 text-[#d97706] text-xs font-black uppercase tracking-widest"
        >
          <Sparkles size={14} />
          {t.viewPlans}
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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
                <h2 className="text-4xl font-black">{activeSub.plan_name}</h2>
                <div className="flex items-center gap-2 text-sm font-bold opacity-80">
                  <Clock size={16} />
                  {t.expiresOn}: {new Date(activeSub.end_date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}
                </div>
              </div>
              <div className="bg-black/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
                <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{t.walletBalance}</p>
                <p className="text-2xl font-black">{balance.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeSub && (
        <>
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
            {filteredPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -10 }}
                className="flex flex-col p-8 rounded-[3rem] bg-background border border-foreground/5 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
              >
                {plan.tier === "ELITE" && (
                  <div className="absolute top-0 right-0 bg-[#febc5a] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl">
                    Popular
                  </div>
                )}

                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <div className="p-3 bg-foreground/5 rounded-2xl inline-block text-[#d97706]">
                      <Zap size={24} />
                    </div>
                    <h3 className="text-2xl font-black">{plan.name}</h3>
                    <p className="text-sm text-foreground/50 font-medium leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter">{Number(plan.price).toLocaleString()}</span>
                    <span className="text-sm font-bold text-foreground/40">{lang === 'ar' ? 'ج.م' : 'EGP'} / {t.monthly.toLowerCase()}</span>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-foreground/5">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.withdrawal}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.priority}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-foreground/70">{t.benefits.badge}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={!!submitting}
                    className="w-full py-5 rounded-[2rem] bg-foreground text-background font-black text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group-hover:bg-[#febc5a] group-hover:text-black"
                  >
                    {submitting === plan.id ? <Loader2 size={18} className="animate-spin" /> : (
                      <>
                        {t.subscribe}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
            
            {/* Empty/Incentive Card if only 1 plan */}
            {filteredPlans.length === 1 && (
              <div className="hidden lg:flex flex-col p-8 rounded-[3rem] bg-foreground/[0.02] border border-dashed border-foreground/10 items-center justify-center text-center space-y-4 opacity-40">
                <Wallet size={48} />
                <p className="font-bold text-sm">More tiers coming soon</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Wallet Balance Info Card */}
      {!activeSub && (
        <div className="max-w-md mx-auto p-6 rounded-[2.5rem] bg-foreground/5 border border-foreground/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-foreground/10 rounded-2xl text-foreground/60">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{t.walletBalance}</p>
              <p className="font-black">{balance.toLocaleString()} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/volunteer/wallet'}
            className="text-[#d97706] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            Add Funds
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
