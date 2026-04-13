"use client";

import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function PartnersSection() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = translations[lang];
  const data = [...partners, ...partners];

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">{t.title}</h2>
          <p className="mt-3 text-sm text-foreground/60 sm:text-base">
            {t.description}
          </p>
        </motion.div>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          viewport={{ once: true }}
          className="relative mt-10 overflow-hidden"
          dir="ltr"
        >
          {/* fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

          <Marquee speed={40} loop={0} autoFill gradient={false} direction={isArabic ? "right" : "left"}>
            {data.map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.04 }}
                transition={{ duration: 0.2 }}
                className="mx-10 flex items-center justify-center"
              >
                <div className="relative h-32 w-32">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="w-full object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              </motion.div>
            ))}
          </Marquee>
        </motion.div>
      </motion.div>
    </section>
  );
}

const translations = {
  en: {
    title: "Our Partners",
    description:
      "Trusted by organizations that believe in creating real impact.",
  },
  ar: {
    title: "شركاؤنا",
    description: "موثوق من جهات تؤمن بصناعة تأثير حقيقي.",
  },
} as const;

const partners = [
  {
    id: 1,
    name: "Egyptian Football Association",
    image: "/partners/partner-1.png",
    url: "",
  },
  {
    id: 2,
    name: "Tazkarti",
    image: "/partners/partner-2.png",
    url: "",
  },
  {
    id: 3,
    name: "Egyptian Ministry of Education",
    image: "/partners/partner-3.png",
    url: "",
  },
  {
    id: 4,
    name: "Arab Academy for Science and Technology",
    image: "/partners/partner-4.png",
    url: "",
  },
  {
    id: 5,
    name: "Resala",
    image: "/partners/partner-5.png",
    url: "",
  },
  {
    id: 6,
    name: "Amazon",
    image: "/partners/partner-6.png",
    url: "",
  },
] as const;