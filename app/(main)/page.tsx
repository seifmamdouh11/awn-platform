"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { isAxiosError } from "../utils/api";
import Spinner from "../components/Spinner/Spinner";

export default function Main() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/home");
        return;
      }

      try {
        await api.get("/volunteers/me");

        router.replace("/volunteer/home");
        return;
      } catch (error: any) {
        if (isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          router.replace("/home");
          return;
        }
      }

      try {
        await api.get("/companies/me");

        router.replace("/company/dashboard");
        return;
      } catch (error: any) {
        if (isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem("token");
          router.replace("/home");
          return;
        }
      }

      router.replace("/home");
    };

    checkUser();
  }, [router]);

  return <Spinner />;
}