"use client";

import React from "react";
import Navbar from "../components/MainLayout/Navbar/Navbar";
import Footer from "../components/MainLayout/Footer/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton/ScrollToTopButton";
import { useLang } from "../Hooks/LangHook/LangHook";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  const { lang } = useLang();
  const isRTL = lang === "ar";

  return (
    <div className="relative">
      <Navbar />
      {/* push content past the fixed sidebar on desktop; below topbar on mobile */}
      <div className={`pt-16 md:pt-0 ${isRTL ? "md:mr-64" : "md:ml-64"}`}>
        {children}
        <Footer />
      </div>
      <ScrollToTopButton />
    </div>
  );
}