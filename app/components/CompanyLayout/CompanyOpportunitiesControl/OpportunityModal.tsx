"use client";

import React from "react";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import { useEventsCategories } from "@/app/Context/EventsCategories";
import { useLang } from "@/app/Hooks/LangHook/LangHook";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh?: () => void;
  event?: any;
  mode?: "create" | "edit" | "view";
};

type Lang = "ar" | "en";

type FormState = {
  title_ar: string;
  title_en: string;
  category_id: string;
  description_ar: string;
  description_en: string;
  address: string;
  capacity: string;
  status: "draft" | "open" | "closed";
  event_type: "volunteer" | "paid";
  compensation: string;
  commission_rate: string;
  start_time: string;
  end_time: string;
};

const translations: Record<
  Lang,
  {
    modalTitle: string;
    modalTitleEdit: string;
    modalTitleView: string;
    titleAr: string;
    titleEn: string;
    titleArPlaceholder: string;
    titleEnPlaceholder: string;
    category: string;
    selectCategory: string;
    descriptionAr: string;
    descriptionEn: string;
    descriptionArPlaceholder: string;
    descriptionEnPlaceholder: string;
    address: string;
    addressPlaceholder: string;
    capacity: string;
    status: string;
    type: string;
    startTime: string;
    endTime: string;
    cancel: string;
    close: string;
    create: string;
    creating: string;
    update: string;
    updating: string;
    volunteer: string;
    paid: string;
    draft: string;
    open: string;
    closed: string;
    success: string;
    successUpdate: string;
    titleError: string;
    descriptionError: string;
    timeRequired: string;
    timeError: string;
    fallbackError: string;
    price: string;
    commission: string;
    netReward: string;
  }
> = {
  en: {
    modalTitle: "Create Opportunity",
    modalTitleEdit: "Edit Opportunity",
    modalTitleView: "Opportunity Details",
    titleAr: "Title (Arabic)",
    titleEn: "Title (English)",
    titleArPlaceholder: "Opportunity title in Arabic",
    titleEnPlaceholder: "Opportunity title in English",
    category: "Category",
    selectCategory: "Select category",
    descriptionAr: "Description (Arabic)",
    descriptionEn: "Description (English)",
    descriptionArPlaceholder: "Write the opportunity description in Arabic",
    descriptionEnPlaceholder: "Write the opportunity description in English",
    address: "Address",
    addressPlaceholder: "Event location",
    capacity: "Capacity",
    status: "Status",
    type: "Type",
    startTime: "Start Time",
    endTime: "End Time",
    cancel: "Cancel",
    close: "Close",
    create: "Create",
    creating: "Creating...",
    update: "Update",
    updating: "Updating...",
    volunteer: "Volunteer",
    paid: "Paid",
    draft: "Draft",
    open: "Open",
    closed: "Closed",
    success: "Opportunity created successfully, Wait for admin approval",
    successUpdate: "Opportunity updated successfully, Wait for admin approval",
    titleError: "Arabic and English titles are required",
    descriptionError: "Arabic and English descriptions are required",
    timeRequired: "Start time and end time are required",
    timeError: "End time must be after start time",
    price: "Price per volunteer (EGP)",
    commission: "Platform Commission (%)",
    netReward: "Volunteer Reward",
    fallbackError: "Something went wrong",
  },
  ar: {
    modalTitle: "إنشاء فرصة",
    modalTitleEdit: "تعديل الفرصة",
    modalTitleView: "تفاصيل الفرصة",
    titleAr: "العنوان (عربي)",
    titleEn: "العنوان (إنجليزي)",
    titleArPlaceholder: "عنوان الفرصة بالعربي",
    titleEnPlaceholder: "Opportunity title in English",
    category: "التصنيف",
    selectCategory: "اختر التصنيف",
    descriptionAr: "الوصف (عربي)",
    descriptionEn: "الوصف (إنجليزي)",
    descriptionArPlaceholder: "اكتب وصف الفرصة بالعربي",
    descriptionEnPlaceholder: "Write the opportunity description in English",
    address: "العنوان",
    addressPlaceholder: "مكان الفعالية",
    capacity: "العدد المطلوب",
    status: "الحالة",
    type: "النوع",
    startTime: "وقت البداية",
    endTime: "وقت النهاية",
    cancel: "إلغاء",
    close: "إغلاق",
    create: "إنشاء",
    creating: "جارٍ الإنشاء...",
    update: "حفظ التعديلات",
    updating: "جارٍ التحديث...",
    volunteer: "تطوعي",
    paid: "مدفوع",
    draft: "مسودة",
    open: "مفتوح",
    closed: "مغلق",
    success: "تم إنشاء الفرصة بنجاح, انتظر موافقة المشرف",
    successUpdate: "تم تحديث الفرصة بنجاح, انتظر موافقة المشرف",
    titleError: "لازم تدخل العنوان بالعربي والإنجليزي",
    descriptionError: "لازم تدخل الوصف بالعربي والإنجليزي",
    timeRequired: "وقت البداية ووقت النهاية مطلوبين",
    timeError: "وقت النهاية لازم يكون بعد وقت البداية",
    price: "السعر لكل متطوع (EGP)",
    commission: "عمولة المنصة (%)",
    netReward: "مكافأة المتطوع",
    fallbackError: "حصل خطأ ما",
  },
};

export default function OpportunityModal({
  open,
  setOpen,
  refresh,
  event,
  mode = "create",
}: Props) {
  const { categories } = useEventsCategories();
  const { lang } = useLang();
  const currentLang: Lang = lang === "ar" ? "ar" : "en";
  const t = translations[currentLang];

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const getInitialForm = (): FormState => ({
    title_ar: event?.title_ar || "",
    title_en: event?.title_en || "",
    category_id: event?.category_id ? String(event.category_id) : "",
    description_ar: event?.description_ar || "",
    description_en: event?.description_en || "",
    address: event?.address || "",
    capacity: event?.capacity ? String(event.capacity) : "1",
    status:
      event?.status === "open" || event?.status === "closed"
        ? event.status
        : "draft",
    event_type: event?.event_type || "volunteer",
    compensation: event?.compensation ? String(event.compensation) : "0",
    commission_rate: event?.commission_rate ? String(event.commission_rate) : "12",
    start_time: event?.start_time
      ? String(event.start_time).slice(0, 16).replace(" ", "T")
      : "",
    end_time: event?.end_time
      ? String(event.end_time).slice(0, 16).replace(" ", "T")
      : "",
  });

  const [form, setForm] = React.useState<FormState>(getInitialForm());
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(getInitialForm());
    }
  }, [event, open]);

  const resetForm = () => {
    setForm({
      title_ar: "",
      title_en: "",
      category_id: "",
      description_ar: "",
      description_en: "",
      address: "",
      capacity: "1",
      status: "draft",
      event_type: "volunteer",
      compensation: "0",
      commission_rate: "12",
      start_time: "",
      end_time: "",
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (isViewMode) return;
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateTimeForMySQL = (value: string) => {
    return value ? `${value.replace("T", " ")}:00` : "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isViewMode) return;

    const title_ar = form.title_ar.trim();
    const title_en = form.title_en.trim();
    const description_ar = form.description_ar.trim();
    const description_en = form.description_en.trim();
    const address = form.address.trim();

    if (!title_ar || !title_en) {
      await Swal.fire({
        icon: "error",
        title: t.titleError,
      });
      return;
    }

    if (!description_ar || !description_en) {
      await Swal.fire({
        icon: "error",
        title: t.descriptionError,
      });
      return;
    }

    if (!form.start_time || !form.end_time) {
      await Swal.fire({
        icon: "error",
        title: t.timeRequired,
      });
      return;
    }

    if (new Date(form.end_time) <= new Date(form.start_time)) {
      await Swal.fire({
        icon: "error",
        title: t.timeError,
      });
      return;
    }

    const payload = {
      title_ar,
      title_en,
      category_id: Number(form.category_id),
      description_ar,
      description_en,
      address,
      capacity: Number(form.capacity) || 1,
      status: form.status,
      event_type: form.event_type,
      compensation: Number(form.compensation) || 0,
      commission_rate: Number(form.commission_rate) || 10,
      start_time: formatDateTimeForMySQL(form.start_time),
      end_time: formatDateTimeForMySQL(form.end_time),
    };

    try {
      setLoading(true);

      if (isEditMode && event?.id) {
        await api.put(`/events/${event.id}`, payload);
      } else {
        await api.post("/events", payload);
      }

      await Swal.fire({
        icon: "success",
        title: isEditMode ? t.successUpdate : t.success,
      });

      await refresh?.();
      resetForm();
      setOpen(false);
    } catch (error: any) {
      console.log(error);

      await Swal.fire({
        icon: "error",
        title: error?.response?.data?.error || t.fallbackError,
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    if (isViewMode) return t.modalTitleView;
    if (isEditMode) return t.modalTitleEdit;
    return t.modalTitle;
  };

  const inputClass = `w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isViewMode ? "bg-gray-50 text-gray-700 cursor-default" : ""
    }`;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 px-3 py-4 sm:grid sm:place-content-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        dir={currentLang === "ar" ? "rtl" : "ltr"}
        className="mx-auto flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6">
          <h2 className="text-black text-base font-bold sm:text-xl">{getModalTitle()}</h2>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-sm hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 text-[#333]"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.titleAr}</label>
                <input
                  name="title_ar"
                  value={form.title_ar}
                  placeholder={t.titleArPlaceholder}
                  onChange={handleChange}
                  className={inputClass}
                  required={!isViewMode}
                  readOnly={isViewMode}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.titleEn}</label>
                <input
                  name="title_en"
                  value={form.title_en}
                  placeholder={t.titleEnPlaceholder}
                  onChange={handleChange}
                  className={inputClass}
                  required={!isViewMode}
                  readOnly={isViewMode}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">{t.category}</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className={inputClass}
                required={!isViewMode}
                disabled={isViewMode}
              >
                <option value="" disabled>
                  {t.selectCategory}
                </option>

                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {currentLang === "ar"
                      ? category.category_name_ar || category.category_name
                      : category.category_name_en || category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.descriptionAr}</label>
                <textarea
                  name="description_ar"
                  value={form.description_ar}
                  placeholder={t.descriptionArPlaceholder}
                  onChange={handleChange}
                  className={`min-h-[120px] ${inputClass}`}
                  rows={4}
                  required={!isViewMode}
                  readOnly={isViewMode}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.descriptionEn}</label>
                <textarea
                  name="description_en"
                  value={form.description_en}
                  placeholder={t.descriptionEnPlaceholder}
                  onChange={handleChange}
                  className={`min-h-[120px] ${inputClass}`}
                  rows={4}
                  required={!isViewMode}
                  readOnly={isViewMode}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold">{t.address}</label>
              <input
                name="address"
                value={form.address}
                placeholder={t.addressPlaceholder}
                onChange={handleChange}
                className={inputClass}
                required={!isViewMode}
                readOnly={isViewMode}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 text-[#333]">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.capacity}</label>
                <input
                  name="capacity"
                  type="number"
                  min={1}
                  value={form.capacity}
                  placeholder="30"
                  onChange={handleChange}
                  className={inputClass}
                  required={!isViewMode}
                  readOnly={isViewMode}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.status}</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isViewMode}
                >
                  <option value="draft">{t.draft}</option>
                  <option value="open">{t.open}</option>
                  <option value="closed">{t.closed}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.type}</label>
                <select
                  name="event_type"
                  value={form.event_type}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={isViewMode}
                >
                  <option value="volunteer">{t.volunteer}</option>
                  <option value="paid">{t.paid}</option>
                </select>
              </div>
            </div>

            {form.event_type === "paid" && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-blue-900">{(t as any).price}</label>
                  <input
                    name="compensation"
                    type="number"
                    min={0}
                    value={form.compensation}
                    onChange={handleChange}
                    className={`${inputClass} !bg-white border-blue-200 focus:ring-blue-400`}
                    required={!isViewMode}
                    readOnly={isViewMode}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-blue-900">{(t as any).commission}</label>
                  <div className={`${inputClass} !bg-blue-100/50 border-blue-200 flex items-center font-bold text-blue-800`}>
                    12%
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-emerald-700">{(t as any).netReward}</label>
                  <div className="h-[42px] flex items-center px-3 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 font-black text-lg">
                    {Math.max(0, Number(form.compensation) * (1 - Number(form.commission_rate) / 100)).toFixed(2)}
                    <span className="text-[10px] font-bold mx-1 opacity-60">EGP</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.startTime}</label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  className={inputClass}
                  required={!isViewMode}
                  readOnly={isViewMode}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">{t.endTime}</label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  className={inputClass}
                  required={!isViewMode}
                  readOnly={isViewMode}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium hover:bg-gray-200 sm:w-auto"
            >
              {isViewMode ? t.close : t.cancel}
            </button>

            {!isViewMode && (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {loading
                  ? isEditMode
                    ? t.updating
                    : t.creating
                  : isEditMode
                    ? t.update
                    : t.create}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}