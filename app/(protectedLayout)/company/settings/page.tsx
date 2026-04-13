"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { settingsTranslations } from "@/app/translations/settings";
import SettingsHeader from "./components/SettingsHeader";
import CompanySummaryCard from "./components/CompanySummaryCard";
import CompanyFormCard from "./components/CompanyFormCard";

export type CompanyData = {
  company_name: string;
  email: string;
  phone: string;
  website: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  industry: string | null;
  company_size: string | null;
  tax_id: string | null;
  status: string | null;
  logo_url: string | null;
  company_rating?: number;
};

export default function SettingsPage() {
  const { lang, setLang } = useLang();
  const t = settingsTranslations[lang];

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [form, setForm] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);

        const res = await api.get("/companies/me");

        setCompany(res.data);
        setForm(res.data);
      } catch (err: any) {
        console.log(err);

        Swal.fire({
          icon: "error",
          title: t.swal.errorTitle,
          text: err?.response?.data?.error || t.messages.failedToLoad,
          confirmButtonText: t.swal.ok,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [t.messages.failedToLoad, t.swal.errorTitle, t.swal.ok]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!form) return;

    const { name, value } = e.target;

    setForm((prev) =>
      prev
        ? {
          ...prev,
          [name]: value === "" ? null : value,
        }
        : prev
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = async () => {
    const hasChanges = JSON.stringify(form) !== JSON.stringify(company);

    if (!hasChanges) {
      setForm(company);
      setIsEditing(false);
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: t.swal.cancelEditTitle,
      text: t.swal.cancelEditText,
      showCancelButton: true,
      confirmButtonText: t.cancel,
      cancelButtonText: t.swal.keepEditing,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setForm(company);
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;

    try {
      setSaving(true);

      const payload = {
        company_name: form.company_name,
        phone: form.phone,
        website: form.website || null,
        city: form.city || null,
        address: form.address || null,
        description: form.description || null,
        industry: form.industry || null,
        company_size: form.company_size || null,
      };

      await api.put("/companies/me", payload);

      const updatedCompany = {
        ...company,
        ...payload,
      } as CompanyData;

      setCompany(updatedCompany);
      setForm(updatedCompany);
      setIsEditing(false);

      await Swal.fire({
        icon: "success",
        title: t.swal.savedTitle,
        text: t.messages.saved,
        confirmButtonText: t.swal.ok,
      });
    } catch (err: any) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: t.swal.errorTitle,
        text: err?.response?.data?.error || t.messages.failed,
        confirmButtonText: t.swal.ok,
      });
    } finally {
      setSaving(false);
    }
  };

  const statusText = useMemo(() => {
    const status = company?.status?.toLowerCase() as
      | "active"
      | "pending"
      | "blocked"
      | undefined;

    if (!status) return "-";

    return t.status[status] || status;
  }, [company?.status, t]);

  if (loading) {
    return (
      <section
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="mx-auto max-w-6xl space-y-6 p-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="mt-2 text-foreground/60">{t.loading}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-48 animate-pulse rounded-3xl border border-foreground/10 bg-foreground/5" />
          <div className="h-[560px] animate-pulse rounded-3xl border border-foreground/10 bg-foreground/5 lg:col-span-2" />
        </div>
      </section>
    );
  }

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="mx-auto max-w-6xl space-y-6 p-6"
    >
      <SettingsHeader
        title={t.title}
        description={t.description}
        isEditing={isEditing}
        saving={saving}
        editLabel={t.edit}
        cancelLabel={t.cancel}
        saveLabel={t.save}
        savingLabel={t.saving}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <aside className="space-y-6">
          <CompanySummaryCard
            companyName={company?.company_name || "-"}
            email={company?.email || "-"}
            statusLabel={t.accountStatus}
            statusValue={statusText}
            companyRating={company?.company_rating || undefined}
          />

        </aside>

        <div className="lg:col-span-2">
          <CompanyFormCard
            title={t.companyInfo}
            fields={t.fields}
            form={form}
            statusText={statusText}
            isEditing={isEditing}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
}