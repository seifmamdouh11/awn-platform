"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden">
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#f5a623]/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#febc5a]/20 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Logo Container */}
        <div className="relative">
          {/* Glowing Halo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-[-40px] bg-primary/5 rounded-full blur-3xl"
          />

          {/* Main Logo Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-4">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-6xl md:text-8xl font-black tracking-tighter text-foreground"
              >
                AWN
              </motion.span>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="w-1.5 h-16 md:h-20 bg-primary/40 rounded-full"
              />
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-6xl md:text-8xl font-black tracking-tighter text-foreground/40"
                dir="rtl"
              >
                عون
              </motion.span>
            </div>

            {/* Animated Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="mt-6 flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-muted opacity-60">
                <span>Empowering Impact</span>
                <span className="w-1 h-1 rounded-full bg-primary/40" />
                <span>تمكين الأثر</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="w-48 h-1 bg-foreground/5 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#f5a623] to-transparent"
          />
        </div>
      </div>

      {/* Decorative corners */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-8 text-[10px] font-black uppercase tracking-widest text-muted opacity-20"
      >
        © 2026 AWN
      </motion.div>
    </div>
  );
}
