"use client";

import React from "react";

type Props = {
  label: string;
  name: string;
  value?: string | null;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  options: string[];
};

export default function SelectField({
  label,
  name,
  value,
  onChange,
  disabled,
  options,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground/70">{label}</label>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        className={`rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-foreground/10 bg-foreground/5 text-foreground/70"
            : "border-foreground/15 bg-background text-foreground focus:border-blue-500"
        }`}
      >
        <option value="">--</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}