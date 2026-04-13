"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register/volunteer");
  }, [router]);

  return null;
}