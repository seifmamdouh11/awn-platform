"use client";

import React, { useState } from "react";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import OpportunityModal from "@/app/components/CompanyLayout/CompanyOpportunitiesControl/OpportunityModal";
import { useEventsCategories } from "@/app/Context/EventsCategories";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { opportunitiesTranslations } from "@/app/translations/opportunities";
import { FaPlus, FaEye, FaPen, FaTrashCan } from "react-icons/fa6";

type EventItem = {
  id: number;
  title: string;
  title_ar?: string | null;
  title_en?: string | null;
  category_id?: number;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  address?: string;
  capacity: number;
  status: "draft" | "open" | "closed" | "completed" | "cancelled";
  event_type?: "volunteer" | "paid";
  start_time?: string;
  end_time?: string;
  approval_status?: "pending" | "approved" | "rejected";
  admin_notes?: string | null;
};

type ModalMode = "create" | "edit" | "view";

export default function Opportunities() {
  const { lang } = useLang();
  const t =
    opportunitiesTranslations[lang as "ar" | "en"] ||
    opportunitiesTranslations.en;

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>("create");

  const { categories } = useEventsCategories();

  const getCompanyEvents = async () => {
    try {
      const res = await api.get("/events/me");

      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: lang === "ar" ? "هل أنت متأكد؟" : "Are you sure?",
      text:
        lang === "ar"
          ? "سيتم حذف الفرصة من قائمتك"
          : "This opportunity will be removed from your list",
      showCancelButton: true,
      confirmButtonText: lang === "ar" ? "حذف" : "Delete",
      cancelButtonText: lang === "ar" ? "إلغاء" : "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/events/${id}`);

      await Swal.fire({
        icon: "success",
        title: lang === "ar" ? "تم حذف الفرصة" : "Opportunity deleted",
      });

      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.log(error);

      await Swal.fire({
        icon: "error",
        title: lang === "ar" ? "حصل خطأ أثناء الحذف" : "Delete failed",
      });
    }
  };

  React.useEffect(() => {
    getCompanyEvents();
  }, [lang]);

  const getDisplayTitle = (event: EventItem) => {
    return lang === "ar"
      ? event.title_ar || event.title || event.title_en || "-"
      : event.title_en || event.title || event.title_ar || "-";
  };

  const getCategoryName = (event: EventItem) => {
    const category = categories.find(
      (category: any) => category.id === event.category_id
    );

    if (!category) return "-";

    return lang === "ar"
      ? category.category_name_ar || category.category_name
      : category.category_name_en || category.category_name;
  };

  const openCreateModal = () => {
    setSelectedEvent(null);
    setModalMode("create");
    setOpenModal(true);
  };

  const openEditModal = (event: EventItem) => {
    setSelectedEvent(event);
    setModalMode("edit");
    setOpenModal(true);
  };

  const openViewModal = (event: EventItem) => {
    setSelectedEvent(event);
    setModalMode("view");
    setOpenModal(true);
  };

  const getStatusStyle = (status: EventItem["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-500/10 text-green-600 border-green-500/20 border";
      case "closed":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20 border";
      case "draft":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 border";
      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20 border";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20 border";
      default:
        return "bg-foreground/10 text-foreground/60 border-foreground/20 border";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground/30 border-t-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-[85vh] p-4 sm:p-6 lg:p-8"
      dir={lang === "ar" ? "rtl" : "ltr"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Header Section */}
        <motion.div
           className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-[2rem] bg-gradient-to-r from-foreground/5 to-foreground/5 p-6 md:p-8 border border-foreground/5 shadow-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <h2 className="text-2xl font-black md:text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t.title}
            </h2>
            <p className="mt-2 text-sm md:text-base font-medium text-foreground/50">
              {t.description}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={openCreateModal}
            className="cursor-pointer flex items-center justify-center gap-2 w-full sm:w-fit rounded-2xl bg-[#febc5a] px-6 py-3.5 text-center text-sm font-bold text-black transition hover:bg-amber-400 shadow-lg shadow-[#febc5a]/20 active:scale-[0.98]"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaPlus className="text-base" /> {t.postOpportunity}
          </motion.button>
        </motion.div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-3xl border border-foreground/5 bg-background shadow-lg backdrop-blur-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full whitespace-nowrap text-left text-sm" dir={lang === "ar" ? "rtl" : "ltr"}>
              <thead className="bg-foreground/[0.02]">
                <tr className="text-xs font-bold uppercase tracking-wider text-foreground/40 border-b border-foreground/5">
                  <th className={`px-6 py-5 ${lang === "ar" ? "text-right" : "text-left"}`}>{t.table.title}</th>
                  <th className="px-6 py-5 text-center">{t.table.category}</th>
                  <th className="px-6 py-5 text-center">{t.table.capacity}</th>
                  <th className="px-6 py-5 text-center">{t.table.status}</th>
                  <th className="px-6 py-5 text-center">{lang === 'ar' ? 'اعتماد' : 'Approval'}</th>
                  <th className="px-6 py-5 text-center">{t.table.startDate}</th>
                  <th className="px-6 py-5 text-center">{t.table.actions}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-foreground/5">
                <AnimatePresence>
                  {events.length === 0 ? (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-foreground/50"
                      >
                         <p className="text-base font-medium">{t.table.empty}</p>
                      </td>
                    </motion.tr>
                  ) : (
                    events.map((event, index) => (
                      <motion.tr
                        key={event.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className="group transition-colors hover:bg-foreground/[0.01]"
                      >

                        <td className={`px-6 py-5 font-bold text-foreground/80 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {getDisplayTitle(event)}
                        </td>

                        <td className="px-6 py-5 text-center font-medium text-foreground/60">
                          {getCategoryName(event)}
                        </td>

                        <td className="px-6 py-5 text-center">
                          {event.capacity}
                        </td>

                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${getStatusStyle(event.status)}`}
                          >
                            {t.status[event.status]}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span 
                              className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase border ${
                                event.approval_status === "approved"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : event.approval_status === "pending"
                                    ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                              }`}
                            >
                              {event.approval_status === "approved" 
                                ? (lang === "ar" ? "مقبول" : "Accepted") 
                                : event.approval_status === "pending" 
                                  ? (lang === "ar" ? "قيد الانتظار" : "Pending") 
                                  : (lang === "ar" ? "مرفوض" : "Rejected")}
                            </span>
                            {event.admin_notes && (
                               <span className="text-[10px] text-foreground/50 max-w-[120px] truncate" title={event.admin_notes}>
                                 {event.admin_notes}
                               </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center font-medium text-foreground/50">
                          {event.start_time
                            ? new Date(event.start_time).toLocaleDateString(
                              lang === "ar" ? "ar-EG" : "en-US",
                              { month: 'short', day: 'numeric', year: 'numeric' }
                            )
                            : "-"}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openViewModal(event)}
                              title={t.buttons.view}
                              className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/10 text-foreground transition hover:bg-foreground hover:text-background shadow-sm border border-foreground/20 hover:shadow hover:scale-105 active:scale-95"
                            >
                              <FaEye className="text-sm" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(event)}
                              title={t.buttons.edit}
                              className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/10 text-foreground transition hover:bg-foreground hover:text-background shadow-sm border border-foreground/20 hover:shadow hover:scale-105 active:scale-95"
                            >
                              <FaPen className="text-sm" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(event.id)}
                              title={t.buttons.delete}
                              className="flex items-center justify-center h-8 w-8 rounded-full bg-foreground/10 text-foreground transition hover:bg-foreground hover:text-background shadow-sm border border-foreground/20 hover:shadow hover:scale-105 active:scale-95"
                            >
                              <FaTrashCan className="text-sm" />
                            </button>
                          </div>

                        </td>
                      </motion.tr>

                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <OpportunityModal
        open={openModal}
        setOpen={setOpenModal}
        refresh={getCompanyEvents}
        event={selectedEvent}
        mode={modalMode}
      />
    </motion.div>
  );
}