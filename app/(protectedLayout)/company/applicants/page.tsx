"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/api";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import { applicantsTranslations } from "@/app/translations/applicants";
import {
  FaChevronDown,
  FaUsers,
  FaCheck,
  FaXmark,
  FaUserCheck,
  FaStar,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaCalendarDay,
  FaCrown,
  FaCircleCheck,
} from "react-icons/fa6";
import Modal from "@/app/components/Modals/Modal";

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

type ApplicantStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "attended";

type ApplicantItem = {
  id: number;
  volunteer_id: number;
  event_id: number;
  application_date: string;
  status: ApplicantStatus;
  first_name?: string;
  last_name?: string;
  email?: string;
  profile_picture?: string;
  title?: string;
  user_rating?: number;
  average_rating?: number;
  has_active_subscription?: number;
  is_id_verified?: number;
};

export default function Applicants() {
  const router = useRouter();
  const { lang } = useLang();

  const t =
    applicantsTranslations[lang as "ar" | "en"] ||
    applicantsTranslations.en;

  const [applications, setApplications] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTitle, setSearchTitle] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rateForm, setRateForm] = useState({ rating: 0, comment: "", app: null as any });

  const openRateModal = (app: ApplicantItem) => {
    setRateForm({ rating: 0, comment: "", app });
    setIsRateModalOpen(true);
  };

  const submitRating = async () => {
    if (!rateForm.rating) {
      Swal.fire({ icon: "warning", title: lang === "ar" ? "تنبيه" : "Warning", text: lang === "ar" ? "يرجى تحديد التقييم بالنجوم." : "Please select a star rating." });
      return;
    }

    try {
      await api.post(
        "/ratings",
        {
          opportunity_id: rateForm.app.event_id,
          target_id: rateForm.app.volunteer_id,
          rating_value: rateForm.rating,
          comment: rateForm.comment
        }
      );

      Swal.fire({
        icon: "success",
        title: lang === "ar" ? "نجاح" : "Success",
        text: lang === "ar" ? "تم تقييم المتطوع بنجاح" : "Volunteer rated successfully",
        confirmButtonColor: '#febc5a'
      });

      setIsRateModalOpen(false);
      getApplicants();
    } catch (e: any) {
      console.error(e);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e.response?.data?.error || "Failed to submit rating"
      });
    }
  };

  const openApplicantModal = async (volunteer_id: number, app: ApplicantItem) => {
    setIsModalOpen(true);
    setProfileLoading(true);
    setSelectedProfile({ ...app });
    try {
      const res = await api.get(`/volunteers?id=${volunteer_id}`);
      setSelectedProfile((prev: any) => ({ ...prev, ...res.data }));
    } catch (e) {
      console.error(e);
    }
    setProfileLoading(false);
  };

  const getApplicants = async () => {
    try {
      const res = await api.get(
        `/volunteer-applications/company?lang=${lang}`
      );

      setApplications(res.data);
    } catch (error) {
      console.log(error);
      setApplications([]);
    }
  };

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getApplicants();
      setLoading(false);
    };

    load();
  }, [lang]);

  const updateStatus = async (
    id: number,
    status: "accepted" | "rejected" | "attended"
  ) => {
    const confirm = await Swal.fire({
      icon: "question",
      title:
        status === "accepted"
          ? t.alerts.acceptTitle
          : status === "rejected"
            ? t.alerts.rejectTitle
            : t.alerts.attendedTitle,
      showCancelButton: true,
      confirmButtonText: t.alerts.confirm,
      cancelButtonText: t.alerts.cancel,
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.put(
        `/volunteer-applications/${id}`,
        { status }
      );

      await Swal.fire({
        icon: "success",
        title: t.alerts.success,
      });

      getApplicants();
    } catch (error: any) {
      if (error.response?.data?.error === "INSUFFICIENT_FUNDS") {
        Swal.fire({
          icon: "warning",
          title: lang === "ar" ? "رصيد غير كافٍ" : "Insufficient Balance",
          text: lang === "ar"
            ? "ليس لديك رصيد كافٍ لقبول هذا المتطوع. يرجى شحن محفظتك أولاً."
            : "You don't have enough balance to accept this volunteer. Please recharge your wallet first.",
          showCancelButton: true,
          confirmButtonText: lang === "ar" ? "اذهب للمحفظة" : "Go to Wallet",
          cancelButtonText: lang === "ar" ? "إلغاء" : "Cancel",
          confirmButtonColor: "#febc5a",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/company/wallet");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: t.alerts.error,
          text: error.response?.data?.message || ""
        });
      }
    }
  };

  const getStatusStyle = (status: ApplicantStatus) => {
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
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      lang === "ar" ? "ar-EG" : "en-US"
    );
  };

  const displayApplications = React.useMemo(() => {
    let result = [...applications];

    if (filterStatus !== "all") {
      result = result.filter(app => app.status === filterStatus);
    }

    if (searchTitle.trim() !== "") {
      const q = searchTitle.toLowerCase();
      result = result.filter(app => app.title && app.title.toLowerCase().includes(q));
    }

    return result;
  }, [applications, filterStatus, searchTitle]);

  const groupedApplications = React.useMemo(() => {
    const groups: Record<number, { title: string, apps: ApplicantItem[], stats: any }> = {};

    displayApplications.forEach(app => {
      if (!groups[app.event_id]) {
        groups[app.event_id] = {
          title: app.title || "Untitled Opportunity",
          apps: [],
          stats: { pending: 0, accepted: 0, attended: 0, rejected: 0, total: 0 }
        };
      }
      groups[app.event_id].apps.push(app);
      groups[app.event_id].stats.total++;
      if (app.status === 'pending') groups[app.event_id].stats.pending++;
      if (app.status === 'accepted') groups[app.event_id].stats.accepted++;
      if (app.status === 'attended') groups[app.event_id].stats.attended++;
      if (app.status === 'rejected') groups[app.event_id].stats.rejected++;
    });

    return Object.entries(groups).map(([id, data]) => ({
      event_id: Number(id),
      ...data,
      // Sort subscribers to top within each group
      apps: data.apps.sort((a, b) => (b.has_active_subscription || 0) - (a.has_active_subscription || 0))
    })).sort((a, b) => b.stats.pending - a.stats.pending); // Show opportunities with most pending applicants first
  }, [displayApplications]);

  const toggleGroup = (eventId: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    groupedApplications.forEach(g => all[g.event_id] = true);
    setExpandedGroups(all);
  };

  const collapseAll = () => setExpandedGroups({});

  if (loading) {
    return (
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="p-6 text-sm text-foreground/70"
      >
        {t.loading}
      </div>
    );
  }

  return (
    <motion.div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen border border-foreground/10 bg-background p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      {/* Header */}

      <motion.div
        className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-[2rem] bg-gradient-to-r from-foreground/5 to-foreground/5 p-6 md:p-8 border border-foreground/5 shadow-sm"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">
            {t.title}
          </h2>

          <p className="text-sm text-foreground/60">
            {t.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 sm:mt-0">

          <div className="flex bg-foreground/5 rounded-xl border border-foreground/10 px-3 py-2 text-sm items-center shadow-sm w-full sm:w-64">
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث باسم الفرصة...' : 'Search by opportunity...'}
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="bg-transparent outline-none w-full text-foreground/80 placeholder:text-foreground/40"
            />
          </div>

          <div className="flex bg-foreground/5 rounded-xl border border-foreground/10 px-4 py-2 text-sm items-center shadow-sm w-full sm:w-auto">
            <label className="mr-3 text-foreground/70 font-medium whitespace-nowrap">
              {lang === 'ar' ? 'تصفية حسب الحالة:' : 'Filter by Status:'}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent outline-none font-semibold cursor-pointer text-foreground focus:ring-0"
            >
              <option value="all">{lang === 'ar' ? "الكل" : "All"}</option>
              <option value="pending">{t.status?.pending || "Pending"}</option>
              <option value="accepted">{t.status?.accepted || "Accepted"}</option>
              <option value="rejected">{t.status?.rejected || "Rejected"}</option>
              <option value="attended">{t.status?.attended || "Attended"}</option>
            </select>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-end gap-3 mb-4 px-2">
        <button
          onClick={expandAll}
          className="text-xs font-bold text-foreground/40 hover:text-[#febc5a] transition uppercase tracking-widest"
        >
          {lang === 'ar' ? 'توسيع الكل' : 'Expand All'}
        </button>
        <span className="text-foreground/10">|</span>
        <button
          onClick={collapseAll}
          className="text-xs font-bold text-foreground/40 hover:text-[#febc5a] transition uppercase tracking-widest"
        >
          {lang === 'ar' ? 'طي الكل' : 'Collapse All'}
        </button>
      </div>

      <div className="space-y-6">
        {groupedApplications.length === 0 ? (
          <div className="text-center py-20 bg-foreground/3 rounded-[2rem] border border-dashed border-foreground/10">
            <p className="text-foreground/40 font-medium">{t.table.empty}</p>
          </div>
        ) : (
          groupedApplications.map((group) => {
            const isExpanded = expandedGroups[group.event_id];
            return (
              <motion.div
                key={group.event_id}
                layout
                className={`overflow-hidden rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'bg-background border-foreground/10 shadow-xl' : 'bg-foreground/3 border-foreground/5 hover:border-foreground/10'
                  }`}
              >
                {/* Group Header */}
                <div
                  onClick={() => toggleGroup(group.event_id)}
                  className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-[#febc5a] text-black' : 'bg-foreground/5 text-foreground/40'
                      }`}>
                      <FaUsers size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-foreground tracking-tight">{group.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest bg-foreground/5 px-2 py-0.5 rounded-md">
                          {group.stats.total} {lang === 'ar' ? 'متقدم' : 'Applicants'}
                        </span>
                        {group.stats.pending > 0 && (
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                            {group.stats.pending} {lang === 'ar' ? 'قيد الانتظار' : 'Pending'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{lang === 'ar' ? 'قيد الانتظار' : 'Pending'}</p>
                        <p className="text-sm font-black text-amber-500">{group.stats.pending}</p>
                      </div>
                      <div className="h-6 w-px bg-foreground/10" />
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{lang === 'ar' ? 'تم القبول' : 'Accepted'}</p>
                        <p className="text-sm font-black text-emerald-500">{group.stats.accepted}</p>
                      </div>
                      <div className="h-6 w-px bg-foreground/10" />
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">{lang === 'ar' ? 'تم الحضور' : 'Attended'}</p>
                        <p className="text-sm font-black text-blue-500">{group.stats.attended}</p>
                      </div>
                    </div>

                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-foreground text-background' : 'bg-foreground/5 text-foreground/40'}`}>
                      <FaChevronDown size={14} />
                    </div>
                  </div>
                </div>

                {/* Group Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-foreground/5"
                    >
                      <div className="overflow-x-auto p-4 md:p-6">
                        <table className="min-w-full border-separate border-spacing-y-2">
                          <thead>
                            <tr className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest text-center">
                              <th className="px-4 py-2">{t.table.applicant}</th>
                              <th className="px-4 py-2">{t.table.email}</th>
                              <th className="px-4 py-2">{t.table.status}</th>
                              <th className="px-4 py-2">{t.table.applicationDate}</th>
                              <th className="px-4 py-2">{t.table.actions}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.apps.map((app, appIdx) => (
                              <motion.tr
                                key={app.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: appIdx * 0.05 }}
                                className="rounded-2xl bg-foreground/[0.02] text-sm text-center group/row hover:bg-foreground/[0.04] transition-colors"
                              >
                                <td className="px-4 py-4 font-bold">
                                  <div className="flex items-center justify-center gap-3">
                                    <div className="relative">
                                      <button
                                        onClick={() => openApplicantModal(app.volunteer_id, app)}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-foreground transition hover:scale-110 active:scale-95 border overflow-hidden ${
                                          Number(app.has_active_subscription) > 0 ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-foreground/10'
                                        }`}
                                      >
                                        {app.profile_picture ? (
                                          <img src={app.profile_picture} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                          <FaUser size={14} />
                                        )}
                                      </button>
                                      {Number(app.has_active_subscription) > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-black shadow-md" title={lang === 'ar' ? 'مشترك ذهبي' : 'Gold Subscriber'}>
                                          <FaCrown size={8} />
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-start gap-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="truncate max-w-[120px]">{app.first_name} {app.last_name}</span>
                                        {Number(app.is_id_verified) === 1 && (
                                          <FaCircleCheck size={13} className="text-blue-500 shrink-0" title={lang === 'ar' ? 'هوية موثقة' : 'Verified ID'} />
                                        )}
                                      </div>
                                      {app.average_rating && (
                                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                                          <FaStar size={10} /> {app.average_rating}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-foreground/60">{app.email}</td>
                                <td className="px-4 py-4">
                                  <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md tracking-wider ${getStatusStyle(app.status)}`}>
                                    {t.status[app.status]}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-foreground/40 text-xs font-medium">{formatDate(app.application_date)}</td>
                                <td className="px-4 py-4">
                                  <div className="flex justify-center items-center gap-2">
                                    <button
                                      onClick={() => updateStatus(app.id, "accepted")}
                                      disabled={app.status === "accepted" || app.status === "attended"}
                                      className={`flex items-center justify-center h-8 w-8 rounded-full transition ${app.status === "accepted" || app.status === "attended"
                                        ? "bg-foreground/5 text-foreground/20 cursor-not-allowed"
                                        : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                        }`}
                                    >
                                      <FaCheck size={12} />
                                    </button>
                                    <button
                                      onClick={() => updateStatus(app.id, "rejected")}
                                      disabled={app.status === "rejected" || app.status === "attended"}
                                      className={`flex items-center justify-center h-8 w-8 rounded-full transition ${app.status === "rejected" || app.status === "attended"
                                        ? "bg-foreground/5 text-foreground/20 cursor-not-allowed"
                                        : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                        }`}
                                    >
                                      <FaXmark size={12} />
                                    </button>
                                    <button
                                      onClick={() => updateStatus(app.id, "attended")}
                                      disabled={app.status !== "accepted"}
                                      className={`flex items-center justify-center h-8 w-8 rounded-full transition ${app.status !== "accepted"
                                        ? "bg-foreground/5 text-foreground/20 cursor-not-allowed"
                                        : "bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white"
                                        }`}
                                    >
                                      <FaUserCheck size={12} />
                                    </button>

                                    {app.status === "attended" && (
                                      !app.user_rating ? (
                                        <button
                                          onClick={() => openRateModal(app)}
                                          className="flex items-center justify-center h-8 w-8 rounded-full transition bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white"
                                        >
                                          <FaStar size={12} />
                                        </button>
                                      ) : (
                                        <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-black text-amber-500 border border-amber-500/20">
                                          {app.user_rating} <FaStar size={8} />
                                        </div>
                                      )
                                    )}
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>



      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t.table?.applicant || "Applicant Details"}
        maxWidth="max-w-md"
      >
        {profileLoading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground/30 border-t-foreground"></div>
          </div>
        ) : selectedProfile ? (
          <div className="space-y-4 text-sm text-foreground/80" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="flex flex-col items-center justify-center mb-6 mt-4 text-center">
              <div className={`h-28 w-28 bg-gradient-to-br from-foreground/80 to-foreground rounded-full flex items-center justify-center text-5xl text-background shadow-xl shadow-foreground/20 mb-4 border-4 overflow-hidden ${
                Number(selectedProfile.has_active_subscription) > 0 ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-background'
              }`}>
                {selectedProfile.profile_picture ? (
                  <img src={selectedProfile.profile_picture} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <FaUser />
                )}
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {selectedProfile.first_name} {selectedProfile.last_name}
                {Number(selectedProfile.has_active_subscription) > 0 && (
                  <FaCrown className="text-amber-500" title={lang === 'ar' ? 'مشترك ذهبي' : 'Gold Subscriber'} />
                )}
                {Number(selectedProfile.is_id_verified) === 1 && (
                  <FaUserCheck className="text-blue-500" title={lang === 'ar' ? 'هوية موثقة' : 'ID Verified'} />
                )}
              </h3>

              {selectedProfile.average_rating && (
                <div className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-bold tracking-wide text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 w-max mx-auto">
                  {selectedProfile.average_rating} <FaStar size={14} className="mb-0.5" />
                </div>
              )}
              {selectedProfile.title && (
                <div className="mt-3 inline-flex">
                  <span className="text-xs font-bold text-foreground px-4 py-1.5 bg-foreground/5 rounded-full border border-foreground/10 shadow-sm">
                    {lang === "ar" ? "متقدم لفرصة:" : "Applied for:"} <span className="text-foreground ml-1">{selectedProfile.title}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="bg-foreground/5 p-4 rounded-xl space-y-3">
              <p className="flex items-center gap-3"><FaEnvelope className="text-foreground/50 text-lg" /> {selectedProfile.email}</p>
              {selectedProfile.phone && <p className="flex items-center gap-3"><FaPhone className="text-foreground/50 text-lg" /> {selectedProfile.phone}</p>}
              {selectedProfile.gender && <p className="flex items-center gap-3"><FaVenusMars className="text-foreground/50 text-lg" /> <span className="capitalize">{selectedProfile.gender}</span></p>}
              {selectedProfile.date_of_birth && (
                <p className="flex items-center gap-3">
                  <FaCalendarDay className="text-foreground/50 text-lg" /> 
                  {new Date(selectedProfile.date_of_birth).toLocaleDateString()} 
                  <span className="text-foreground/40 font-bold ml-1">
                    ({calculateAge(selectedProfile.date_of_birth)} {lang === 'ar' ? 'سنة' : 'years'})
                  </span>
                </p>
              )}
            </div>

            {selectedProfile.description && (
              <div className="bg-foreground/5 p-4 rounded-xl mt-2">
                <p className="leading-relaxed">{selectedProfile.description}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="p-4 text-center">Failed to load data.</p>
        )}
      </Modal>

      <Modal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        title={lang === "ar" ? "تقييم المتطوع" : "Rate Volunteer"}
        maxWidth="max-w-md"
      >
        <div className="space-y-6" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRateForm({ ...rateForm, rating: star })}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <FaStar
                    size={40}
                    className={`transition-colors ${star <= rateForm.rating
                      ? "text-yellow-500 drop-shadow-md"
                      : "text-foreground/10"
                      }`}
                  />
                </button>
              ))}
            </div>
            {rateForm.rating > 0 && (
              <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                {rateForm.rating} {lang === "ar" ? "من 5 نجوم" : "out of 5 stars"}
              </p>
            )}
            <textarea
              className="w-full mt-4 rounded-xl border border-foreground/10 bg-foreground/5 p-4 text-sm text-foreground outline-none transition focus:border-[#febc5a] focus:bg-background custom-scrollbar"
              rows={4}
              placeholder={lang === "ar" ? "أضف تعليقاً حول أداء المتطوع (اختياري)..." : "Add a comment about the volunteer's performance (optional)..."}
              value={rateForm.comment}
              onChange={(e) => setRateForm({ ...rateForm, comment: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <button
              onClick={submitRating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#febc5a] py-3.5 font-semibold text-black shadow-md transition hover:bg-[#eab308] active:scale-[0.98]"
            >
              {lang === "ar" ? "إرسال التقييم" : "Submit Review"}
            </button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
}