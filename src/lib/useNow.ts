"use client";

import { useEffect, useState } from "react";

export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateNow = () => setNow(new Date());
    updateNow();

    const intervalId = window.setInterval(updateNow, intervalMs);
    return () => window.clearInterval(intervalId);
  }, [intervalMs]);

  return now;
}
