"use client";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Spinner from "../components/Spinner/Spinner";
import LoggedInDataProvider from "../Context/LoggedInDataContext";
import EventsCategoriesProvider from "../Context/EventsCategories";
import { NotificationsProvider } from "../Context/NotificationsContext";

type Props = {
  children: React.ReactNode;
};

export default function MainClientLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/home");
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

        const status = error?.response?.status;

        if (status === 401) {
          // Handled by interceptor, but let's be safe
          localStorage.removeItem("token");
          router.replace("/home");
          return;
        }

        if (status === 403) {
          if (pathname.startsWith("/company")) {
            router.replace("/volunteer/home");
            return;
          }

          if (pathname.startsWith("/volunteer")) {
            router.replace("/company/dashboard");
            return;
          }
        }

        router.replace("/home");
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) return <Spinner />;

  return (
    <EventsCategoriesProvider>
      <LoggedInDataProvider>
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </LoggedInDataProvider>
    </EventsCategoriesProvider>
  );
}