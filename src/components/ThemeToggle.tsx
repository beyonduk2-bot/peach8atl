"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-[#161b27] text-[#f0f6fc] shadow-sm active:bg-[#211c16]"
      type="button"
      onClick={toggleTheme}
    >
      <span className="theme-icon-light">
        <Moon aria-hidden="true" size={20} />
      </span>
      <span className="theme-icon-dark">
        <Sun aria-hidden="true" size={20} />
      </span>
    </button>
  );
}
