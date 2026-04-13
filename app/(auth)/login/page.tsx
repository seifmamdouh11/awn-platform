"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login/volunteer");
  }, [router]);

  return null;
}