
"use client";

import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { useRouter } from "next/navigation";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { FaRegBuilding, FaUser } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function HomeSection() {
  const { lang } = useLang();
  const router = useRouter();

  const isArabic = lang === "ar";
  const t = translations[lang];
  const cardListVolunteer = t.cardList.volunteer;
  const cardListCompany = t.cardList.company;

  const goToRegisterCompany = () => {
    router.push("/register/company");
  };

  const goToRegisterVolunteer = () => {
    router.push("/register/volunteer");
  };

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top hero */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full border border-foreground/10 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 backdrop-blur"
          >
            {isArabic ? "منصة التطوع والتعاون" : "Volunteer & Company Platform"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl"
          >
            {t.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            viewport={{ once: true }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-foreground/65 sm:text-base"
          >
            {t.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={goToRegisterVolunteer}
              className="inline-flex min-w-[190px] items-center justify-center rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition duration-300 hover:opacity-90 cursor-pointer"
            >
              {isArabic ? "ابدأ كمتطوع" : "Join as Volunteer"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={goToRegisterCompany}
              className="inline-flex min-w-[190px] items-center justify-center rounded-xl border border-foreground/15 bg-background/80 px-6 py-3 text-sm font-semibold text-foreground transition duration-300 hover:border-foreground/30 cursor-pointer"
            >
              {isArabic ? "ابدأ كشركة" : "Join as Company"}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Volunteer Card */}
          <motion.article
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-foreground/20 sm:p-8"
          >
            <div className="absolute right-0 top-0 h-28 w-28 translate-x-1/4 -translate-y-1/4 rounded-full bg-foreground/5 blur-2xl" />

            <div className="relative flex h-full flex-col">
              <div className="mb-6 flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 4, scale: 1.06 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/5 text-xl"
                >
                  <FaUser />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-extrabold uppercase tracking-wide sm:text-3xl">
                    {t.volunteerTitle}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/55">
                    {isArabic ? "لصناعة أثر حقيقي" : "For creating real impact"}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-foreground/65 sm:text-base">
                {t.volunteerDesc}
              </p>

              <motion.ul
                className="mt-6 space-y-3"
                variants={listContainerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {cardListVolunteer.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    className="flex items-start gap-3 rounded-xl border border-transparent p-2 transition duration-200 hover:border-foreground/10 hover:bg-foreground/[0.03]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-[10px] text-green-500">
                      <FaCheck />
                    </span>
                    <span className="text-sm text-foreground/85 sm:text-[15px]">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-8 pt-2">
                <motion.button
                  whileHover={{ x: isArabic ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToRegisterVolunteer}
                  className="inline-flex items-center gap-2 rounded-xl px-1 text-sm font-bold transition-all duration-200 hover:gap-3 cursor-pointer"
                >
                  {t.getStarted}
                  <span>{isArabic ? "←" : "→"}</span>
                </motion.button>
              </div>
            </div>
          </motion.article>

          {/* Company Card */}
          <motion.article
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.25 }}
            className="group relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:border-foreground/20 sm:p-8"
          >
            <div className="absolute left-0 top-0 h-28 w-28 -translate-x-1/4 -translate-y-1/4 rounded-full bg-foreground/5 blur-2xl" />

            <div className="relative flex h-full flex-col">
              <div className="mb-6 flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: -4, scale: 1.06 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-foreground/10 bg-foreground/5 text-xl"
                >
                  <FaRegBuilding />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-extrabold uppercase tracking-wide sm:text-3xl">
                    {t.companyTitle}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/55">
                    {isArabic ? "لتوسيع أثر المؤسسة" : "For scaling your impact"}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-7 text-foreground/65 sm:text-base">
                {t.companyDesc}
              </p>

              <motion.ul
                className="mt-6 space-y-3"
                variants={listContainerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {cardListCompany.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    className="flex items-start gap-3 rounded-xl border border-transparent p-2 transition duration-200 hover:border-foreground/10 hover:bg-foreground/[0.03]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-[10px] text-green-500">
                      <FaCheck />
                    </span>
                    <span className="text-sm text-foreground/85 sm:text-[15px]">
                      {item}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="mt-8 pt-2">
                <motion.button
                  whileHover={{ x: isArabic ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToRegisterCompany}
                  className="inline-flex items-center gap-2 rounded-xl px-1 text-sm font-bold transition-all duration-200 hover:gap-3 cursor-pointer"
                >
                  {t.getStarted}
                  <span>{isArabic ? "←" : "→"}</span>
                </motion.button>
              </div>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

const containerVariants = {
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
    y: 40,
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

const listContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const listItemVariants = {
  hidden: {
    opacity: 0,
    x: 18,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

const translation = {
  en: {
    title: "Welcome To AWN",
    description:
      "Connect volunteers with meaningful opportunities. AWN helps individuals and organizations collaborate, create impact, and grow together.",
    cardList: {
      volunteer: [
        "Create your profile in minutes",
        "Browse verified opportunities",
        "Track your volunteering hours",
        "Build your impact portfolio",
      ],
      company: [
        "Post opportunities instantly",
        "Find skilled volunteers fast",
        "Manage applications easily",
        "Track impact & engagement",
      ],
    },
    volunteerTitle: "Volunteer",
    companyTitle: "Company",
    volunteerDesc:
      "Turn your passion into real impact. Create your profile, discover verified opportunities, and track your volunteer journey with ease.",
    companyDesc:
      "Find dedicated volunteers and amplify your impact. Post opportunities, manage applications, and connect with the right talent effortlessly.",
    getStarted: "Get Started",
  },
  ar: {
    title: "مرحبًا بك في عون",
    description:
      "اربط المتطوعين بالفرص الهادفة. يساعد عون الأفراد والمؤسسات على التعاون، وصناعة أثر حقيقي، والنمو معًا.",
    cardList: {
      volunteer: [
        "أنشئ ملفك الشخصي خلال دقائق",
        "تصفح الفرص الموثوقة",
        "تابع ساعات تطوعك",
        "ابنِ سجل إنجازاتك التطوعية",
      ],
      company: [
        "أضف الفرص مباشرة",
        "اعثر على متطوعين مناسبين بسرعة",
        "أدر الطلبات بسهولة",
        "تتبع الأثر والتفاعل",
      ],
    },
    volunteerTitle: "متطوع",
    companyTitle: "شركة",
    volunteerDesc:
      "حوّل شغفك إلى أثر حقيقي. أنشئ ملفك الشخصي، واكتشف فرصًا موثوقة، وتابع رحلتك التطوعية بكل سهولة.",
    companyDesc:
      "اعثر على متطوعين ملتزمين وعزّز أثر مؤسستك. انشر الفرص، وأدر الطلبات، وتواصل مع الكفاءات المناسبة بسهولة.",
    getStarted: "ابدأ الآن",
  },
} as const;

const translations = {
  en: {
    title: "Welcome To AWN",
    description:
      "Connect volunteers with meaningful opportunities. AWN helps individuals and organizations collaborate, create impact, and grow together.",
    cardList: {
      volunteer: [
        "Create your profile in minutes",
        "Browse verified opportunities",
        "Track your volunteering hours",
        "Build your impact portfolio",
      ],
      company: [
        "Post opportunities instantly",
        "Find skilled volunteers fast",
        "Manage applications easily",
        "Track impact & engagement",
      ],
    },
    volunteerTitle: "Volunteer",
    companyTitle: "Company",
    volunteerDesc:
      "Turn your passion into real impact. Create your profile, discover verified opportunities, and track your volunteer journey with ease.",
    companyDesc:
      "Find dedicated volunteers and amplify your impact. Post opportunities, manage applications, and connect with the right talent effortlessly.",
    getStarted: "Get Started",
  },
  ar: {
    title: "مرحبًا بك في عون",
    description:
      "اربط المتطوعين بالفرص الهادفة. يساعد عون الأفراد والمؤسسات على التعاون، وصناعة أثر حقيقي، والنمو معًا.",
    cardList: {
      volunteer: [
        "أنشئ ملفك الشخصي خلال دقائق",
        "تصفح الفرص الموثوقة",
        "تابع ساعات تطوعك",
        "ابنِ سجل إنجازاتك التطوعية",
      ],
      company: [
        "أضف الفرص مباشرة",
        "اعثر على متطوعين مناسبين بسرعة",
        "أدر الطلبات بسهولة",
        "تتبع الأثر والتفاعل",
      ],
    },
    volunteerTitle: "متطوع",
    companyTitle: "شركة",
    volunteerDesc:
      "حوّل شغفك إلى أثر حقيقي. أنشئ ملفك الشخصي، واكتشف فرصًا موثوقة، وتابع رحلتك التطوعية بكل سهولة.",
    companyDesc:
      "اعثر على متطوعين ملتزمين وعزّز أثر مؤسستك. انشر الفرص، وأدر الطلبات، وتواصل مع الكفاءات المناسبة بسهولة.",
    getStarted: "ابدأ الآن",
  },
} as const;