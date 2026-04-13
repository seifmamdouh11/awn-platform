"use client";
import React, { useEffect } from "react";

export type Lang = "en" | "ar";

type LangContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LangContext = React.createContext<LangContextType | undefined>(undefined);

export default function LangProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [lang, setLangState] = React.useState<Lang>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = React.useContext(LangContext);

  if (!context) {
    throw new Error("useLang must be used inside LangProvider");
  }

  return context;
}