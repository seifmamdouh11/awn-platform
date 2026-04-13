"use client";

import { useThemeToggle } from "@/app/Hooks/ThemeHook/ThemeProvider";
import { FaLightbulb, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeToggle();

  return (
    <label className="relative block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition-colors has-checked:bg-black/50">
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="peer sr-only"
      />

      <span className="absolute inset-y-0 inset-s-0 m-1 grid size-6 place-content-center rounded-full bg-white text-gray-700 transition-all duration-300 peer-checked:inset-s-6">
        {theme === "dark" ? <FaMoon /> : <FaLightbulb />}
      </span>
    </label>
  );
}