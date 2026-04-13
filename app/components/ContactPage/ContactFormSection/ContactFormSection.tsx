"use client";

import React from "react";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { motion } from "framer-motion";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactFormSection() {
  const { lang } = useLang();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const content = {
    en: {
      badge: "Get In Touch",
      title: "Let’s talk about your ideas",
      desc: "Have a question, suggestion, or partnership idea? Send us a message and we’ll get back to you as soon as possible.",
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      placeholderName: "Enter your full name",
      placeholderEmail: "Enter your email",
      placeholderSubject: "What is this about?",
      placeholderMessage: "Write your message here...",
      button: "Send Message",
      sending: "Sending...",
      required: "This field is required",
      invalidEmail: "Please enter a valid email",
      successTitle: "Message Sent!",
      successText: "Your message has been sent successfully.",
      errorTitle: "Error",
      errorText: "Something went wrong. Please try again.",
      contactTitle: "Contact Information",
      emailLabel: "Email",
      phoneLabel: "Phone",
      locationLabel: "Location",
      emailValue: "support@example.com",
      phoneValue: "+20 100 123 4567",
      locationValue: "Egypt",
    },
    ar: {
      badge: "تواصل معنا",
      title: "دعنا نتحدث عن أفكارك",
      desc: "هل لديك سؤال أو اقتراح أو فكرة شراكة؟ أرسل لنا رسالة وسنقوم بالرد عليك في أقرب وقت ممكن.",
      name: "الاسم بالكامل",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      placeholderName: "أدخل اسمك بالكامل",
      placeholderEmail: "أدخل بريدك الإلكتروني",
      placeholderSubject: "بماذا يتعلق الموضوع؟",
      placeholderMessage: "اكتب رسالتك هنا...",
      button: "إرسال الرسالة",
      sending: "جارٍ الإرسال...",
      required: "هذا الحقل مطلوب",
      invalidEmail: "من فضلك أدخل بريدًا إلكترونيًا صحيحًا",
      successTitle: "تم الإرسال!",
      successText: "تم إرسال رسالتك بنجاح.",
      errorTitle: "خطأ",
      errorText: "حدث خطأ ما. حاول مرة أخرى.",
      contactTitle: "معلومات التواصل",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "الهاتف",
      locationLabel: "الموقع",
      emailValue: "support@example.com",
      phoneValue: "+20 100 123 4567",
      locationValue: "مصر",
    },
  };

  const t = content[lang];

  const inputClass =
    "mt-2 w-full rounded-2xl border border-foreground/10 bg-background/80 px-4 py-3.5 text-sm outline-none transition placeholder:text-foreground/35 focus:border-primary focus:ring-4 focus:ring-foreground/10";

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await api.post("/contact", data);

      await Swal.fire({
        icon: "success",
        title: t.successTitle,
        text: res.data?.message || t.successText,
        confirmButtonColor: "#6366f1",
      });

      reset();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t.errorTitle,
        text: error?.response?.data?.message || t.errorText,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-foreground/[0.03] py-14 sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-foreground/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8">
              <span className="inline-flex rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70 sm:px-4 sm:text-sm">
                {t.badge}
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                {t.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-foreground/70 sm:text-base">
                {t.desc}
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: <FaEnvelope />,
                    label: t.emailLabel,
                    value: t.emailValue,
                  },
                  {
                    icon: <FaPhone />,
                    label: t.phoneLabel,
                    value: t.phoneValue,
                  },
                  {
                    icon: <FaLocationDot />,
                    label: t.locationLabel,
                    value: t.locationValue,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.08,
                    }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    className="flex items-start gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm text-foreground/65">
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8 lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    {t.name}
                    {errors.name && (
                      <span className="ms-2 text-xs text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={t.placeholderName}
                    className={inputClass}
                    {...register("name", {
                      required: t.required,
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {t.email}
                    {errors.email && (
                      <span className="ms-2 text-xs text-red-500">
                        {errors.email.message}
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    placeholder={t.placeholderEmail}
                    className={inputClass}
                    {...register("email", {
                      required: t.required,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t.invalidEmail,
                      },
                    })}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium">
                  {t.subject}
                  {errors.subject && (
                    <span className="ms-2 text-xs text-red-500">
                      {errors.subject.message}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder={t.placeholderSubject}
                  className={inputClass}
                  {...register("subject", {
                    required: t.required,
                  })}
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium">
                  {t.message}
                  {errors.message && (
                    <span className="ms-2 text-xs text-red-500">
                      {errors.message.message}
                    </span>
                  )}
                </label>
                <textarea
                  rows={7}
                  placeholder={t.placeholderMessage}
                  className={`${inputClass} min-h-[160px] resize-none`}
                  {...register("message", {
                    required: t.required,
                  })}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-6 text-foreground/55 sm:text-sm">
                  {lang === "ar"
                    ? "سنقوم بمراجعة رسالتك والرد عليك في أقرب وقت ممكن."
                    : "We’ll review your message and get back to you as soon as possible."}
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex cursor-pointer rounded-2xl bg-foreground px-6 py-3.5 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
                >
                  {isSubmitting ? t.sending : t.button}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}