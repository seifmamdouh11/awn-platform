"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaTimes, FaCheck } from "react-icons/fa";
import Image from "next/image";

type Props = {
  currentLogo: string | null;
  companyName: string;
  isEditing: boolean;
  onFileSelect: (file: File | null) => void;
  lang: "ar" | "en";
};

export default function LogoUploadCard({
  currentLogo,
  companyName,
  isEditing,
  onFileSelect,
  lang,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const t = {
    en: {
      title: "Company Logo",
      upload: "Click to upload or drag and drop",
      supported: "PNG, JPG or WEBP (MAX. 5MB)",
      change: "Change Logo",
    },
    ar: {
      title: "شعار الشركة",
      upload: "انقر للتحميل أو اسحب وأفلت",
      supported: "PNG, JPG أو WEBP (الحد الأقصى 5 ميجابايت)",
      change: "تغيير الشعار",
    },
  }[lang];

  return (
    <motion.div
      className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <h3 className="mb-4 text-lg font-bold text-foreground">{t.title}</h3>

      <div className="flex flex-col items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <motion.div
            className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-foreground/5 border border-foreground/10"
            whileHover={isEditing ? { scale: 1.02 } : {}}
          >
            {preview || currentLogo ? (
              <img
                src={preview || currentLogo!}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-foreground/20">
                {companyName?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </motion.div>

          {isEditing && (preview || currentLogo) && (
             <motion.button
                onClick={clearFile}
                className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-colors hover:bg-red-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
             >
                <FaTimes size={12} />
             </motion.button>
          )}
        </div>

        {isEditing && (
          <div className="w-full">
            <label
              className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02] p-4 transition-all hover:border-foreground/20 hover:bg-foreground/[0.04]`}
            >
              <div className="flex flex-col items-center justify-center pt-2 pb-3 text-center">
                <FaCloudUploadAlt size={24} className="mb-3 text-foreground/40" />
                <p className="mb-1 text-sm font-semibold text-foreground/80">
                  {t.upload}
                </p>
                <p className="text-xs text-foreground/40">{t.supported}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
    </motion.div>
  );
}
