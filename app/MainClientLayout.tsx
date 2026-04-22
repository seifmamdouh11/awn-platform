"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "./Hooks/LangHook/LangHook";
import { useRouter, usePathname } from "next/navigation";
import api, { isAxiosError } from "./utils/api";

type Props = {
  children: React.ReactNode;
};

export default function MainClientLayout({ children }: Props) {
  const { lang, setLang } = useLang();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const activeLang = localStorage.getItem("lang");

    if (activeLang === "ar" || activeLang === "en") {
      setLang(activeLang);
    }
  }, [setLang]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      // Minimum delay of 4 seconds to showcase branding
      const timerPromise = new Promise((resolve) => setTimeout(resolve, 3000));

      if (!token) {
        await timerPromise;
        setLoading(false);
        return;
      }

      try {
        const isVolunteerRoute = pathname.startsWith("/volunteer");
        const isCompanyRoute = pathname.startsWith("/company");

        const requests = [];
        if (isVolunteerRoute) requests.push(api.get("/volunteers/me"));
        if (isCompanyRoute) requests.push(api.get("/companies/me"));

        // Wait for both API calls and the minimum timer
        await Promise.all([...requests, timerPromise]);

        setLoading(false);
      } catch (error: any) {
        await timerPromise;
        if (isAxiosError(error) && error.response?.status === 403 && error.response?.data?.code === "ACCOUNT_SUSPENDED") {
          localStorage.removeItem("token");
          router.replace("/login");
        } else {
          localStorage.removeItem("token");
          router.replace("/home");
        }
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);


  return <>{children}</>;
}