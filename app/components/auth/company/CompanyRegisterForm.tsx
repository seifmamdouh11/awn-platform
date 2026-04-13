"use client";

import React, { useState } from "react";
import api from "@/app/utils/api";
import { useForm } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import { GrSecure } from "react-icons/gr";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Building2 } from "lucide-react";

type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

type FormValues = {
  company_name: string;
  industry?: string;
  description?: string;
  company_size: CompanySize;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
  website?: string;
  city?: string;
  address?: string;
  tax_id?: string;
  logo_url?: string;
};

export default function CompanyRegisterForm() {
  const router = useRouter();
  const { lang } = useLang();
  const t = translations[lang];

  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
  const phoneRegex = /^[0-9+\-\s]{8,20}$/;
  const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  const urlRegex =
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      company_size: "1-10",
    },
  });

  const password = watch("password");
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isRTL = lang === "ar";

  const inputBase =
    "w-full h-12 rounded-2xl border bg-foreground/[0.03] px-4 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all";
  const inputIdle =
    "border-foreground/10 focus:border-[#febc5a]/60 focus:ring-2 focus:ring-[#febc5a]/15";
  const inputError =
    "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

  const textareaBase =
    "w-full rounded-2xl border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-all resize-none";
  const textareaIdle =
    "border-foreground/10 focus:border-[#febc5a]/60 focus:ring-2 focus:ring-[#febc5a]/15";
  const textareaError =
    "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    setLoading(true);

    const { confirm_password, ...payload } = data;

    const cleanedPayload = {
      ...payload,
      industry: payload.industry?.trim() || null,
      description: payload.description?.trim() || null,
      website: payload.website?.trim() || null,
      city: payload.city?.trim() || null,
      address: payload.address?.trim() || null,
      tax_id: payload.tax_id?.trim() || null,
      logo_url: payload.logo_url?.trim() || null,
    };

    try {
      await api.post("/companies/register", cleanedPayload);

      await Swal.fire({
        title: t.successTitle,
        text: t.successText,
        icon: "success",
        confirmButtonText: t.ok,
      });

      router.push("/login/company");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        t.somethingWentWrong;

      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const companyList = t.cardList.company;
  const badges = t.badges;

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
            <Building2 size={20} className="text-black" />
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
              {t.badge}
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              {t.headline}
            </h1>
            <p className="text-white/60 text-base leading-7 max-w-sm">
              {t.subheadline}
            </p>
          </motion.div>

          <div className="mt-10 space-y-5">
            {companyList.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 text-white/80"
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.1, duration: 0.5 }}
              >
                <div className="h-6 w-6 rounded-full bg-[#febc5a]/20 flex items-center justify-center shrink-0">
                  <FaCheck size={10} className="text-[#febc5a]" />
                </div>
                <span className="text-sm font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer badges */}
        <div className="relative z-10 border-t border-white/10 pt-6 flex flex-wrap gap-4">
          {badges.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-white/50 text-xs">
              <span className="text-[#febc5a] text-lg">{item.icon}</span>
              <span>{item.badge}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-background relative max-h-screen overflow-y-auto w-full">
        <Link
          href="/home"
          className={`absolute top-6 md:top-8 ${isRTL ? 'right-6 md:right-8' : 'left-6 md:left-8'} flex items-center gap-2 text-sm font-semibold text-foreground/50 hover:text-foreground transition z-10`}
        >
          <ArrowLeft size={16} className={isRTL ? "rotate-180" : ""} />
          {t.goHome}
        </Link>
        <div className="w-full max-w-[640px] my-auto py-12 md:px-8">
          <motion.form
            className="space-y-10"
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Header */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {t.formTitle}
              </h3>
              <p className="text-sm text-foreground/60">
                {t.formSubtitle}
              </p>
            </motion.div>

            {/* Server error */}
            {serverError && (
              <motion.div
                className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                {serverError}
              </motion.div>
            )}

            {/* Company information */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              viewport={{ once: true }}
            >
              <div className="pb-1">
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">
                  {t.sections.companyInfo}
                </h4>
              </div>

              {/* Company name / industry */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="company_name"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.companyName}
                      <span className="text-red-500 ms-1">*</span>
                    </label>

                    {errors.company_name && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.company_name.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="company_name"
                    placeholder={t.placeholders.companyName}
                    className={`${inputBase} ${errors.company_name ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("company_name", {
                      required: t.errors.required,
                      minLength: {
                        value: 2,
                        message: t.errors.min2,
                      },
                    })}
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="industry"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.industry}
                    </label>

                    {errors.industry && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.industry.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="industry"
                    placeholder={t.placeholders.industry}
                    className={`${inputBase} ${errors.industry ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("industry", {
                      minLength: {
                        value: 2,
                        message: t.errors.min2,
                      },
                    })}
                  />
                </motion.div>
              </div>

              {/* Company size / tax id */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="company_size"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.companySize}
                      <span className="text-red-500 ms-1">*</span>
                    </label>

                    {errors.company_size && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.company_size.message}
                      </p>
                    )}
                  </div>

                  <motion.select
                    id="company_size"
                    className={`${inputBase} ${errors.company_size ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("company_size", {
                      required: t.errors.required,
                    })}
                  >
                    <option value="1-10">{t.companySize["1-10"]}</option>
                    <option value="11-50">{t.companySize["11-50"]}</option>
                    <option value="51-200">{t.companySize["51-200"]}</option>
                    <option value="201-500">{t.companySize["201-500"]}</option>
                    <option value="500+">{t.companySize["500+"]}</option>
                  </motion.select>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="tax_id"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.taxId}
                    </label>

                    {errors.tax_id && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.tax_id.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="tax_id"
                    placeholder={t.placeholders.taxId}
                    className={`${inputBase} ${errors.tax_id ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("tax_id", {
                      minLength: {
                        value: 3,
                        message: t.errors.taxIdMin,
                      },
                    })}
                  />
                </motion.div>
              </div>

              {/* Description */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-foreground/85"
                  >
                    {t.formElements.description}
                  </label>

                  {errors.description && (
                    <p className="text-xs font-medium text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <motion.textarea
                  id="description"
                  rows={5}
                  placeholder={t.placeholders.description}
                  className={`${textareaBase} ${errors.description ? textareaError : textareaIdle}`}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  {...register("description", {
                    minLength: {
                      value: 10,
                      message: t.errors.descriptionMin,
                    },
                  })}
                />
              </motion.div>
            </motion.div>

            {/* Contact details */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.16 }}
              viewport={{ once: true }}
            >
              <div className="border-t border-foreground/10 pt-5">
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">
                  {t.sections.contact}
                </h4>
              </div>

              {/* Email / phone */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.email}
                      <span className="text-red-500 ms-1">*</span>
                    </label>

                    {errors.email && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="email"
                    type="email"
                    placeholder={t.placeholders.email}
                    className={`${inputBase} ${errors.email ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("email", {
                      required: t.errors.required,
                      pattern: {
                        value: emailRegex,
                        message: t.errors.invalidEmail,
                      },
                    })}
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="phone"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.phone}
                      <span className="text-red-500 ms-1">*</span>
                    </label>

                    {errors.phone && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="phone"
                    placeholder={t.placeholders.phone}
                    className={`${inputBase} ${errors.phone ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("phone", {
                      required: t.errors.required,
                      pattern: {
                        value: phoneRegex,
                        message: t.errors.invalidPhone,
                      },
                    })}
                  />
                </motion.div>
              </div>

              {/* Website / logo url */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="website"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.website}
                    </label>

                    {errors.website && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.website.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="website"
                    placeholder={t.placeholders.website}
                    className={`${inputBase} ${errors.website ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("website", {
                      pattern: {
                        value: urlRegex,
                        message: t.errors.invalidWebsite,
                      },
                    })}
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="logo_url"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.logoUrl}
                    </label>

                    {errors.logo_url && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.logo_url.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="logo_url"
                    placeholder={t.placeholders.logoUrl}
                    className={`${inputBase} ${errors.logo_url ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("logo_url", {
                      pattern: {
                        value: urlRegex,
                        message: t.errors.invalidLogoUrl,
                      },
                    })}
                  />
                </motion.div>
              </div>

              {/* City / address */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="city"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.city}
                    </label>

                    {errors.city && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="city"
                    placeholder={t.placeholders.city}
                    className={`${inputBase} ${errors.city ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("city", {
                      minLength: {
                        value: 2,
                        message: t.errors.min2,
                      },
                    })}
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="address"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.address}
                    </label>

                    {errors.address && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="address"
                    placeholder={t.placeholders.address}
                    className={`${inputBase} ${errors.address ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("address", {
                      minLength: {
                        value: 3,
                        message: t.errors.addressMin,
                      },
                    })}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="border-t border-foreground/10 pt-5">
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">
                  {t.sections.security}
                </h4>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.password}
                      <span className="text-red-500 ms-1">*</span>
                    </label>

                    {errors.password && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="password"
                    type="password"
                    placeholder={t.placeholders.password}
                    className={`${inputBase} ${errors.password ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("password", {
                      required: t.errors.required,
                      validate: (v) => strongPass.test(v) || t.errors.strongPassword,
                    })}
                  />

                  <p className="text-xs text-foreground/50">
                    {t.helper.password}
                  </p>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="confirm_password"
                      className="text-sm font-semibold text-foreground/85"
                    >
                      {t.formElements.confirmPassword}
                      <span className="text-red-500 ms-1">*</span>
                    </label>

                    {errors.confirm_password && (
                      <p className="text-xs font-medium text-red-500">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>

                  <motion.input
                    id="confirm_password"
                    type="password"
                    placeholder={t.placeholders.confirmPassword}
                    className={`${inputBase} ${errors.confirm_password ? inputError : inputIdle}`}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    {...register("confirm_password", {
                      required: t.errors.required,
                      validate: (value) =>
                        value === password || t.errors.passwordsMismatch,
                    })}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              className="space-y-3 pt-2"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.24 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#febc5a] to-[#d97706] text-black text-sm font-bold shadow-lg shadow-[#febc5a]/20 transition hover:shadow-[#febc5a]/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <><span className="h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />{t.loading}</>
                ) : (
                  <>{t.createAccount}</>
                )}
              </motion.button>

              <p className="text-center text-sm text-foreground/60">
                <Link
                  className="font-medium underline underline-offset-4 transition hover:text-foreground"
                  href="/login/company"
                >
                  {t.haveAccount}
                </Link>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

const translations = {
  en: {
    badge: "Company Portal",
    headline: "Create your company account",
    subheadline:
      "Join the platform to publish opportunities, manage applicants, and build your company presence.",
    formTitle: "Create company account",
    formSubtitle: "Fill in your company details to submit your registration request.",
    sections: {
      companyInfo: "Company information",
      contact: "Contact details",
      security: "Security",
    },
    cardList: {
      company: [
        "Publish volunteering opportunities",
        "Manage applicants in one place",
        "Build your company profile",
        "Track your engagement and activity",
      ],
    },
    badges: [
      { badge: "Secure signup", icon: <GrSecure /> },
      { badge: "Reviewed accounts", icon: <AiOutlineSafetyCertificate /> },
    ],
    formElements: {
      companyName: "Company name",
      industry: "Industry",
      description: "Description",
      companySize: "Company size",
      phone: "Phone",
      email: "Company email",
      website: "Website",
      city: "City",
      address: "Address",
      taxId: "Tax ID",
      logoUrl: "Logo URL",
      password: "Password",
      confirmPassword: "Confirm password",
    },
    companySize: {
      "1-10": "1 - 10 employees",
      "11-50": "11 - 50 employees",
      "51-200": "51 - 200 employees",
      "201-500": "201 - 500 employees",
      "500+": "500+ employees",
    },
    placeholders: {
      companyName: "Enter your company name",
      industry: "Enter your industry",
      description: "Tell us about your company",
      phone: "Enter your company phone number",
      email: "Enter your company email",
      website: "Enter your website URL",
      city: "Enter your city",
      address: "Enter your company address",
      taxId: "Enter your tax ID",
      logoUrl: "Enter your logo URL",
      password: "Create a password",
      confirmPassword: "Re-enter your password",
    },
    helper: {
      password:
        "8+ chars, include uppercase, lowercase, number, and special character.",
    },
    errors: {
      required: "This field is required",
      invalidEmail: "Enter a valid email address",
      invalidPhone: "Enter a valid phone number",
      invalidWebsite: "Enter a valid website URL",
      invalidLogoUrl: "Enter a valid logo URL",
      min2: "Minimum 2 characters",
      addressMin: "Address must be at least 3 characters",
      taxIdMin: "Tax ID must be at least 3 characters",
      strongPassword: "Password must be strong (A/a/0/special, 8+ chars)",
      passwordsMismatch: "Passwords do not match",
      descriptionMin: "Write at least 10 characters",
    },
    haveAccount: "Already have a company account? Login",
    createAccount: "Create account",
    loading: "Creating...",
    successTitle: "Request received",
    successText:
      "We received your company account request and it will be reviewed shortly.",
    ok: "Ok",
    somethingWentWrong: "Something went wrong",
    goHome: "Back to Home",
  },
  ar: {
    badge: "بوابة الشركات",
    headline: "أنشئ حساب شركتك",
    subheadline:
      "انضم إلى المنصة لنشر الفرص وإدارة المتقدمين وبناء حضور شركتك على المنصة.",
    formTitle: "إنشاء حساب شركة",
    formSubtitle: "املأ بيانات الشركة لإرسال طلب التسجيل.",
    sections: {
      companyInfo: "بيانات الشركة",
      contact: "بيانات التواصل",
      security: "الأمان",
    },
    cardList: {
      company: [
        "انشر الفرص التطوعية بسهولة",
        "تابع المتقدمين في مكان واحد",
        "ابنِ ملفًا احترافيًا لشركتك",
        "تابع نشاط شركتك على المنصة",
      ],
    },
    badges: [
      { badge: "تسجيل آمن", icon: <GrSecure /> },
      { badge: "حسابات تحت المراجعة", icon: <AiOutlineSafetyCertificate /> },
    ],
    formElements: {
      companyName: "اسم الشركة",
      industry: "المجال",
      description: "وصف الشركة",
      companySize: "حجم الشركة",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني للشركة",
      website: "الموقع الإلكتروني",
      city: "المدينة",
      address: "العنوان",
      taxId: "الرقم الضريبي",
      logoUrl: "رابط الشعار",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
    },
    companySize: {
      "1-10": "1 - 10 موظفين",
      "11-50": "11 - 50 موظف",
      "51-200": "51 - 200 موظف",
      "201-500": "201 - 500 موظف",
      "500+": "500+ موظف",
    },
    placeholders: {
      companyName: "اكتب اسم الشركة",
      industry: "اكتب مجال الشركة",
      description: "اكتب نبذة عن الشركة",
      phone: "اكتب رقم هاتف الشركة",
      email: "اكتب البريد الإلكتروني للشركة",
      website: "اكتب رابط الموقع الإلكتروني",
      city: "اكتب المدينة",
      address: "اكتب عنوان الشركة",
      taxId: "اكتب الرقم الضريبي",
      logoUrl: "اكتب رابط الشعار",
      password: "أنشئ كلمة مرور",
      confirmPassword: "أعد كتابة كلمة المرور",
    },
    helper: {
      password: "٨+ أحرف وتشمل حرف كبير وصغير ورقم ورمز.",
    },
    errors: {
      required: "هذا الحقل مطلوب",
      invalidEmail: "اكتب بريد إلكتروني صحيح",
      invalidPhone: "اكتب رقم هاتف صحيح",
      invalidWebsite: "اكتب رابط موقع صحيح",
      invalidLogoUrl: "اكتب رابط شعار صحيح",
      min2: "اقل شيء حرفين",
      addressMin: "العنوان يجب أن يكون 3 أحرف على الأقل",
      taxIdMin: "الرقم الضريبي يجب أن يكون 3 أحرف على الأقل",
      strongPassword:
        "كلمة المرور لازم تكون قوية (8+ وحروف كبيرة وصغيرة ورقم ورمز)",
      passwordsMismatch: "كلمتا المرور غير متطابقتين",
      descriptionMin: "اكتب 10 حروف على الأقل",
    },
    haveAccount: "عندك حساب شركة؟ سجل دخول",
    createAccount: "إنشاء حساب",
    loading: "جاري الإنشاء...",
    successTitle: "تم استلام الطلب",
    successText: "استلمنا طلب إنشاء حساب الشركة وسيتم مراجعته قريبًا.",
    ok: "حسناً",
    somethingWentWrong: "حدث خطأ ما",
    goHome: "العودة للرئيسية",
  },
} as const;