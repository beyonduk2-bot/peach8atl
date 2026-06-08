"use client";

import { useEffect, useState } from "react";
import { RadioTower, TrainFront } from "lucide-react";
import type { RailArrival, RailArrivalsResponse } from "@/types";

type RailArrivalsCardProps = {
  station: string;
};

function formatUpdatedTime(eventTime: string) {
  const parsed = new Date(eventTime);

  if (Number.isNaN(parsed.getTime())) {
    return "now";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(parsed);
}

export function RailArrivalsCard({ station }: RailArrivalsCardProps) {
  const [arrivals, setArrivals] = useState<RailArrival[]>([]);
  const [isMock, setIsMock] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const placeholderArrivals: RailArrival[] = [
    {
      destination: "Downtown",
      direction: "Direction pending",
      eventTime: "placeholder-1",
      isRealtime: false,
      line: "Line",
      nextArrival: "Soon",
      station,
      waitingSeconds: 0,
      waitingTime: "Soon",
      delay: "Placeholder",
      latitude: 0,
      longitude: 0
    },
    {
      destination: "Downtown",
      direction: "Direction pending",
      eventTime: "placeholder-2",
      isRealtime: false,
      line: "Line",
      nextArrival: "Soon",
      station,
      waitingSeconds: 0,
      waitingTime: "Soon",
      delay: "Placeholder",
      latitude: 0,
      longitude: 0
    }
  ];
  const visibleArrivals = arrivals.length ? arrivals : placeholderArrivals;

  useEffect(() => {
    const controller = new AbortController();

    async function loadArrivals() {
      try {
        setStatus("loading");
        const params = new URLSearchParams({ station });
        const response = await fetch(`/api/rail-arrivals?${params.toString()}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load rail arrivals");
        }

        const data = (await response.json()) as RailArrivalsResponse;
        setArrivals(data.arrivals);
        setIsMock(data.isMock);
        setErrorMessage(data.errorMessage);
        setStatus("ready");
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      }
    }

    loadArrivals();

    return () => controller.abort();
  }, [station]);

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold tracking-[0.03em] text-[#ffb347]">
            <RadioTower aria-hidden="true" size={16} />
            Train times
          </p>
          <h2 className="mt-1 text-xl font-black text-[#f0f6fc]">{station}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${isMock ? "bg-[#2b2111] text-[#d29922]" : "bg-[#102616] text-[#3fb950]"}`}>
          {status === "ready" ? (isMock ? "Sample" : "Live") : "Loading"}
        </span>
      </div>

      {status === "error" ? (
        <p className="rounded-2xl bg-[#0d1117] p-3 text-sm font-semibold text-[#8b949e]">
          Train times are not loading right now. Check official sources before you go.
        </p>
      ) : (
        <div className="space-y-3">
          {errorMessage ? (
            <p className="rounded-2xl bg-[#211c16] p-3 text-sm font-semibold text-[#ffb347]">
              {errorMessage}
            </p>
          ) : null}
          <div className="rounded-[1.6rem] bg-[#0d1117] p-4 text-[#f0f6fc]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#17243a] text-[#4a9eff] shadow-sm">
                  <TrainFront aria-hidden="true" size={21} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#8b949e]">{visibleArrivals[0].line} line</p>
                  <p className="break-words text-lg font-black leading-tight">{visibleArrivals[0].destination}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-2xl bg-[#ffb347] px-3 py-2 text-right text-lg font-black text-[#0d1117]">
                {visibleArrivals[0].waitingTime}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#8b949e]">
              {visibleArrivals[0].direction} · Updated {formatUpdatedTime(visibleArrivals[0].eventTime)}
            </p>
          </div>

          {visibleArrivals.slice(1).map((arrival, index) => (
            <div
              className="flex items-center justify-between gap-3 rounded-2xl bg-[#0d1117] p-3"
              key={`${arrival.station}-${arrival.line}-${arrival.destination}-${arrival.eventTime}-${index}`}
            >
              <div className="min-w-0">
                <p className="break-words font-black text-[#f0f6fc]">{arrival.line} toward {arrival.destination}</p>
                <p className="text-sm font-semibold text-[#8b949e]">{arrival.direction}</p>
              </div>
              <span className="shrink-0 text-right text-sm font-black text-[#ffb347]">
                {arrival.waitingTime}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
