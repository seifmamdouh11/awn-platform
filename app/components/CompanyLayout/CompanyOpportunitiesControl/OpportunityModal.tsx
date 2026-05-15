"use client";

import React from "react";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import { useEventsCategories } from "@/app/Context/EventsCategories";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { useLoggedInData } from "@/app/Context/LoggedInDataContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";

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
  is_featured: boolean;
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
  const { data } = useLoggedInData();
  const activeSub = data?.active_subscription;

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
    commission_rate: event?.commission_rate
      ? String(event.commission_rate)
      : (activeSub?.benefits?.commission_rate !== undefined ? String(activeSub.benefits.commission_rate) : "12"),
    start_time: event?.start_time
      ? String(event.start_time).slice(0, 16).replace(" ", "T")
      : "",
    end_time: event?.end_time
      ? String(event.end_time).slice(0, 16).replace(" ", "T")
      : "",
    is_featured: !!event?.is_featured,
  });

  const [form, setForm] = React.useState<FormState>(getInitialForm());
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(getInitialForm());
      // Lock body scroll naturally when modal opens
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
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
      commission_rate: activeSub?.benefits?.commission_rate !== undefined ? String(activeSub.benefits.commission_rate) : "12",
      start_time: "",
      end_time: "",
      is_featured: false,
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
      commission_rate: Number(form.commission_rate) || 12,
      start_time: formatDateTimeForMySQL(form.start_time),
      end_time: formatDateTimeForMySQL(form.end_time),
      is_featured: form.is_featured,
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

  const inputClass = `w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${isViewMode ? "bg-foreground/5 opacity-70 cursor-not-allowed" : ""
    }`;

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Click Handler */}
          <div className="absolute inset-0" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            dir={currentLang === "ar" ? "rtl" : "ltr"}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] bg-background shadow-2xl border border-foreground/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-foreground/10 px-6 py-5 sm:px-8">
              <h2 className="text-foreground text-lg font-bold sm:text-xl">{getModalTitle()}</h2>

              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-2 text-foreground/50 hover:bg-foreground/10 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 sm:px-8"
            >
              <div className="space-y-6">

                {/* Titles */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.titleAr}</label>
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

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.titleEn}</label>
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

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground/80">{t.category}</label>
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

                {/* Descriptions */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.descriptionAr}</label>
                    <textarea
                      name="description_ar"
                      value={form.description_ar}
                      placeholder={t.descriptionArPlaceholder}
                      onChange={handleChange}
                      className={`min-h-[140px] resize-y ${inputClass}`}
                      rows={4}
                      required={!isViewMode}
                      readOnly={isViewMode}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.descriptionEn}</label>
                    <textarea
                      name="description_en"
                      value={form.description_en}
                      placeholder={t.descriptionEnPlaceholder}
                      onChange={handleChange}
                      className={`min-h-[140px] resize-y ${inputClass}`}
                      rows={4}
                      required={!isViewMode}
                      readOnly={isViewMode}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground/80">{t.address}</label>
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

                {/* Details Row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.capacity}</label>
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

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.status}</label>
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

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.type}</label>
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

                {/* Paid Compensation Block */}
                {form.event_type === "paid" && (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:grid-cols-3 bg-primary/5 p-6 rounded-2xl border border-primary/20 shadow-inner">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-primary">{(t as any).price}</label>
                      <input
                        name="compensation"
                        type="number"
                        min={0}
                        value={form.compensation}
                        onChange={handleChange}
                        className={`${inputClass} !bg-background border-primary/30 focus:ring-primary`}
                        required={!isViewMode}
                        readOnly={isViewMode}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-primary">{(t as any).commission}</label>
                      <div className={`${inputClass} !bg-primary/10 border-primary/20 flex items-center font-bold text-primary`}>
                        {form.commission_rate}%
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-foreground">{(t as any).netReward}</label>
                      <div className="h-[46px] flex items-center px-4 bg-background border border-foreground/10 rounded-xl text-foreground font-black text-lg">
                        {Math.max(0, Number(form.compensation) * (1 - (Number(form.commission_rate) || 0) / 100)).toFixed(2)}
                        <span className="text-[10px] font-bold mx-1 opacity-60">EGP</span>
                      </div>
                    </div>
                  </div>
                )}



                {/* Timeline */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.startTime}</label>
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

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground/80">{t.endTime}</label>
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

              {/* Footer Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-foreground/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full rounded-xl bg-red-500/10 border border-red-500/20 px-6 py-3 text-sm font-bold text-red-600 hover:bg-red-500/20 transition-all sm:w-auto"
                >
                  {isViewMode ? t.close : t.cancel}
                </button>

                {!isViewMode && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-primary px-8 py-3 text-sm font-bold text-black shadow-md hover:opacity-90 transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <span className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin"></span>
                    )}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}