"use client";

import React from "react";

type Props = {
  label: string;
  name: string;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  type?: string;
  placeholder?: string;
};

export default function Field({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
  placeholder = "",
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground/70">{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-foreground/10 bg-foreground/5 text-foreground/70 placeholder:text-foreground/40"
            : "border-foreground/15 bg-background text-foreground focus:border-blue-500"
        }`}
      />
    </div>
  );
}