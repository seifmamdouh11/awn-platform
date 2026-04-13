"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import api from "@/app/utils/api";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";

const translations = {
  en: {
    title: "Company Wallet",
    available: "Available Balance",
    locked: "In Escrow (Locked)",
    total: "Total Funds",
    recentTransactions: "Recent Transactions",
    deposit: "Deposit Funds",
    depositTitle: "Deposit to Wallet",
    amount: "Amount (EGP)",
    method: "Payment Method",
    paypal: "PayPal / Credit Card",
    bank: "Bank Transfer",
    wallet: "Mobile Wallet",
    refPlaceholder: "Transaction/Reference Number",
    submit: "Submit Deposit",
    waitAdmin: "Waiting for admin approval...",
    history: "Transaction History",
    noTransactions: "No transactions yet.",
    bankInfo: "Transfer to: AWN Foundation\nBank: CIB Egypt\nIBAN: EG0010002000300040005000\nBIC: CIBEGVXXX",
    mobileInfo: "Send to Vodafone Cash: 01012345678",
    successDeposit: "Funds added successfully!",
    pendingDeposit: "Deposit request submitted. Please wait for admin verification.",
    depositRequests: "Deposit Tracking",
    noRequests: "No pending or past deposit requests.",
    status: "Status",
    grossCapital: "Total Account Value",
    provisioned: "Reserved for Volunteers",
    date: "Date",

  },
  ar: {
    title: "محفظة الشركة",
    available: "الرصيد المتاح",
    locked: "في الضمان (محجوز)",
    total: "إجمالي الأموال",
    recentTransactions: "أحدث العمليات",
    deposit: "إيداع أموال",
    depositTitle: "إيداع في المحفظة",
    amount: "المبلغ (ج.م)",
    method: "طريقة الدفع",
    paypal: "باي بال / بطاقة ائتمان",
    bank: "تحويل بنكي",
    wallet: "محفظة موبايل",
    refPlaceholder: "رقم العملية / المرجع",
    submit: "إرسال الإيداع",
    waitAdmin: "في انتظار موافقة المسؤول...",
    history: "سجل العمليات",
    noTransactions: "لا توجد عمليات بعد.",
    bankInfo: "حول إلى: مؤسسة عون (AWN)\nالبنك: CIB مصر\nIBAN: EG0010002000300040005000\nBIC: CIBEGVXXX",
    mobileInfo: "حول إلى فودافون كاش: 01012345678",
    successDeposit: "تمت إضافة الأموال بنجاح!",
    pendingDeposit: "تم إرسال طلب الإيداع. يرجى الانتظار لحين مراجعة المسؤول.",
    depositRequests: "تتبع الإيداعات",
    noRequests: "لا توجد طلبات إيداع سابقة أو معلقة.",
    status: "الحالة",
    grossCapital: "إجمالي قيمة الحساب",
    provisioned: "محجوز للمتطوعين",
    date: "التاريخ",
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CompanyWalletPage() {
  const { lang } = useLang();
  const t = lang === "ar" ? translations.ar : translations.en;
  const isRTL = lang === "ar";

  const [wallet, setWallet] = useState({ balance: 0, locked_balance: 0, commission_rate: 12 });
  const [transactions, setTransactions] = useState([]);
  const [depositRequests, setDepositRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositData, setDepositData] = useState({ amount: "", method: "PAYPAL", reference_id: "" });

  const fetchWallet = async () => {
    try {
      const wRes = await api.get("/company-wallet/me");
      setWallet(wRes.data);
      const tRes = await api.get("/company-wallet/transactions");
      setTransactions(tRes.data);
      const rRes = await api.get("/company-wallet/requests");
      setDepositRequests(rRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/company-wallet/deposit", depositData);

      Swal.fire({
        icon: depositData.method === "PAYPAL" ? "success" : "info",
        title: depositData.method === "PAYPAL" ? t.successDeposit : t.pendingDeposit,
        timer: 3000,
        showConfirmButton: false
      });

      setIsDepositOpen(false);
      setDepositData({ amount: "", method: "PAYPAL", reference_id: "" });
      fetchWallet();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.error || "Failed to process deposit"
      });
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="h-8 w-8 border-4 border-[#febc5a] border-t-transparent rounded-full" />
  </div>;

  return (
    <div className={`min-h-screen bg-background p-6 md:p-10 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">{t.title}</h1>
            <p className="text-foreground/60 font-medium">Manage your funds and escrow safety.</p>
          </div>
          <button
            onClick={() => setIsDepositOpen(true)}
            className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-[#febc5a] to-[#d97706] text-black font-bold shadow-lg shadow-[#febc5a]/20 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowUpRight size={20} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            {t.deposit}
          </button>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="rounded-3xl border border-foreground/5 bg-background p-8 shadow-sm group hover:border-[#febc5a]/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-[#febc5a]/10 flex items-center justify-center text-[#febc5a]">
                <Wallet size={24} />
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
                {t.available}
              </div>
            </div>
            <p className="text-4xl font-black text-foreground tabular-nums">
              {Number(wallet.balance).toLocaleString()} <span className="text-lg text-foreground/40 font-bold">EGP</span>
            </p>
            <p className="mt-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-none">
              Spendable Balance
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="rounded-3xl border border-foreground/5 bg-background p-8 shadow-sm group hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock size={24} />
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider">
                {t.provisioned}
              </div>
            </div>
            <p className="text-4xl font-black text-foreground tabular-nums">
              {Number(wallet.locked_balance).toLocaleString()} <span className="text-lg text-foreground/40 font-bold">EGP</span>
            </p>
            <p className="mt-2 text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-none">
              Reserved for Volunteers
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="rounded-3xl border border-foreground/5 bg-gradient-to-br from-[#febc5a]/5 to-transparent p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/40">
                <Banknote size={24} />
              </div>
              <div className="px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-bold uppercase tracking-wider">
                {t.grossCapital}
              </div>
            </div>
            <p className="text-4xl font-black text-foreground tabular-nums">
              {(Number(wallet.balance) + Number(wallet.locked_balance)).toLocaleString()} <span className="text-lg text-foreground/40 font-bold">EGP</span>
            </p>
            <div className="mt-4 pt-4 border-t border-foreground/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Platform Fee</span>
              <span className="text-xs font-black text-[#febc5a]">12%</span>
            </div>
          </motion.div>
        </div>

        {/* Deposit Status Tracking */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.35 }} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Clock size={20} className="text-[#febc5a]" />
              {t.depositRequests}
            </h2>
          </div>
          <div className="rounded-3xl border border-foreground/5 bg-background overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-foreground/5 text-left rtl:text-right">
                  <tr className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    <th className="p-4">{t.date}</th>
                    <th className="p-4">{t.amount}</th>
                    <th className="p-4">{t.method}</th>
                    <th className="p-4">{t.status}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {depositRequests.length === 0 ? (
                    <tr><td colSpan={4} className="p-12 text-center text-foreground/30 font-medium">{t.noRequests}</td></tr>
                  ) : (
                    depositRequests.map((req: any) => (
                      <tr key={req.id} className="text-sm">
                        <td className="p-4 text-foreground/60">{new Date(req.created_at).toLocaleDateString()}</td>
                        <td className="p-4 font-black">{Number(req.amount).toLocaleString()} EGP</td>
                        <td className="p-4 uppercase">{req.method}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${req.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                              req.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' : 'bg-[#febc5a]/10 text-[#febc5a]'
                            }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Clock size={20} className="text-[#febc5a]" />
              {t.history}
            </h2>
          </div>

          <div className="rounded-3xl border border-foreground/5 bg-background overflow-hidden shadow-sm">
            {transactions.length === 0 ? (
              <div className="p-12 text-center text-foreground/30 font-medium">{t.noTransactions}</div>
            ) : (
              <div className="divide-y divide-foreground/5">
                {transactions.map((tr: any, idx) => (
                  <motion.div
                    key={tr.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="p-5 flex items-center justify-between hover:bg-foreground/[0.02] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${tr.type === 'DEPOSIT' || tr.type === 'REFUND' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                        {tr.type === 'DEPOSIT' || tr.type === 'REFUND' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm">{tr.description || tr.type}</p>
                        <p className="text-[10px] text-foreground/40 font-semibold uppercase">{new Date(tr.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className={`font-black text-sm tabular-nums ${tr.type === 'DEPOSIT' || tr.type === 'REFUND' ? 'text-emerald-500' : 'text-foreground'
                      }`}>
                      {tr.type === 'DEPOSIT' || tr.type === 'REFUND' ? '+' : '-'}{Number(tr.amount).toLocaleString()} EGP
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Deposit Modal */}
        <AnimatePresence>
          {isDepositOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDepositOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="relative w-full max-w-lg rounded-3xl bg-background border border-foreground/10 p-8 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#febc5a] to-transparent" />

                <h2 className="text-2xl font-black text-foreground mb-6">{t.depositTitle}</h2>

                <form onSubmit={handleDeposit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{t.amount}</label>
                    <div className="relative">
                      <input
                        required
                        type="number"
                        value={depositData.amount}
                        onChange={(e) => setDepositData({ ...depositData, amount: e.target.value })}
                        className="w-full bg-foreground/5 border-none rounded-2xl p-4 font-black text-xl text-foreground focus:ring-2 focus:ring-[#febc5a] transition outline-none"
                        placeholder="0.00"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 font-bold uppercase text-xs">EGP</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">{t.method}</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "PAYPAL", icon: <CreditCard size={18} />, label: t.paypal },
                        { id: "BANK", icon: <Banknote size={18} />, label: t.bank },
                        { id: "WALLET", icon: <Smartphone size={18} />, label: t.wallet }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setDepositData({ ...depositData, method: m.id as any })}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${depositData.method === m.id
                              ? 'border-[#febc5a] bg-[#febc5a]/5 text-[#febc5a]'
                              : 'border-foreground/5 bg-foreground/5 text-foreground/40 hover:border-foreground/10'
                            }`}
                        >
                          {m.icon}
                          <span className="text-[10px] font-bold leading-tight text-center">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {depositData.method !== "PAYPAL" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-2">
                      <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                        <Info size={18} className="text-blue-500 shrink-0" />
                        <p className="text-[11px] font-semibold text-blue-500/80 leading-relaxed whitespace-pre-line">
                          {depositData.method === "BANK" ? t.bankInfo : t.mobileInfo}
                        </p>
                      </div>
                      <input
                        required
                        type="text"
                        value={depositData.reference_id}
                        onChange={(e) => setDepositData({ ...depositData, reference_id: e.target.value })}
                        placeholder={t.refPlaceholder}
                        className="w-full bg-foreground/5 border-none rounded-2xl p-4 font-bold text-sm text-foreground focus:ring-2 focus:ring-[#febc5a] outline-none"
                      />
                    </motion.div>
                  )}

                  <button className="w-full py-4 rounded-2xl bg-foreground text-background font-black text-sm uppercase tracking-widest transition hover:scale-[1.02] active:scale-[0.98]">
                    {t.submit}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
