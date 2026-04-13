"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Page() {
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "company") {
      router.replace("/company/dashboard");
    }
  }, []);

  return null;
}