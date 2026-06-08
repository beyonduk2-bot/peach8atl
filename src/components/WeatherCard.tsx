"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSun, Droplets, Sun, Wind } from "lucide-react";
import type { Match, WeatherResponse } from "@/types";

type WeatherCardProps = {
  match: Match;
  compact?: boolean;
};

function formatForecastTime(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Forecast time";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).format(parsed);
}

function WeatherIcon({ forecast, size }: { forecast?: string; size: number }) {
  const normalized = forecast?.toLowerCase() ?? "";

  if (normalized.includes("rain") || normalized.includes("shower") || normalized.includes("thunder")) {
    return <CloudRain aria-hidden="true" size={size} />;
  }

  if (normalized.includes("cloud") || normalized.includes("overcast") || normalized.includes("fog")) {
    return <Cloud aria-hidden="true" size={size} />;
  }

  if (normalized.includes("sun") || normalized.includes("clear")) {
    return <Sun aria-hidden="true" size={size} />;
  }

  return <CloudSun aria-hidden="true" size={size} />;
}

export function WeatherCard({ compact = false, match }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      try {
        setStatus("loading");
        const params = new URLSearchParams({
          matchDate: match.date,
          kickoffTime: match.kickoffTime
        });
        const response = await fetch(`/api/weather?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load weather");
        }

        setWeather((await response.json()) as WeatherResponse);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) {
          setStatus("error");
          setWeather(null);
        }
      }
    }

    loadWeather();

    return () => controller.abort();
  }, [match.date, match.kickoffTime]);

  const forecast = weather?.forecast;
  const rangeLabel =
    forecast && typeof forecast.temperatureLow === "number" && typeof forecast.temperatureHigh === "number"
      ? `L ${forecast.temperatureLow}° / H ${forecast.temperatureHigh}°`
      : "Low / high soon";

  if (compact) {
    return (
      <section className="flex h-full min-h-[8.75rem] flex-col justify-between rounded-[1.35rem] border border-white/10 bg-[#161b27] p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-black leading-tight text-[#f0f6fc]">Atlanta</p>
            {forecast ? (
              <>
                <p className="mt-1 text-[2.35rem] font-black leading-none tabular-nums text-[#f0f6fc]">
                  {forecast.temperature}°
                </p>
                <p className="mt-1 text-[0.72rem] font-black uppercase tracking-[0.08em] text-[#8b949e]">
                  {rangeLabel}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm font-bold text-[#8b949e]">
                {status === "loading" ? "Loading" : "Unavailable"}
              </p>
            )}
          </div>
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#fff3dd] text-[#ffb347]">
            <WeatherIcon forecast={forecast?.shortForecast} size={36} />
          </span>
        </div>

        {!forecast ? (
          <p className="mt-2 text-xs font-semibold leading-tight text-[#8b949e]">
            {weather?.errorMessage ?? "Check forecast before leaving."}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-[1.35rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#ffb347]">
            <CloudSun aria-hidden="true" size={16} />
            Weather
          </p>
          <h2 className="mt-1 text-xl font-black text-[#f0f6fc]">Atlanta matchday check</h2>
        </div>
        <span className="rounded-full bg-[#211c16] px-3 py-1 text-xs font-black text-[#ffb347]">
          {status === "loading" ? "Loading" : weather?.sourceName ?? "NWS"}
        </span>
      </div>

      {forecast ? (
        <div className="mt-4 grid grid-cols-[auto_1fr] gap-4 rounded-[1.35rem] bg-[#0d1117] p-4">
          <div className="text-center">
            <p className="text-4xl font-black leading-none tabular-nums text-[#f0f6fc]">{forecast.temperature}°</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#8b949e]">
              {forecast.temperatureUnit}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-base font-black leading-tight text-[#f0f6fc]">{forecast.shortForecast}</p>
            <p className="mt-1 text-sm font-semibold text-[#8b949e]">{formatForecastTime(forecast.startTime)}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-[#8b949e]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#161b27] px-3 py-1">
                <Wind aria-hidden="true" size={13} />
                {forecast.windSpeed}
              </span>
              {typeof forecast.precipitationChance === "number" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#161b27] px-3 py-1">
                  <Droplets aria-hidden="true" size={13} />
                  {forecast.precipitationChance}% rain
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-[1.35rem] bg-[#0d1117] p-4 text-sm font-semibold leading-5 text-[#8b949e]">
          {weather?.errorMessage ?? "Weather is temporarily unavailable. Check the forecast before leaving."}
        </p>
      )}

      {weather && !weather.isMatchWindow ? (
        <p className="mt-3 text-sm font-semibold leading-5 text-[#8b949e]">
          Matchday forecast updates when the kickoff is inside the weather forecast window.
        </p>
      ) : null}
    </section>
  );
}
