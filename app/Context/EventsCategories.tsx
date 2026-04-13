"use client";

import React from "react";
import { useLang } from "@/app/Hooks/LangHook/LangHook";
import api from "../utils/api";

type Category = {
  id: number;
  category_name: string;
  category_name_ar?: string;
  category_name_en?: string;
};


type ContextType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  refresh: () => Promise<void>;
  loading: boolean;
};

export const EventsCategoriesContext = React.createContext<ContextType | null>(null);

export const useEventsCategories = () => {
  const context = React.useContext(EventsCategoriesContext);

  if (!context) {
    throw new Error("useEventsCategories must be used inside EventsCategoriesProvider");
  }

  return context;
};

type Props = {
  children: React.ReactNode;
};

export default function EventsCategoriesProvider({ children }: Props) {
  const { lang } = useLang();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(`/event-categories?lang=${lang}`);
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <EventsCategoriesContext.Provider
      value={{ categories, setCategories, refresh, loading }}
    >
      {children}
    </EventsCategoriesContext.Provider>
  );
}