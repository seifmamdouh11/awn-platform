"use client";

import React, { useState, useEffect } from "react";
import api from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import {
  Wallet,
  ArrowDownCircle,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Plus,
  Loader2,
  AlertCircle,
  TrendingUp,
  Phone
} from "lucide-react";
import Swal from "sweetalert2";

const walletTranslations = {
  en: {
    title: "My Wallet",
    subtitle: "Manage your earnings and withdrawal requests",
    balance: "Total Balance",
    withdraw: "Request Withdrawal",
    history: "Withdrawal History",
    historyDesc: "Track your previous payment requests",
    date: "Date",
    amount: "Amount",
    status: "Status",
    netAmount: "Net Amount (After 10% Admin Fee)",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    empty: "No withdrawal history found",
    modalTitle: "Request Withdrawal",
    modalDesc: "Specify the amount you wish to withdraw from your balance.",
    amountLabel: "Withdrawal Amount",
    totalAfterFees: "You will receive",
    confirmWithdraw: "Submit Request",
    cancel: "Cancel",
    errorBalance: "Insufficient balance",
    withdrawSuccess: "Withdrawal request submitted successfully! Admin will review it soon.",
    minAmount: "Minimum withdrawal amount is 50 EGP",
    currency: "EGP",
    methodLabel: "Withdrawal Method",
    methods: {
      wallet: "Mobile Wallet",
      paypal: "PayPal",
      bank: "Bank Account"
    },
    accountLabels: {
      wallet: "Wallet Phone Number",
      paypal: "PayPal Email",
      bank: "Bank Account Number"
    },
    deposit: "Deposit Funds",
    depositModalTitle: "Deposit to Wallet",
    depositModalDesc: "Choose a payment method and enter the amount you wish to deposit.",
    depositSuccess: "Deposit request submitted! Admin will verify your transaction shortly.",
    refLabel: "Reference / Transaction ID",
    feeNote: "Standard withdrawal deduction: 5%",
    proFeeNote: "PRO Member: 0% withdrawal deduction!",
    deposits: "Deposit History",
    withdrawals: "Withdrawals",
    noDeposits: "No deposit requests found",
    adminNotes: "Admin Notes"
  },
  ar: {
    title: "محفظتي",
    subtitle: "إدارة أرباحك وطلبات السحب الخاصة بك",
    balance: "إجمالي الرصيد",
    withdraw: "طلب سحب",
    history: "سجل السحوبات",
    historyDesc: "تتبع طلبات الدفع السابقة الخاصة بك",
    date: "التاريخ",
    amount: "المبلغ",
    status: "الحالة",
    netAmount: "المبلغ الصافي (بعد خصم 10% عمولة)",
    pending: "قيد الانتظار",
    approved: "تمت الموافقة",
    rejected: "مرفوض",
    empty: "لا يوجد سجل سحوبات حتى الآن",
    modalTitle: "طلب سحب جديد",
    modalDesc: "حدد المبلغ الذي تريد سحبه من رصيدك الحالي.",
    amountLabel: "مبلغ السحب",
    totalAfterFees: "سوف تستلم",
    confirmWithdraw: "إرسال الطلب",
    cancel: "إلغاء",
    errorBalance: "الرصيد غير كافٍ",
    withdrawSuccess: "تم تقديم طلب السحب بنجاح! سيقوم المسؤول بمراجعته قريباً.",
    minAmount: "الحد الأدنى للسحب هو 50 جنيه مصري",
    currency: "جنيه",
    methodLabel: "طريقة السحب",
    methods: {
      wallet: "محفظة إلكترونية",
      paypal: "بايبال",
      bank: "حساب بنكي"
    },
    accountLabels: {
      wallet: "رقم المحفظة",
      paypal: "بريد بايبال",
      bank: "رقم الحساب البنكي"
    },
    deposit: "إيداع رصيد",
    depositModalTitle: "إيداع في المحفظة",
    depositModalDesc: "اختر طريقة الدفع وأدخل المبلغ الذي تريد إيداعه.",
    depositSuccess: "تم تقديم طلب الإيداع! سيتحقق المسؤول من عمليتك قريباً.",
    refLabel: "رقم المرجع / العملية",
    feeNote: "خصم السحب العادي: 5%",
    proFeeNote: "عضو PRO: خصم سحب 0%!",
    deposits: "سجل الإيداعات",
    withdrawals: "السحوبات",
    noDeposits: "لا يوجد سجل إيداعات حتى الآن",
    adminNotes: "ملاحظات المسؤول"
  }
};

export default function WalletPage() {
  const { lang } = useLang();
  const t = lang === "ar" ? walletTranslations.ar : walletTranslations.en;
  const isRTL = lang === "ar";

  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"withdrawALS" | "DEPOSITS">("withdrawALS");
  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"wallet" | "paypal" | "bank">("wallet");
  const [accountDetails, setAccountDetails] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Subscription State
  const [hasPro, setHasPro] = useState(false);

  // Deposit State
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState<"WALLET" | "PAYPAL" | "BANK">("WALLET");
  const [referenceId, setReferenceId] = useState("");
  const [depositing, setDepositing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const resProfile = await api.get("/volunteers/me");
      const resHistory = await api.get("/withdrawals/me");
      const resDeposits = await api.get("/volunteer-wallet/requests");
      const resSub = await api.get("/subscriptions/me");

      setBalance(Number(resProfile.data.balance || 0));
      setProfilePhone(resProfile.data.phone || "");
      if (!accountDetails) setAccountDetails(resProfile.data.phone || "");
      setHistory(Array.isArray(resHistory.data) ? resHistory.data : []);
      setDepositHistory(Array.isArray(resDeposits.data) ? resDeposits.data : []);
      setHasPro(!!resSub.data);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);

    if (amount < 50) {
      return Swal.fire({ icon: "error", title: t.minAmount });
    }

    if (amount > balance) {
      return Swal.fire({ icon: "error", title: t.errorBalance });
    }

    try {
      setSubmitting(true);
      await api.post(
        "/withdrawals",
        {
          amount,
          method: selectedMethod,
          accountDetails
        }
      );

      await Swal.fire({ icon: "success", title: t.withdrawSuccess });
      setModalOpen(false);
      setWithdrawAmount("");
      fetchData(); // Refresh balance and history
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.error || "Error submitting request"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDepositRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);

    if (amount < 50) {
      return Swal.fire({ icon: "error", title: t.minAmount });
    }

    try {
      setDepositing(true);
      const res = await api.post("/volunteer-wallet/deposit", {
        amount,
        method: depositMethod,
        reference_id: referenceId
      });

      await Swal.fire({ 
        icon: "success", 
        title: depositMethod === "PAYPAL" ? "Instant Deposit Success!" : t.depositSuccess 
      });
      
      setDepositModalOpen(false);
      setDepositAmount("");
      setReferenceId("");
      fetchData(); 
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: error?.response?.data?.error || "Error processing deposit"
      });
    } finally {
      setDepositing(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle2 size={14} />;
      case "rejected": return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-4 md:p-8 space-y-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-foreground/50 font-medium">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDepositModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground font-black rounded-2xl text-background shadow-xl transition-all"
          >
            <Plus size={20} />
            {t.deposit}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-[#febc5a] to-[#d97706] text-black font-black rounded-2xl shadow-xl shadow-[#febc5a]/20 transition-all hover:shadow-[#febc5a]/30"
          >
            <ArrowDownCircle size={20} />
            {t.withdraw}
          </motion.button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Balance & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#febc5a] to-[#d97706] text-black relative overflow-hidden shadow-2xl"
            whileHover={{ y: -5 }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-black/10 rounded-2xl backdrop-blur-md">
                <Wallet className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest opacity-70">
                  {t.balance}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-black tracking-tighter">
                    {balance.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold opacity-80">{t.currency}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Info Card */}
          <div className="p-6 rounded-[2rem] border border-foreground/5 bg-foreground/[0.02] backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <TrendingUp size={20} />
              </div>
              <span className="font-bold text-sm">{isRTL ? "أداء الأرباح" : "Earnings Performance"}</span>
            </div>
            <p className="text-xs font-medium text-foreground/40 leading-relaxed">
              {isRTL
                ? "يتم تحديث رصيدك تلقائياً عند تسجيل حضورك في الفرص التطوعية المدفوعة."
                : "Your balance is updated automatically when your attendance is confirmed in paid volunteer opportunities."}
            </p>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <div className="rounded-[2.5rem] border border-foreground/5 bg-background shadow-xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-foreground/5 rounded-2xl">
                  <History className="text-foreground/60 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg">{activeTab === "withdrawALS" ? t.history : t.deposits}</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest text-foreground/30">{t.historyDesc}</p>
                </div>
              </div>

              <div className="p-1 bg-foreground/5 rounded-2xl flex items-center self-start">
                  <button 
                    onClick={() => setActiveTab("withdrawALS")}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "withdrawALS" ? "bg-background shadow-lg shadow-black/5 text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
                  >
                    {t.withdrawals}
                  </button>
                  <button 
                    onClick={() => setActiveTab("DEPOSITS")}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "DEPOSITS" ? "bg-background shadow-lg shadow-black/5 text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
                  >
                    {t.deposits}
                  </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left" dir={isRTL ? "rtl" : "ltr"}>
                <thead className="bg-foreground/[0.01]">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-foreground/30 border-b border-foreground/5">
                    <th className="px-6 py-4">{t.date}</th>
                    <th className="px-6 py-4">{isRTL ? "الطريقة" : "Method"}</th>
                    <th className="px-6 py-4">{t.amount}</th>
                    <th className="px-6 py-4 text-center">{t.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  <AnimatePresence mode="wait">
                    {activeTab === "withdrawALS" ? (
                      history.length === 0 ? (
                        <motion.tr key="empty-withdrawals" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <td colSpan={4} className="px-6 py-12 text-center text-foreground/30">
                            <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p className="font-bold text-sm tracking-tight">{t.empty}</p>
                          </td>
                        </motion.tr>
                      ) : (
                        history.map((record, i) => (
                          <motion.tr
                            key={`withdraw-${record.id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="group hover:bg-foreground/[0.01] transition-colors"
                          >
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="text-sm font-bold text-foreground/70">
                                {new Date(record.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-foreground/60 uppercase tracking-wider">
                                  {t.methods[record.method as keyof typeof t.methods] || record.method}
                                </span>
                                <span className="text-[10px] font-bold text-foreground/30 truncate max-w-[120px]">
                                  {record.account_details}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-foreground/80">
                                  {record.amount_requested} <span className="text-[10px] font-bold opacity-40">{t.currency}</span>
                                </span>
                                <span className="text-[10px] font-bold text-foreground/30">
                                  {isRTL ? `صافي: ${record.net_amount}` : `Net: ${record.net_amount}`} {t.currency}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(record.status)}`}>
                                  {getStatusIcon(record.status)}
                                  {t[record.status as keyof typeof t] as string}
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )
                    ) : (
                      depositHistory.length === 0 ? (
                        <motion.tr key="empty-deposits" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <td colSpan={4} className="px-6 py-12 text-center text-foreground/30">
                            <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p className="font-bold text-sm tracking-tight">{t.noDeposits}</p>
                          </td>
                        </motion.tr>
                      ) : (
                        depositHistory.map((record, i) => (
                          <motion.tr
                            key={`deposit-${record.id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="group hover:bg-foreground/[0.01] transition-colors"
                          >
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="text-sm font-bold text-foreground/70">
                                {new Date(record.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-foreground/60 uppercase tracking-wider">
                                  {t.methods[record.method.toLowerCase() as keyof typeof t.methods] || record.method}
                                </span>
                                <span className="text-[10px] font-bold text-foreground/30 truncate max-w-[120px]">
                                  {record.reference_id}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-foreground/80">
                                  {record.amount} <span className="text-[10px] font-bold opacity-40">{t.currency}</span>
                                </span>
                                {record.admin_notes && (
                                  <span className="text-[10px] font-bold text-foreground/30 italic">
                                    {t.adminNotes}: {record.admin_notes}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(record.status.toLowerCase())}`}>
                                  {getStatusIcon(record.status.toLowerCase())}
                                  {t[record.status.toLowerCase() as keyof typeof t] as string}
                                </span>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-background border border-foreground/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
              dir={isRTL ? "rtl" : "ltr"}
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-foreground/5 bg-gradient-to-br from-foreground/[0.02] to-transparent">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-[#febc5a]/10 rounded-2xl text-[#d97706]">
                    <ArrowDownCircle size={24} />
                  </div>
                  <h2 className="text-2xl font-black">{t.modalTitle}</h2>
                </div>
                <p className="text-sm text-foreground/40 font-medium">{t.modalDesc}</p>
              </div>

              <form onSubmit={handleWithdrawRequest} className="p-8 space-y-6">

                {/* Method Selection */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">
                    {t.methodLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["wallet", "paypal", "bank"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setSelectedMethod(m);
                          if (m === "wallet") setAccountDetails(profilePhone);
                          else if (m === "paypal" && accountDetails === profilePhone) setAccountDetails("");
                        }}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selectedMethod === m
                          ? "border-[#febc5a] bg-[#febc5a]/10 text-[#d97706]"
                          : "border-foreground/5 bg-foreground/5 text-foreground/40 hover:border-foreground/10"
                          }`}
                      >
                        {m === "wallet" ? <Phone size={20} /> : m === "paypal" ? <Plus size={20} /> : <AlertCircle size={20} />}
                        <span className="text-[10px] font-black uppercase tracking-tighter">{t.methods[m]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">
                    {t.accountLabels[selectedMethod]}
                  </label>
                  <input
                    type={selectedMethod === "paypal" ? "email" : "text"}
                    required
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="w-full h-14 px-6 bg-foreground/5 border border-foreground/5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#febc5a]/50 transition-all"
                    placeholder="..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">
                    {t.amountLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={50}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full h-16 px-6 bg-foreground/5 border border-foreground/5 rounded-2xl text-xl font-black focus:outline-none focus:ring-2 focus:ring-[#febc5a]/50 transition-all"
                      placeholder="0.00"
                    />
                    <div className={`absolute inset-y-0 ${isRTL ? 'left-6' : 'right-6'} flex items-center pointer-events-none`}>
                      <span className="font-bold text-foreground/30">{t.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Calculation breakdown */}
                {withdrawAmount && Number(withdrawAmount) >= 50 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-foreground/40">{t.totalAfterFees}</span>
                      <span className="text-lg font-black text-emerald-600">
                        {(Number(withdrawAmount) * (hasPro ? 1.0 : 0.95)).toFixed(2)} {t.currency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-600/60 font-medium">
                      <AlertCircle size={12} />
                      {hasPro ? t.proFeeNote : t.feeNote}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-3 py-4 rounded-2xl border border-foreground/10 font-bold text-foreground/60 transition hover:bg-foreground/5 active:scale-95"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] px-3 py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : t.confirmWithdraw}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deposit Modal */}
      <AnimatePresence>
        {depositModalOpen && (
          <div className="fixed inset-0 z-[100] grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDepositModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-background border border-foreground/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="p-8 border-b border-foreground/5 bg-gradient-to-br from-foreground/[0.02] to-transparent">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-foreground/10 rounded-2xl text-foreground">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-black">{t.depositModalTitle}</h2>
                </div>
                <p className="text-sm text-foreground/40 font-medium">{t.depositModalDesc}</p>
              </div>

              <form onSubmit={handleDepositRequest} className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">
                    {t.methodLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["WALLET", "PAYPAL", "BANK"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDepositMethod(m)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${depositMethod === m
                          ? "border-[#febc5a] bg-[#febc5a]/10 text-[#d97706]"
                          : "border-foreground/5 bg-foreground/5 text-foreground/40 hover:border-foreground/10"
                          }`}
                      >
                        {m === "WALLET" ? <Phone size={20} /> : m === "PAYPAL" ? <Plus size={20} /> : <AlertCircle size={20} />}
                        <span className="text-[10px] font-black uppercase tracking-tighter">{t.methods[m.toLowerCase() as keyof typeof t.methods]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {depositMethod !== "PAYPAL" && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">
                      {t.refLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      className="w-full h-14 px-6 bg-foreground/5 border border-foreground/5 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#febc5a]/50 transition-all"
                      placeholder="Transaction ID / Ref #"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40 px-1">
                    {t.amountLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={50}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full h-16 px-6 bg-foreground/5 border border-foreground/5 rounded-2xl text-xl font-black focus:outline-none focus:ring-2 focus:ring-[#febc5a]/50 transition-all"
                      placeholder="0.00"
                    />
                    <div className={`absolute inset-y-0 ${isRTL ? 'left-6' : 'right-6'} flex items-center pointer-events-none`}>
                      <span className="font-bold text-foreground/30">{t.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDepositModalOpen(false)}
                    className="flex-1 px-3 py-4 rounded-2xl border border-foreground/10 font-bold text-foreground/60 transition hover:bg-foreground/5 active:scale-95"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={depositing}
                    className="flex-[2] px-3 py-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {depositing ? <Loader2 className="animate-spin w-5 h-5" /> : t.deposit}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

