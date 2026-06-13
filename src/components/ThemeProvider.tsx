"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = "light";
    window.localStorage.setItem("peach8-theme", "light");
  }, []);

  return children;
}
