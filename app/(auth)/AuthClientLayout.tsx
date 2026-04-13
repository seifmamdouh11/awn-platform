"use client";

import { useRouter } from "next/navigation";
import api from "../utils/api";
import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner/Spinner";

type Props = {
  children: React.ReactNode;
};

export default function AuthClientLayout({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setChecking(false);
        return;
      }

      try {
        await api.get("/volunteers/me");

        router.replace("/volunteer/home");
        return;
      } catch (error) { }

      try {
        await api.get("/companies/me");

        router.replace("/company/dashboard");
        return;
      } catch (error) { }

      localStorage.removeItem("token");
      setChecking(false);
    };

    checkLoggedInUser();
  }, [router]);

  if (checking) {
    return <Spinner />;
  }

  return <>{children}</>;
}