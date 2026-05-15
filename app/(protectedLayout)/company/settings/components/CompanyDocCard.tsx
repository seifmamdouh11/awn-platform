"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaTimes, FaFilePdf, FaFileAlt, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

type Props = {
  currentDoc: string | null;
  docNote: string | null;
  isVerified: boolean;
  isEditing: boolean;
  onFileSelect: (file: File | null) => void;
  onNoteChange: (note: string) => void;
  lang: "ar" | "en";
};

export default function CompanyDocCard({
  currentDoc,
  docNote,
  isVerified,
  isEditing,
  onFileSelect,
  onNoteChange,
  lang,
}: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const t = {
    en: {
      title: "Legal Documentation",
      description: "Upload your legal documents to verify your company account.",
      upload: "Click to upload PDF or Image",
      supported: "PDF, PNG, JPG (MAX. 5MB)",
      noteLabel: "Verification Notes / Requirements",
      notePlaceholder: "e.g. This is our commercial register for 2024...",
      verified: "Verified",
      pending: "Pending Verification",
      viewCurrent: "View current document",
      requirementsTitle: "Required Documents",
      requirements: [
        "Commercial Register / Operating License",
        "Tax Identification Certificate",
        "Official identity document of the representative",
      ],
    },
    ar: {
      title: "المستندات القانونية",
      description: "قم بتحميل السجل التجاري أو أي مستند رسمي لتوثيق حسابك.",
      upload: "انقر لتحميل ملف PDF أو صورة",
      supported: "PDF, PNG, JPG (الحد الأقصى 5 ميجابايت)",
      noteLabel: "ملاحظات / متطلبات التوثيق",
      notePlaceholder: "مثال: هذا هو السجل التجاري لعام 2024...",
      verified: "موثق",
      pending: "قيد التوثيق",
      viewCurrent: "عرض المستند الحالي",
      requirementsTitle: "المستندات المطلوبة",
      requirements: [
        "السجل التجاري / رخصة العمل",
        "شهادة الرقم الضريبي",
        "الهوية الرسمية للممثل القانوني",
      ],
    },
  }[lang];

  const isPdf = currentDoc?.toLowerCase().endsWith(".pdf");

  return (
    <motion.div
      className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-foreground">{t.title}</h3>
          <p className="mt-1 text-sm text-foreground/60">{t.description}</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${isVerified ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}`}>
          {isVerified ? <FaCheckCircle /> : <FaHourglassHalf />}
          {isVerified ? t.verified : t.pending}
        </div>
      </div>


      {/* Requirements List */}
      <div className="mb-6 rounded-2xl bg-[#febc5a]/5 border border-[#febc5a]/20 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#febc5a] mb-2">{t.requirementsTitle}</h4>
        <ul className="space-y-1.5">
          {t.requirements.map((req, i) => (
            <li key={i} className="flex items-center gap-2 text-xs font-medium text-foreground/70">
              <div className="h-1 w-1 rounded-full bg-[#febc5a]" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        {/* File Upload / Status */}
        <div>
          {currentDoc && !fileName && !isEditing && (
            <a
              href={currentDoc}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 transition-colors hover:bg-foreground/[0.04]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground/5 text-foreground/40">
                {isPdf ? <FaFilePdf size={24} /> : <FaFileAlt size={24} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t.viewCurrent}</p>
                <p className="text-xs text-foreground/40 uppercase tracking-wider">{isPdf ? "PDF Document" : "Image File"}</p>
              </div>
            </a>
          )}

          {isEditing && (
            <div className="relative">
              <label
                className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/10 bg-foreground/[0.02] p-6 transition-all hover:border-foreground/20 hover:bg-foreground/[0.04]`}
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <FaCloudUploadAlt size={32} className="mb-3 text-foreground/40" />
                  <p className="mb-1 text-sm font-semibold text-foreground/80">
                    {fileName || t.upload}
                  </p>
                  <p className="text-xs text-foreground/40">{t.supported}</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                />
              </label>
              {fileName && (
                <button
                  onClick={clearFile}
                  className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <FaTimes size={10} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Documentation Note */}
        <div>
          <label className="mb-2 block text-sm font-bold text-foreground/70">
            {t.noteLabel}
          </label>
          {isEditing ? (
            <textarea
              value={docNote || ""}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder={t.notePlaceholder}
              className="min-h-[100px] w-full rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 text-sm outline-none transition-all focus:border-foreground/20 focus:bg-background"
            />
          ) : (
            <div className="min-h-[60px] w-full rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-4">
              <p className="text-sm text-foreground/70">{docNote || "—"}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
