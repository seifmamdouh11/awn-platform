"use client";

import React, { useEffect, useState } from "react";
import { useLang } from "./Hooks/LangHook/LangHook";
import Spinner from "./components/Spinner/Spinner";
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

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const isVolunteerRoute = pathname.startsWith("/volunteer");
        const isCompanyRoute = pathname.startsWith("/company");

        if (isVolunteerRoute) {
          await api.get("/volunteers/me");
        }

        if (isCompanyRoute) {
          await api.get("/companies/me");
        }

        setLoading(false);
      } catch (error: any) {
        if (isAxiosError(error) && error.response?.status === 403 && error.response?.data?.code === "ACCOUNT_SUSPENDED") {
          localStorage.removeItem("token");
          router.replace("/login");
        } else {
          localStorage.removeItem("token");
          router.replace("/home");
        }
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return <Spinner />;
  }

  return <>{children}</>;
}