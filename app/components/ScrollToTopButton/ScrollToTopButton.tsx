"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { lang } = useLang();

  const text = lang === "ar" ? "إلى الأعلى" : "To Top";

  // show after scroll
  useEffect(() => {
    const scroller = document.getElementById("main-scroller");
    if (!scroller) return;

    const handleScroll = () => {
      if (scroller.scrollTop > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    scroller.addEventListener("scroll", handleScroll);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // scroll to top
  const scrollToTop = () => {
    const scroller = document.getElementById("main-scroller");
    if (scroller) {
      scroller.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 end-8 z-50
        flex items-center justify-center gap-2
        h-12 px-5 rounded-full text-sm font-bold tracking-wide
        bg-foreground/[0.08] backdrop-blur-xl border border-foreground/10
        text-foreground
        shadow-2xl transition-all duration-300
        hover:-translate-y-2 hover:bg-primary hover:border-primary hover:text-black hover:shadow-primary/30
        active:scale-95
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}
      `}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
      <span>{text}</span>
    </button>
  );
}