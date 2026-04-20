"use client";

import React from "react";
import Navbar from "../components/MainLayout/Navbar/Navbar";
import Footer from "../components/MainLayout/Footer/Footer";
import { useLang } from "../Hooks/LangHook/LangHook";
import { SidebarProvider, useSidebar } from "../Context/SidebarContext";

type Props = {
  children: React.ReactNode;
};

function MainLayoutContent({ children }: Props) {
  const { lang } = useLang();
  const isRTL = lang === "ar";
  const { isCollapsed } = useSidebar();

  return (
    <div className="relative">
      <Navbar />
      {/* push content past the fixed sidebar on desktop; below topbar on mobile */}
      <div className={` pt-16 md:pt-0 transition-all duration-300 ${isRTL ? (isCollapsed ? "md:mr-20" : "md:mr-64") : (isCollapsed ? "md:ml-20" : "md:ml-64")}`}>
        {children}
        <Footer />
      </div>
    </div>
  );
}

export default function MainLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}