"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;

    if (saved) {
      setThemeState(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  }, []);

  // update DOM + storage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeToggle = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeToggle must be used inside ThemeProvider");
  }

  return context;
};