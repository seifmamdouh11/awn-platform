"use client";

import React from "react";

type Props = {
  title: string;
  description: string;
  isEditing: boolean;
  saving: boolean;
  editLabel: string;
  cancelLabel: string;
  saveLabel: string;
  savingLabel: string;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function SettingsHeader({
  title,
  description,
  isEditing,
  saving,
  editLabel,
  cancelLabel,
  saveLabel,
  savingLabel,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-foreground/60">{description}</p>
      </div>

      {!isEditing ? (
        <button
          onClick={onEdit}
          className="rounded-2xl border border-foreground/15 bg-background px-5 py-2.5 font-medium text-foreground transition hover:bg-foreground/5"
        >
          {editLabel}
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-2xl border border-foreground/15 bg-background px-5 py-2.5 font-medium text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-2xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? savingLabel : saveLabel}
          </button>
        </div>
      )}
    </div>
  );
}