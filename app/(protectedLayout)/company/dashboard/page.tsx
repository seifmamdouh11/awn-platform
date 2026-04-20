"use client";

import React from "react";
import Link from "next/link";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useLoggedInData } from "@/app/Context/LoggedInDataContext";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { dashboardTranslations } from "@/app/translations/dashboard";
import OpportunityModal from "@/app/components/CompanyLayout/CompanyOpportunitiesControl/OpportunityModal";
import { FaPlus, FaEye, FaPen, FaTrashCan } from "react-icons/fa6";

type Stats = {
  total_events: number;
  active_events: number;
  closed_events: number;
  pending_events: number;
  completed_events: number;
  cancelled_events: number;
};

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
};

type ApplicantItem = {
  id: number;
  volunteer_id: number;
  event_id: number;
  application_date: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn" | "attended";
  first_name?: string;
  last_name?: string;
  email?: string;
  title?: string;
  title_ar?: string | null;
  title_en?: string | null;
  start_time?: string;
  end_time?: string;
  event_type?: "volunteer" | "paid";
};

type OpportunityModalMode = "create" | "edit" | "view";

export default function Dashboard() {
  const { data } = useLoggedInData();
  const { lang } = useLang();
  const t = dashboardTranslations[lang];

  const [stats, setStats] = React.useState<Stats | null>(null);
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [applicants, setApplicants] = React.useState<ApplicantItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<EventItem | null>(null);
  const [modalMode, setModalMode] =
    React.useState<OpportunityModalMode>("create");

  const getCompanyEvents = async () => {
    try {
      const res = await api.get("/events/me");
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setEvents([]);
    }
  };

  const getEventsStats = async () => {
    try {
      const res = await api.get("/events/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
      setStats(null);
    }
  };

  const getCompanyApplicants = async () => {
    try {
      const res = await api.get(
        `/volunteer-applications/company?lang=${lang}`
      );
      setApplicants(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setApplicants([]);
    }
  };

  const refreshDashboard = async () => {
    await Promise.all([
      getEventsStats(),
      getCompanyEvents(),
      getCompanyApplicants(),
    ]);
  };

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshDashboard();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lang]);

  const latestEvents = React.useMemo(() => {
    return [...events].slice(0, 3);
  }, [events]);

  const latestApplicants = React.useMemo(() => {
    return [...applicants].slice(0, 3);
  }, [applicants]);

  const getDisplayTitle = (event: EventItem) => {
    return lang === "ar"
      ? event.title_ar || event.title || event.title_en || "-"
      : event.title_en || event.title || event.title_ar || "-";
  };

  const getApplicantOpportunityTitle = (application: ApplicantItem) => {
    return lang === "ar"
      ? application.title_ar || application.title || application.title_en || "-"
      : application.title_en || application.title || application.title_ar || "-";
  };

  const getApplicantName = (application: ApplicantItem) => {
    const fullName = `${application.first_name || ""} ${application.last_name || ""}`.trim();
    return fullName || application.email || "-";
  };

  const formatApplicationDate = (value?: string) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getApplicationStatusStyle = (status: ApplicantItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20";
      case "accepted":
        return "bg-green-500/10 text-green-600 border border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-600 border border-red-500/20";
      case "withdrawn":
        return "bg-foreground/10 text-foreground/60 border border-foreground/20";
      case "attended":
        return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getApplicationStatusLabel = (status: ApplicantItem["status"]) => {
    const fallback = status;
    return t.applicationsStatus?.[status] || fallback;
  };

  const handleDeleteEvent = async (id: number) => {
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

      await refreshDashboard();
    } catch (error) {
      console.log(error);

      await Swal.fire({
        icon: "error",
        title: lang === "ar" ? "حصل خطأ أثناء الحذف" : "Delete failed",
      });
    }
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

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground/30 border-t-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-[85vh] p-4 sm:p-6 lg:p-8 space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <motion.div
           className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-[2rem] bg-gradient-to-r from-foreground/5 to-foreground/5 p-6 md:p-8 border border-foreground/5 shadow-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <h2 className="text-2xl font-black md:text-3xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t.welcome}
              {data?.company_name ? `, ${data.company_name}` : ""}
            </h2>

            <p className="mt-2 text-sm md:text-base font-medium text-foreground/50">
              {t.subtitle}
            </p>
          </div>

          <motion.button
            type="button"
            onClick={openCreateModal}
            className="cursor-pointer flex items-center justify-center gap-2 w-full sm:w-fit rounded-2xl bg-[#febc5a] px-6 py-3.5 text-center text-sm text-black font-bold transition hover:bg-amber-400 shadow-lg shadow-[#febc5a]/20 active:scale-[0.98]"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaPlus className="text-base" /> {t.postOpportunity}
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <StatCard title={t.stats.active}  value={stats?.active_events  ?? 0} index={0} />
          <StatCard title={t.stats.closed}  value={stats?.closed_events  ?? 0} index={1} />
          <StatCard title={t.stats.pending} value={stats?.pending_events ?? 0} index={2} />
          <StatCard title={t.stats.total}   value={stats?.total_events   ?? 0} index={3} />
        </motion.div>

        {/* Widgets Section */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          
          {/* Latest Applicants */}
          <motion.div
            className="overflow-hidden rounded-[2rem] border border-foreground/5 bg-background shadow-lg backdrop-blur-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold sm:text-2xl text-foreground">
                {t.sections.applicants}
              </h3>

              <Link
                href="/company/applicants"
                className="text-sm font-bold text-[#febc5a] transition hover:text-amber-400 underline underline-offset-4"
              >
                {t.actions.viewApplicants}
              </Link>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {latestApplicants.length === 0 ? (
                  <p className="text-sm text-foreground/60 py-6 text-center bg-foreground/[0.02] rounded-2xl border border-foreground/5">
                    {t.applicantsEmpty || (lang === "ar" ? "لا يوجد متقدمون بعد" : "No applicants yet")}
                  </p>
                ) : (
                  latestApplicants.map((application) => (
                    <motion.div
                      key={application.id}
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-foreground/5 bg-foreground/[0.01] p-5 transition-colors hover:bg-foreground/[0.03]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">
                          {getApplicantName(application)}
                        </p>
                        <p className="text-sm font-medium text-blue-600 truncate mt-1">
                          {getApplicantOpportunityTitle(application)}
                        </p>
                        <p className="text-xs text-foreground/40 font-bold uppercase tracking-wider mt-2">
                          {formatApplicationDate(application.application_date)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getApplicationStatusStyle(
                          application.status
                        )}`}
                      >
                        {getApplicationStatusLabel(application.status)}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Latest Opportunities */}
          <motion.div
             className="overflow-hidden rounded-[2rem] border border-foreground/5 bg-background shadow-lg backdrop-blur-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16 }}
          >
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold sm:text-2xl text-foreground">
                {t.sections.opportunities}
              </h3>

              <Link
                href="/company/opportunities"
                className="text-sm font-bold text-[#febc5a] transition hover:text-amber-400 underline underline-offset-4"
              >
                {t.actions.viewOpportunities}
              </Link>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {latestEvents.length === 0 ? (
                  <p className="text-sm text-foreground/60 py-6 text-center bg-foreground/[0.02] rounded-2xl border border-foreground/5">
                    {t.opportunity?.empty || (lang === "ar" ? "لا توجد فرص بعد" : "No opportunities yet")}
                  </p>
                ) : (
                  latestEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-foreground/5 bg-foreground/[0.01] p-5 transition-colors hover:bg-foreground/[0.03]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate">
                            {getDisplayTitle(event)}
                          </p>
                          <p className="text-sm font-medium text-foreground/50 mt-1">
                            {event.capacity} {t.opportunity?.applicants || (lang === 'ar' ? 'متقدم' : 'applicants')}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle(
                            event.status
                          )}`}
                        >
                          {t.status?.[event.status] || event.status}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 pt-3 border-t border-foreground/5">
                        <button
                          type="button"
                          onClick={() => openViewModal(event)}
                          title={t.buttons?.view || "View"}
                          className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900 shadow-sm border border-gray-200 hover:shadow hover:scale-105 active:scale-95"
                        >
                          <FaEye className="text-sm" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(event)}
                          title={t.buttons?.edit || "Edit"}
                          className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 transition hover:bg-emerald-600 hover:text-white shadow-sm border border-emerald-200 hover:shadow hover:scale-105 active:scale-95"
                        >
                          <FaPen className="text-sm" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          title={t.buttons?.delete || "Delete"}
                          className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 transition hover:bg-red-600 hover:text-white shadow-sm border border-red-200 hover:shadow hover:scale-105 active:scale-95"
                        >
                           <FaTrashCan className="text-sm" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      <OpportunityModal
        open={openModal}
        setOpen={setOpenModal}
        refresh={refreshDashboard}
        event={selectedEvent}
        mode={modalMode}
      />
    </motion.div>
  );
}

const STAT_COLORS = [
  // Primary brand color
  { border: "border-primary/20", bg: "bg-primary/10", text: "text-primary", from: "from-primary/20" },
  // Emerald accent
  { border: "border-emerald-500/20", bg: "bg-emerald-500/10", text: "text-emerald-500", from: "from-emerald-500/20" },
  // Amber accent (fallback to brand hue)
  { border: "border-[#febc5a]/20", bg: "bg-[#febc5a]/10", text: "text-[#febc5a]", from: "from-[#febc5a]/20" },
  // Purple accent
  { border: "border-purple-500/20", bg: "bg-purple-500/10", text: "text-purple-500", from: "from-purple-500/20" },
];

function StatCard({ title, value, index = 0 }: { title: string; value: number; index?: number }) {
  const c = STAT_COLORS[index % STAT_COLORS.length];
  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl border ${c.border} bg-gradient-to-br ${c.from} to-transparent p-5 sm:p-6 shadow-sm`}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
    >
      <p className={`text-xs font-bold uppercase tracking-widest ${c.text}/70`}>{title}</p>
      <motion.h3
        className={`mt-3 text-4xl font-black ${c.text} tracking-tighter`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.h3>
    </motion.div>
  );
}

function getStatusStyle(status: string) {
  switch (status) {
    case "open":
      // Use primary brand color for open opportunities
      return "bg-primary/10 text-primary border-primary/20";
    case "closed":
      // Muted gray for closed
      return "bg-foreground/10 text-foreground/60 border-foreground/20";
    case "draft":
      // Amber accent (fallback to brand hue)
      return "bg-primary/10 text-primary border-primary/20";
    case "completed":
      // Emerald accent for completed
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "cancelled":
      // Red for cancelled
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-foreground/10 text-foreground/60 border-foreground/20";
  }
}