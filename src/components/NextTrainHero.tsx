"use client";

import { RadioTower, Route, TrainFront } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getMartaRoute } from "@/lib/martaRouting";
import type { RailArrival, RailArrivalsResponse, Station } from "@/types";

type NearbyStation = {
  station: Station;
  distanceMiles?: number;
  approxWalkMinutes?: number;
};

type NextTrainHeroProps = {
  approxWalkMinutes?: number;
  options?: NearbyStation[];
  onSelect?: (station: Station) => void;
  station?: Station;
};

function waitMinutes(arrival?: RailArrival) {
  if (!arrival) return undefined;
  return Math.max(0, Math.ceil(arrival.waitingSeconds / 60));
}

const FALLBACK_WAIT_MINUTES = 10;

function lineLabel(station: Station) {
  return `${station.line.join(" / ")} Line`;
}

function lineDot(station: Station) {
  if (station.line.includes("Red")) return "bg-[#ff4d4d]";
  if (station.line.includes("Gold")) return "bg-[#ffb347]";
  if (station.line.includes("Blue")) return "bg-[#4a9eff]";
  if (station.line.includes("Green")) return "bg-[#3fb950]";
  return "bg-[#8b949e]";
}

function directionLabel(route: ReturnType<typeof getMartaRoute>) {
  if (route.transferStation) return `toward ${route.transferStation}`;
  return route.direction.startsWith("toward") ? route.direction : `toward ${route.exitStation.replace(" Station", "")}`;
}

function liveBadge(status: "idle" | "loading" | "ready" | "error", isMock: boolean, nextArrival?: RailArrival) {
  if (status === "loading" || status === "idle") return "Loading";
  if (status === "error") return "Estimate";
  if (isMock || !nextArrival) return "Sample";
  return "Live";
}

function trainSourceLabel(badge: ReturnType<typeof liveBadge>) {
  if (badge === "Live") return "Live feed";
  if (badge === "Loading") return "Checking trains";
  if (badge === "Sample") return "Sample time";
  return "Estimate";
}

function arrivalLeadLabel(status: "idle" | "loading" | "ready" | "error", isEstimated: boolean) {
  if (status === "loading" || status === "idle") return "Finding the next stadium-bound train";
  if (isEstimated) return "Next stadium-bound train, estimated";
  return "Your next train arrives in";
}

function routeActionCopy(station: Station, route: ReturnType<typeof getMartaRoute>) {
  if (route.transferStation) {
    return `Ride to ${route.transferStation}, switch once, then exit at SEC District.`;
  }

  return `Ride ${directionLabel(route)} and exit at SEC District.`;
}

function routePathCopy(station: Station, route: ReturnType<typeof getMartaRoute>) {
  if (route.transferStation) {
    return `${station.name} → ${route.transferStation} → SEC District`;
  }

  return `${station.name} → SEC District`;
}

function normalizedLine(value: string) {
  return value.toLowerCase().replace(/\s+line\b/g, "").trim();
}

function desiredArrivalDirection(station: Station, route: ReturnType<typeof getMartaRoute>) {
  const direction = route.direction.toLowerCase();

  if (direction.includes("southbound")) return "S";
  if (direction.includes("northbound")) return "N";
  if (direction.includes("westbound")) return "W";
  if (direction.includes("eastbound")) return "E";

  if (station.directionGroup === "central" && (station.line.includes("Red") || station.line.includes("Gold"))) {
    return "S";
  }

  return undefined;
}

function arrivalMatchesStationLine(arrival: RailArrival, station: Station) {
  const arrivalLine = normalizedLine(arrival.line);

  return station.line.some((line) => arrivalLine.includes(normalizedLine(line)));
}

function selectRouteArrival(arrivals: RailArrival[], station: Station, route: ReturnType<typeof getMartaRoute>) {
  const desiredDirection = desiredArrivalDirection(station, route);
  const lineMatches = arrivals.filter((arrival) => arrivalMatchesStationLine(arrival, station));
  const routeMatches = desiredDirection
    ? lineMatches.filter((arrival) => arrival.direction.toUpperCase().startsWith(desiredDirection))
    : lineMatches;

  return [...(routeMatches.length ? routeMatches : lineMatches.length ? lineMatches : arrivals)]
    .sort((a, b) => a.waitingSeconds - b.waitingSeconds)[0];
}

export function NextTrainHero({ options = [], onSelect, station }: NextTrainHeroProps) {
  const [arrivals, setArrivals] = useState<RailArrival[]>([]);
  const [isMock, setIsMock] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const route = useMemo(() => (station ? getMartaRoute(station) : undefined), [station]);
  const nextArrival = useMemo(
    () => (station && route ? selectRouteArrival(arrivals, station, route) : undefined),
    [arrivals, route, station]
  );
  const waiting = waitMinutes(nextArrival);
  const displayedWait = typeof waiting === "number" ? waiting : FALLBACK_WAIT_MINUTES;
  const isEstimated = status !== "ready" || isMock || !nextArrival;
  const isChecking = status === "idle" || status === "loading";
  const hasTwoOptions = options.length > 1;
  const badge = liveBadge(status, isMock, nextArrival);
  const routeBadge = route?.transferStation ? "1 switch" : "Direct";

  useEffect(() => {
    if (!station) {
      return;
    }

    const currentStation = station;
    let active = true;
    let controller: AbortController | undefined;

    async function loadArrivals(showLoading = false) {
      controller?.abort();
      const currentController = new AbortController();
      controller = currentController;

      try {
        if (showLoading) {
          setStatus("loading");
        }

        const params = new URLSearchParams({ station: currentStation.name });
        const timeout = window.setTimeout(() => currentController.abort(), 5_000);
        const response = await fetch(`/api/rail-arrivals?${params.toString()}`, {
          signal: currentController.signal
        }).finally(() => window.clearTimeout(timeout));

        if (!response.ok) {
          throw new Error("Unable to load rail arrivals");
        }

        const data = (await response.json()) as RailArrivalsResponse;
        if (!active) return;

        setArrivals(data.arrivals);
        setIsMock(data.isMock);
        setStatus("ready");
      } catch {
        if (!currentController.signal.aborted && active) {
          setStatus("error");
          setArrivals([]);
          setIsMock(true);
        }
      }
    }

    loadArrivals(true);
    const intervalId = window.setInterval(() => loadArrivals(), 30_000);

    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(intervalId);
    };
  }, [station]);

  if (!station || !route) return null;

  return (
    <section className="preserve-dark-surface overflow-hidden rounded-[1.55rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(255,179,71,0.12),transparent_34%),linear-gradient(180deg,#171d2a_0%,#111722_100%)] p-4 text-[#f0f6fc] shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[#ffb347]">SEC route</p>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.1em] ${
            badge === "Live"
              ? "bg-[#102616] text-[#64d87b]"
              : "bg-[#211c16] text-[#ffb347]"
          }`}
        >
          <RadioTower aria-hidden="true" size={12} />
          {trainSourceLabel(badge)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 min-[430px]:grid-cols-[1fr_8.5rem] min-[430px]:items-stretch">
        <div className="min-w-0">
          <p className="text-[0.72rem] font-black uppercase tracking-[0.13em] text-[#a8b3c3]">
            {hasTwoOptions ? "Selected MARTA station" : "Start at the nearest MARTA station"}
          </p>
          <h2 className="mt-1 max-w-[18rem] break-words text-[2.35rem] font-black leading-[0.98] text-[#f0f6fc] min-[430px]:text-[2.65rem]">
            {station.name} Station
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0d1117]/85 px-3 py-2 text-[0.85rem] font-black text-[#f0f6fc]">
              <span className={`h-2.5 w-2.5 rounded-full ${lineDot(station)}`} aria-hidden="true" />
              {lineLabel(station)}
            </span>
            <span className="rounded-full bg-[#0d1117]/85 px-3 py-2 text-[0.85rem] font-extrabold text-[#a8b3c3]">
              {directionLabel(route)}
            </span>
          </div>
        </div>

        <div
          className={`flex min-h-[8.1rem] flex-col justify-between rounded-[1.2rem] border p-3.5 ${
            badge === "Live"
              ? "border-[#3fb950]/35 bg-[linear-gradient(145deg,rgba(16,38,22,0.95),rgba(13,17,23,0.98))]"
              : "border-[#ffb347]/30 bg-[linear-gradient(145deg,rgba(33,28,22,0.95),rgba(13,17,23,0.98))]"
          }`}
        >
          <p className="text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#a8b3c3]">
            {routeBadge}
          </p>
          <div>
            <div className="flex items-end gap-1">
              <p className="text-[3.1rem] font-black leading-none tabular-nums text-[#ffb347]" suppressHydrationWarning>
                {isChecking ? "--" : displayedWait}
              </p>
              <p className="pb-1.5 text-[0.78rem] font-black uppercase tracking-[0.12em] text-[#a8b3c3]">
                {isChecking ? "" : "min"}
              </p>
            </div>
            <p className="mt-1 text-[0.74rem] font-extrabold leading-4 text-[#a8b3c3]">
              {arrivalLeadLabel(status, isEstimated)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-[#0d1117]/78 p-3.5">
        <div className="grid grid-cols-[2.25rem_1fr] gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-[#ffb347]">
            <Route aria-hidden="true" size={18} />
          </div>
          <div className="min-w-0">
            <p className="break-words text-[1rem] font-black leading-tight text-[#f0f6fc]">{routePathCopy(station, route)}</p>
            <p className="mt-1 text-[0.85rem] font-bold leading-5 text-[#a8b3c3]">{routeActionCopy(station, route)}</p>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-[0.95rem] bg-white/[0.05] px-3 py-2.5">
          <TrainFront aria-hidden="true" className="mt-0.5 shrink-0 text-[#a8b3c3]" size={16} />
          <p className="min-w-0 text-[0.78rem] font-bold leading-5 text-[#a8b3c3]">
            Times refresh every 30 sec. Follow station signs and MARTA staff before boarding.
          </p>
        </div>
      </div>

      {hasTwoOptions ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {options.map((option) => {
            const active = option.station.id === station.id;

            return (
              <button
                className={`focus-ring min-h-16 rounded-2xl border p-3 text-left ${
                  active
                    ? "border-[#ffb347] bg-[#211c16] text-[#f0f6fc]"
                    : "border-white/10 bg-[#0d1117] text-[#a8b3c3]"
                }`}
                key={option.station.id}
                type="button"
                onClick={() => onSelect?.(option.station)}
              >
                <span className="block text-sm font-black">{option.station.name}</span>
                {typeof option.distanceMiles === "number" ? (
                  <span className="mt-1 block text-xs font-bold">{option.distanceMiles.toFixed(1)} mi from you</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
