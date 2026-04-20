"use client";

import React from "react";
import AuthClientLayout from "./AuthClientLayout";
import LoggedInDataProvider from "../Context/LoggedInDataContext";
import Navbar from "../components/MainLayout/Navbar/Navbar";
import { useLang } from "../Hooks/LangHook/LangHook";
import { SidebarProvider, useSidebar } from "../Context/SidebarContext";

type Props = {
  children: React.ReactNode;
};

function AuthLayoutContent({ children }: Props) {
  const { lang } = useLang();
  const isRTL = lang === "ar";
  const { isCollapsed } = useSidebar();

  return (
    <AuthClientLayout>
      <LoggedInDataProvider>
        <div className="relative">
          <Navbar />
          <div className={`pt-16 md:pt-0 transition-all duration-300 ${isRTL ? (isCollapsed ? "md:mr-20" : "md:mr-64") : (isCollapsed ? "md:ml-20" : "md:ml-64")}`}>
            {children}
          </div>
        </div>
      </LoggedInDataProvider>
    </AuthClientLayout>
  );
}

export default function VolunteerAuthLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </SidebarProvider>
  );
}
