"use client";

import React from "react";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { motion } from "framer-motion";

export default function OurStorySection() {
  const { lang } = useLang();

  const content = {
    en: {
      badge: "Our Story",
      title: "How Our Journey Started",
      p1: "We noticed that finding volunteer opportunities was often difficult and unorganized. Many volunteers struggled to discover meaningful experiences, while organizations found it hard to reach the right people.",
      p2: "That challenge inspired us to build a platform that brings both sides together in one place. Our goal was to create a simpler and more organized experience for discovering, applying to, and managing opportunities.",
      p3: "By making the process easier and more accessible, we aim to help more people participate, contribute, and create real impact in their communities.",
    },
    ar: {
      badge: "قصتنا",
      title: "كيف بدأت رحلتنا",
      p1: "لاحظنا أن الوصول إلى فرص التطوع كان في كثير من الأحيان صعبًا وغير منظم، حيث يواجه الكثير من المتطوعين مشكلة في العثور على فرص مناسبة، كما تجد الجهات صعوبة في الوصول إلى الأشخاص المناسبين.",
      p2: "هذا التحدي كان الدافع وراء بناء منصة تجمع الطرفين في مكان واحد، بهدف تقديم تجربة أبسط وأكثر تنظيمًا لاكتشاف الفرص والتقديم عليها وإدارتها بسهولة.",
      p3: "ومن خلال تسهيل هذه العملية وجعلها أكثر وضوحًا وإتاحة، نسعى إلى مساعدة عدد أكبر من الأشخاص على المشاركة وصناعة تأثير حقيقي داخل مجتمعاتهم.",
    },
  };

  const t = content[lang];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="overflow-hidden bg-background py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="order-1 lg:order-1"
          >
            <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background p-2 shadow-sm">
                <motion.img
                  src="/Images/our-story.jpg"
                  alt="Our Story"
                  className="h-auto w-full rounded-xl object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            viewport={{ once: true, amount: 0.3 }}
            className="order-2 space-y-5 lg:order-2"
          >
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className="inline-block rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70 sm:px-4 sm:text-sm"
            >
              {t.badge}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              viewport={{ once: true }}
              className="text-3xl font-bold leading-tight sm:text-4xl"
            >
              {t.title}
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="space-y-4 text-sm leading-7 text-foreground/70 sm:text-base"
            >
              {[t.p1, t.p2, t.p3].map((paragraph, index) => (
                <motion.p
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.4,
                      },
                    },
                  }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}