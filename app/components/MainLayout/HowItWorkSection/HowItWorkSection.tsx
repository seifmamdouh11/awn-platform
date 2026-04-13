"use client";

import React from "react";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { FaRegBuilding, FaRegUser } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function HowItWorkSection() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = translations[lang];

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden py-8 sm:py-20 lg:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            viewport={{ once: true }}
            className="text-3xl/tight font-bold text-foreground sm:text-4xl"
          >
            {t.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            viewport={{ once: true }}
            className="mt-4 text-base sm:text-lg text-pretty text-foreground/60"
          >
            {t.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2"
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Volunteer Card */}
          <motion.article
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl sm:p-8"
          >
            <motion.div
              whileHover={{ rotate: 4, scale: 1.06 }}
              transition={{ duration: 0.2 }}
              className="inline-flex rounded-2xl bg-foreground/5 p-3 text-foreground/80"
            >
              <FaRegUser size={24} />
            </motion.div>

            <h3 className="mt-4 text-xl font-bold uppercase tracking-wider text-foreground sm:text-2xl">
              {t.volunteer.title}
            </h3>
            <p className="mb-6 mt-2 text-sm text-foreground/60 sm:text-base">
              {t.volunteer.subtitle}
            </p>

            <motion.ol
              className="relative space-y-8"
              variants={stepsContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {t.volunteer.steps.map((step, index) => (
                <motion.li
                  key={index}
                  variants={stepItemVariants}
                  className="relative"
                >
                  {/* line */}
                  {index !== t.volunteer.steps.length - 1 && (
                    <span
                      className={`absolute top-7 ${
                        isArabic ? "right-[11px]" : "left-[11px]"
                      } h-[calc(100%-4px)] w-px bg-foreground/10`}
                    />
                  )}

                  {/* dot */}
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className={`absolute top-2 ${
                      isArabic ? "right-2" : "left-2"
                    } size-2 rounded-full bg-foreground`}
                  />

                  {/* content */}
                  <div
                    className={isArabic ? "pr-10 text-right" : "pl-10 text-left"}
                  >
                    <h4 className="text-sm font-bold uppercase tracking-wide text-foreground/50">
                      {t.stepLabel} {index + 1}
                    </h4>
                    <h5 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h5>
                    <p className="mt-1 text-sm leading-6 text-foreground/60">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </motion.article>

          {/* Company Card */}
          <motion.article
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-xl sm:p-8"
          >
            <motion.div
              whileHover={{ rotate: -4, scale: 1.06 }}
              transition={{ duration: 0.2 }}
              className="inline-flex rounded-2xl bg-foreground/5 p-3 text-foreground/80"
            >
              <FaRegBuilding size={24} />
            </motion.div>

            <h3 className="mt-4 text-xl font-bold uppercase tracking-wider text-foreground sm:text-2xl">
              {t.company.title}
            </h3>
            <p className="mb-6 mt-2 text-sm text-foreground/60 sm:text-base">
              {t.company.subtitle}
            </p>

            <motion.ol
              className="relative space-y-8"
              variants={stepsContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {t.company.steps.map((step, index) => (
                <motion.li
                  key={index}
                  variants={stepItemVariants}
                  className="relative"
                >
                  {/* line */}
                  {index !== t.company.steps.length - 1 && (
                    <span
                      className={`absolute top-7 ${
                        isArabic ? "right-[11px]" : "left-[11px]"
                      } h-[calc(100%-4px)] w-px bg-foreground/10`}
                    />
                  )}

                  {/* dot */}
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className={`absolute top-2 ${
                      isArabic ? "right-2" : "left-2"
                    } size-2 rounded-full bg-foreground`}
                  />

                  {/* content */}
                  <div
                    className={isArabic ? "pr-10 text-right" : "pl-10 text-left"}
                  >
                    <h4 className="text-sm font-bold uppercase tracking-wide text-foreground/50">
                      {t.stepLabel} {index + 1}
                    </h4>
                    <h5 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h5>
                    <p className="mt-1 text-sm leading-6 text-foreground/60">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

const cardsContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 36,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

const stepsContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const stepItemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

const translations = {
  en: {
    title: "How It Works",
    description:
      "A simple and clear process to help you get started — whether you're a volunteer or a company.",
    stepLabel: "Step",
    volunteer: {
      title: "For Volunteers",
      subtitle: "Start your journey and make an impact",
      steps: [
        {
          title: "Create your profile",
          description:
            "Build your profile in minutes and highlight your skills and interests.",
        },
        {
          title: "Discover opportunities",
          description:
            "Browse verified opportunities that match your interests and availability.",
        },
        {
          title: "Apply and participate",
          description:
            "Join opportunities, gain experience, and start making real impact.",
        },
      ],
    },
    company: {
      title: "For Companies",
      subtitle: "Find the right people for your impact",
      steps: [
        {
          title: "Post an opportunity",
          description:
            "Create and publish your opportunity in a few simple steps.",
        },
        {
          title: "Receive applications",
          description:
            "Get applications from motivated and qualified volunteers.",
        },
        {
          title: "Select and manage",
          description:
            "Choose the best candidates and manage participation easily.",
        },
      ],
    },
  },
  ar: {
    title: "كيف تعمل المنصة",
    description:
      "خطوات بسيطة وواضحة تساعدك على البدء — سواء كنت متطوعًا أو شركة.",
    stepLabel: "الخطوة",
    volunteer: {
      title: "للمتطوعين",
      subtitle: "ابدأ رحلتك واصنع فرقًا",
      steps: [
        {
          title: "أنشئ ملفك الشخصي",
          description:
            "أنشئ ملفك خلال دقائق وأبرز مهاراتك واهتماماتك بسهولة.",
        },
        {
          title: "اكتشف الفرص",
          description:
            "تصفح الفرص الموثوقة المناسبة لاهتماماتك ووقتك.",
        },
        {
          title: "قدّم وشارك",
          description:
            "انضم إلى الفرص، واكتسب خبرة، وابدأ في صنع تأثير حقيقي.",
        },
      ],
    },
    company: {
      title: "للشركات",
      subtitle: "اعثر على المتطوعين المناسبين لأثرك",
      steps: [
        {
          title: "أضف فرصة",
          description:
            "أنشئ وانشر فرصتك بسهولة من خلال خطوات بسيطة وواضحة.",
        },
        {
          title: "استقبل الطلبات",
          description:
            "استقبل طلبات من متطوعين متحمسين ومناسبين لاحتياجاتك.",
        },
        {
          title: "اختر وأدر",
          description:
            "اختر الأنسب وأدر المشاركين بسهولة وكفاءة.",
        },
      ],
    },
  },
} as const;