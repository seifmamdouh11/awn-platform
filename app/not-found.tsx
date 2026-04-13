"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

export default function NotFound() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  return (
    <div 
      className="min-h-screen bg-white flex items-center justify-center p-6"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Subtle 404 Heading */}
          <span className="text-7xl font-black uppercase tracking-[0.3em] text-orange-500 mb-4 block">
            {isAr ? "خطأ 404" : "Error 404"}
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            {isAr ? "الصفحة غير موجودة" : "Page not found"}
          </h1>

          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            {isAr 
              ? "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها." 
              : "Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-gray-800 active:scale-95"
            >
              <Home size={20} />
              {isAr ? "الرئيسية" : "Go to Home"}
            </Link>
            
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-50"
        >
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            Awn Platform
          </span>
        </motion.div>
      </div>
    </div>
  );
}