"use client";

import React from "react";

type Props = {
  label: string;
  name: string;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  className?: string;
};

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  disabled,
  className = "",
}: Props) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium text-foreground/70">{label}</label>
      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        rows={5}
        placeholder=""
        className={`resize-none rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-foreground/10 bg-foreground/5 text-foreground/70"
            : "border-foreground/15 bg-background text-foreground focus:border-blue-500"
        }`}
      />
    </div>
  );
}