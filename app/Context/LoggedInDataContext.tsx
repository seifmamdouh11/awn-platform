"use client";

import api from "@/app/utils/api";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type LoggedUser = {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  role?: "volunteer" | "company";

  // volunteer fields
  status?: "pending" | "active" | "blocked" | string;
  created_at?: string;
  description?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  national_id?: string;
  average_rating?: number;
  balance?: number;
  total_attended?: number;
  total_earnings?: number;
  hours_volunteered?: number;
};

type ContextType = {
  data: LoggedUser | null;
  setData: React.Dispatch<React.SetStateAction<LoggedUser | null>>;
  refresh: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoggedInDataContext = createContext<ContextType | null>(null);

export const useLoggedInData = () => {
  const context = useContext(LoggedInDataContext);

  if (!context) {
    throw new Error("useLoggedInData must be used inside LoggedInDataProvider");
  }

  return context;
};

type Props = {
  children: React.ReactNode;
};

export default function LoggedInDataProvider({ children }: Props) {
  const [data, setData] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setData(null);
        setLoading(false);
        return;
      }

      // Try fetching as volunteer first
      try {
        const volunteerRes = await api.get("/volunteers/me");
        setData({
          ...volunteerRes.data,
          role: "volunteer",
        });
        return;
      } catch {}

      // If not, try as company
      try {
        const companyRes = await api.get("/companies/me");
        setData({
          ...companyRes.data,
          role: "company",
        });
        return;
      } catch {}

      localStorage.removeItem("token");
      setData(null);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      localStorage.removeItem("token");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <LoggedInDataContext.Provider
      value={{ data, setData, refresh, loading, setLoading }}
    >
      {children}
    </LoggedInDataContext.Provider>
  );
}