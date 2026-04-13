"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string; // e.g., "max-w-md", "max-w-lg", "max-w-2xl"
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = "max-w-md" 
}: ModalProps) {
  
  // Prevent background scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          
          {/* Dark Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            className={`relative flex w-full ${maxWidth} flex-col overflow-hidden rounded-[2rem] border border-foreground/10 bg-background shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-5">
              {title && <h2 className="text-xl font-bold text-foreground">{title}</h2>}
              <button
                onClick={onClose}
                className="ml-auto rounded-full p-2 text-foreground/50 transition hover:bg-foreground/5 hover:text-foreground"
              >
                <FaXmark className="text-xl" />
              </button>
            </div>

            {/* Scrollable Body - limits height to 80% of screen so it doesn't break on small devices */}
            <div className="no-scrollbar custom-scrollbar max-h-[80vh] overflow-y-auto p-6">
              {children}
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}