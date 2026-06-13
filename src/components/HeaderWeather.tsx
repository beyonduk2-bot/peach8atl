"use client";

import { useEffect, useState } from "react";
import type { WeatherResponse } from "@/types";

export function HeaderWeather() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3_000);

    async function loadWeather() {
      try {
        const response = await fetch("/api/weather", {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load weather");
        }

        setWeather((await response.json()) as WeatherResponse);
      } catch {
        if (!controller.signal.aborted) {
          setWeather(null);
        }
      }
    }

    loadWeather();

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const forecast = weather?.forecast;

  return (
    <div
      aria-label={
        forecast
          ? `Atlanta weather ${forecast.temperature} degrees`
          : "Atlanta weather unavailable"
      }
      className="flex h-11 shrink-0 flex-col items-center justify-center px-1 text-center text-[var(--text-primary)]"
      role="status"
    >
      <p className="text-[0.58rem] font-black uppercase leading-none text-[var(--text-muted)]">ATL</p>
      <p className="mt-1 text-[0.95rem] font-black leading-none tabular-nums">
        {forecast ? `${forecast.temperature}°` : "--°"}
      </p>
    </div>
  );
}
