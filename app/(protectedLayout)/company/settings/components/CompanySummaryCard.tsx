"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

type Props = {
  companyName: string;
  email: string;
  statusLabel: string;
  statusValue: string;
  companyRating?: number;
  logoUrl?: string | null;
  isVerified?: boolean;
};

export default function CompanySummaryCard({
  companyName,
  email,
  statusLabel,
  statusValue,
  companyRating,
  logoUrl,
  isVerified,
}: Props) {
  return (
    <motion.div
      className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-foreground/5 border border-foreground/10 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
        >
          {logoUrl ? (
             <img src={logoUrl} alt={companyName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-foreground/40">
              {companyName?.charAt(0)?.toUpperCase() || "C"}
            </span>
          )}
        </motion.div>

        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="truncate text-xl font-bold text-foreground flex items-center gap-1.5">
            {companyName}
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-blue-600 dark:text-blue-400 border border-blue-500/20" title="Verified">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.3 14.29L7.7 12.3a.996.996 0 111.41-1.41l1.59 1.59 4.29-4.3a.996.996 0 111.41 1.42l-5 5a.996.996 0 01-1.41 0l-.29-.31z"/>
                </svg>
              </span>
            )}
          </h2>
          <p className="truncate text-sm text-foreground/60">{email}</p>
        </motion.div>
      </div>

      <motion.div
        className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/5 p-4 flex justify-between items-center"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        viewport={{ once: true }}
      >
        <div>
          <p className="text-sm text-foreground/60">{statusLabel}</p>
          <p className="mt-1 font-semibold text-foreground">{statusValue}</p>
        </div>
        {companyRating !== undefined && companyRating !== null && (
          <div className="flex flex-col items-end">
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">Rating</p>
            <p className="mt-1 flex items-center gap-1 font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full filter drop-shadow-sm border border-yellow-500/20">
               {companyRating} <FaStar size={12} className="mb-0.5" />
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}