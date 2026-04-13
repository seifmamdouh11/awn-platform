"use client";

import React from "react";
import AuthClientLayout from "./AuthClientLayout";
import LoggedInDataProvider from "../Context/LoggedInDataContext";
import Navbar from "../components/MainLayout/Navbar/Navbar";
import { useLang } from "../Hooks/LangHook/LangHook";

type Props = {
  children: React.ReactNode;
};

export default function VolunteerAuthLayout({ children }: Props) {
  const { lang } = useLang();
  const isRTL = lang === "ar";

  return (
    <AuthClientLayout>
      <LoggedInDataProvider>
        <div className="relative">
          <Navbar />
          <div className={`pt-16 md:pt-0 ${isRTL ? "md:mr-64" : "md:ml-64"}`}>
            {children}
          </div>
        </div>
      </LoggedInDataProvider>
    </AuthClientLayout>
  );
}
