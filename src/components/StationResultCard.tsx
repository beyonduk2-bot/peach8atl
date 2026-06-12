"use client";

import { Footprints, RotateCcw } from "lucide-react";
import { lineHex } from "@/lib/arrivals";
import type { Station } from "@/types";

type NearbyStation = {
  station: Station;
  distanceMiles?: number;
  approxWalkMinutes?: number;
};

type StationResultCardProps = {
  station: Station;
  options?: NearbyStation[];
  distanceMiles?: number;
  approxWalkMinutes?: number;
  note?: string;
  onSelect?: (station: Station) => void;
  onReset?: () => void;
};

export function StationResultCard({
  station,
  options = [],
  distanceMiles,
  approxWalkMinutes,
  note,
  onSelect,
  onReset
}: StationResultCardProps) {
  const hasTwoOptions = options.length > 1;

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#8b949e]">
          {hasTwoOptions ? "Two stations are close — pick one" : "Your closest station"}
        </p>
        {onReset ? (
          <button
            className="focus-ring inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-[#0d1117] px-3 py-1.5 text-xs font-semibold text-[#8b949e] transition active:scale-95"
            type="button"
            onClick={onReset}
          >
            <RotateCcw aria-hidden="true" size={13} />
            Start over
          </button>
        ) : null}
      </div>

      <h2 className="mt-2 break-words text-[2.3rem] font-bold leading-[1.02] tracking-tight text-[#f0f6fc]">
        {station.name}
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {station.line.map((line) => (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0d1117] px-3 py-1.5 text-[0.82rem] font-semibold text-[#f0f6fc]"
            key={line}
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: lineHex(line) }} />
            {line} Line
          </span>
        ))}
        {typeof distanceMiles === "number" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0d1117] px-3 py-1.5 text-[0.82rem] font-semibold text-[#8b949e]">
            <Footprints aria-hidden="true" size={13} />
            {distanceMiles.toFixed(1)} mi
            {typeof approxWalkMinutes === "number" ? ` · about ${approxWalkMinutes} min on foot` : ""}
          </span>
        ) : null}
      </div>

      {note ? <p className="mt-3 text-sm font-medium leading-5 text-[#8b949e]">{note}</p> : null}

      {hasTwoOptions ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {options.map((option) => {
            const active = option.station.id === station.id;

            return (
              <button
                className={`focus-ring min-h-16 rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-[#ffb347] bg-[#211c16] text-[#f0f6fc]"
                    : "border-white/10 bg-[#0d1117] text-[#8b949e] active:scale-[0.98]"
                }`}
                key={option.station.id}
                type="button"
                onClick={() => onSelect?.(option.station)}
              >
                <span className="block text-sm font-bold">{option.station.name}</span>
                {typeof option.distanceMiles === "number" ? (
                  <span className="mt-1 block text-xs font-medium">{option.distanceMiles.toFixed(1)} mi from you</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
