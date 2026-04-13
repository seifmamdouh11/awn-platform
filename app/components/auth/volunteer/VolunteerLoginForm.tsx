"use client";

import React, { useState } from "react";
import api from "@/app/utils/api";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Heart, ArrowRight, ArrowLeft, ShieldAlert } from "lucide-react";

type FormValues = {
  email: string;
  password: string;
};

export default function VolunteerLoginForm() {
  const router = useRouter();
  const { lang } = useLang();
  const t = translations[lang];

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isRTL = lang === "ar";

  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  React.useEffect(() => {
    if (errorParam === "suspended") {
      Swal.fire({
        icon: "warning",
        title: t.sessionSuspendedTitle,
        text: t.sessionSuspendedText,
        confirmButtonColor: "#febc5a",
        confirmButtonText: t.ok,
      });
      // Clear URL params
      router.replace("/login/volunteer");
    }
  }, [errorParam, router, t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const res = await api.post("/volunteers/login", data);
      const token = res.data?.token;
      if (!token) throw new Error("Token was not returned from server");
      localStorage.setItem("token", token);
      await Swal.fire({ icon: "success", title: t.success, confirmButtonText: t.ok });
      router.replace("/volunteer/home");
    } catch (error: any) {
      const status = error?.response?.status;
      const serverErr = String(error?.response?.data?.error || error?.response?.data?.message || "").trim();
      const code =
        serverErr === "Account is pending approval" ? "UNDER_REVIEW"
        : serverErr === "Account is blocked" ? "BLOCKED"
        : status === 401 || serverErr === "Invalid credentials" ? "INVALID_CREDENTIALS"
        : status === 400 ? "MISSING_FIELDS"
        : "UNKNOWN";

      const fireMap: Record<string, object> = {
        UNDER_REVIEW: { icon: "info", title: t.underReviewTitle, text: t.underReviewText },
        BLOCKED: { icon: "error", title: t.blockedTitle, text: t.blockedText },
        INVALID_CREDENTIALS: { icon: "error", title: t.invalidCredentials },
        MISSING_FIELDS: { icon: "warning", title: t.missingFieldsTitle, text: t.missingFieldsText },
        UNKNOWN: { icon: "error", title: t.loginFailed, text: t.tryAgain },
      };
      await Swal.fire({ ...fireMap[code], confirmButtonText: t.ok } as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen flex">
      {/* ── LEFT HERO PANEL ── */}
      <motion.div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] p-12"
        initial={{ x: isRTL ? 60 : -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#febc5a]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#febc5a]/10 blur-3xl" />
        </div>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#febc5a] to-[#d97706] flex items-center justify-center shadow-lg shadow-[#febc5a]/20">
            <Heart size={20} className="text-black" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">AWN</span>
        </div>

        {/* Central content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#febc5a]/30 bg-[#febc5a]/10 px-4 py-2 text-sm font-semibold text-[#febc5a]">
              {t.heroEyebrow}
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-white/60 text-base leading-7 max-w-sm">
              {t.heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            {t.stats.map((stat, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-[#febc5a]">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-sm text-white/40 italic">{t.heroQuote}</p>
        </div>
      </motion.div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-background relative">
        <Link
          href="/home"
          className={`absolute top-6 md:top-8 ${isRTL ? 'right-6 md:right-8' : 'left-6 md:left-8'} flex items-center gap-2 text-sm font-semibold text-foreground/50 hover:text-foreground transition`}
        >
          <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
          {t.goHome}
        </Link>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#febc5a] to-[#d97706] flex items-center justify-center">
              <Heart size={16} className="text-black" />
            </div>
            <span className="font-black text-foreground text-lg">AWN</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-foreground tracking-tight">{t.headline}</h2>
            <p className="mt-2 text-sm text-foreground/55 leading-6">{t.subheadline}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="vol-email" className="text-sm font-semibold text-foreground/80">
                {t.formElements.email}<span className="text-[#febc5a] ms-1">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className={`absolute top-1/2 -translate-y-1/2 text-foreground/35 ${isRTL ? "right-4" : "left-4"}`} />
                <input
                  id="vol-email"
                  type="email"
                  placeholder={t.placeholders.email}
                  className={`w-full h-12 rounded-2xl border bg-foreground/[0.03] text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all ${isRTL ? "pr-11 pl-4" : "pl-11 pr-4"} ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-foreground/10 focus:border-[#febc5a]/60 focus:ring-2 focus:ring-[#febc5a]/15"
                  }`}
                  {...register("email", {
                    required: t.errors.required,
                    pattern: {
                      value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
                      message: t.errors.invalidEmail,
                    },
                  })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="vol-password" className="text-sm font-semibold text-foreground/80">
                {t.formElements.password}<span className="text-[#febc5a] ms-1">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className={`absolute top-1/2 -translate-y-1/2 text-foreground/35 ${isRTL ? "right-4" : "left-4"}`} />
                <input
                  id="vol-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.placeholders.password}
                  className={`w-full h-12 rounded-2xl border bg-foreground/[0.03] text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all ${isRTL ? "pr-11 pl-11" : "pl-11 pr-11"} ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-foreground/10 focus:border-[#febc5a]/60 focus:ring-2 focus:ring-[#febc5a]/15"
                  }`}
                  {...register("password", { required: t.errors.required })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className={`absolute top-1/2 -translate-y-1/2 text-foreground/35 hover:text-foreground/60 transition ${isRTL ? "left-4" : "right-4"}`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#febc5a] to-[#d97706] text-black text-sm font-bold shadow-lg shadow-[#febc5a]/20 transition hover:shadow-[#febc5a]/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />{t.loading}</>
              ) : (
                <>{t.login}<ArrowRight size={16} className={isRTL ? "rotate-180" : ""} /></>
              )}
            </motion.button>

            {/* Links */}
            <div className="space-y-3 text-center pt-2">
              <p className="text-sm text-foreground/50">
                <Link href="/register/volunteer" className="font-semibold text-foreground/70 hover:text-foreground underline underline-offset-4 transition">
                  {t.haveAccount}
                </Link>
              </p>
              <p className="text-sm text-foreground/40">
                {t.switchAccount}{" "}
                <Link href="/login/company" className="font-semibold text-[#febc5a] hover:text-[#d97706] transition">
                  {t.switchAccountLink}
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

const translations = {
  en: {
    heroEyebrow: "Volunteer Portal",
    heroTitle: "Make an impact,\none step at a time.",
    heroSubtitle: "Discover meaningful volunteer opportunities, track your journey, and connect with communities that matter.",
    heroQuote: "\"Volunteering is the ultimate exercise in democracy.\"",
    stats: [
      { value: "500+", label: "Opportunities" },
      { value: "10K+", label: "Volunteers" },
      { value: "200+", label: "Events" },
      { value: "50+", label: "Partners" },
    ],
    headline: "Welcome back 👋",
    subheadline: "Sign in to your volunteer account to continue your journey",
    formElements: { email: "Email address", password: "Password" },
    placeholders: { email: "you@example.com", password: "Enter your password" },
    errors: { required: "This field is required", invalidEmail: "Enter a valid email address" },
    haveAccount: "Don't have an account? Register",
    switchAccount: "Are you a company?",
    switchAccountLink: "Company login →",
    login: "Sign in",
    loading: "Signing in...",
    success: "Login successful",
    loginFailed: "Login failed",
    ok: "Ok",
    underReviewTitle: "Under Review",
    underReviewText: "Your account is pending approval. Please try again later.",
    blockedTitle: "Account blocked",
    blockedText: "Your account has been blocked. Contact support.",
    invalidCredentials: "Invalid email or password",
    missingFieldsTitle: "Missing information",
    missingFieldsText: "Please enter your email and password.",
    tryAgain: "Please try again later.",
    goHome: "Back to Home",
    sessionSuspendedTitle: "Session Terminated",
    sessionSuspendedText: "Your account is no longer active. You have been logged out for security reasons.",
  },
  ar: {
    heroEyebrow: "بوابة المتطوع",
    heroTitle: "اصنع فارقاً،\nخطوة بخطوة.",
    heroSubtitle: "اكتشف فرص تطوع حقيقية، تابع رحلتك، وتواصل مع مجتمعات تستحق.",
    heroQuote: "«التطوع هو الممارسة الحقيقية للإنسانية.»",
    stats: [
      { value: "+500", label: "فرصة" },
      { value: "+10K", label: "متطوع" },
      { value: "+200", label: "حدث" },
      { value: "+50", label: "شريك" },
    ],
    headline: "أهلاً بعودتك 👋",
    subheadline: "سجّل دخولك لمواصلة رحلتك التطوعية",
    formElements: { email: "البريد الإلكتروني", password: "كلمة المرور" },
    placeholders: { email: "you@example.com", password: "اكتب كلمة المرور" },
    errors: { required: "هذا الحقل مطلوب", invalidEmail: "اكتب بريد إلكتروني صحيح" },
    haveAccount: "ليس لديك حساب؟ أنشئ حساباً",
    switchAccount: "هل أنت شركة؟",
    switchAccountLink: "← دخول الشركات",
    login: "تسجيل الدخول",
    loading: "جارٍ التسجيل...",
    success: "تم تسجيل الدخول بنجاح",
    loginFailed: "فشل تسجيل الدخول",
    ok: "حسناً",
    underReviewTitle: "قيد المراجعة",
    underReviewText: "حسابك لسه تحت المراجعة. جرّب تاني لاحقًا.",
    blockedTitle: "الحساب محظور",
    blockedText: "تم حظر حسابك. تواصل مع الدعم.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    missingFieldsTitle: "بيانات ناقصة",
    missingFieldsText: "من فضلك اكتب البريد الإلكتروني وكلمة المرور.",
    tryAgain: "حاول مرة أخرى لاحقًا.",
    goHome: "العودة للرئيسية",
    sessionSuspendedTitle: "انتهت الجلسة",
    sessionSuspendedText: "حسابك لم يعد نشطاً حالياً. تم تسجيل خروجك لأسباب أمنية.",
  },
} as const;