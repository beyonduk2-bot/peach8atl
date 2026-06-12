"use client";

import { RadioTower } from "lucide-react";
import {
  delayDisplayLabel,
  directionDisplayLabel,
  lineDisplayName,
  lineHex,
  sortByWait,
  waitDisplay
} from "@/lib/arrivals";
import type { RailArrivalsStatus } from "@/lib/useRailArrivals";
import type { RailArrival } from "@/types";

type LiveTrainsBoardProps = {
  stationLabel: string;
  subtitle: string;
  arrivals: RailArrival[];
  status: RailArrivalsStatus;
  isMock: boolean;
  highlightArrival?: RailArrival;
  highlightTag?: string;
};

const MAX_ROWS = 5;

function feedBadge(status: RailArrivalsStatus, isMock: boolean) {
  if (status === "loading" || status === "idle") return { label: "Checking…", live: false };
  if (status === "error") return { label: "Offline", live: false };
  if (isMock) return { label: "Sample times", live: false };
  return { label: "Live", live: true };
}

function ArrivalRow({
  arrival,
  highlight,
  highlightTag
}: {
  arrival: RailArrival;
  highlight: boolean;
  highlightTag?: string;
}) {
  const wait = waitDisplay(arrival);
  const delay = delayDisplayLabel(arrival.delay);
  const color = lineHex(arrival.line);

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border p-3 ${
        highlight ? "border-[#ffb347]/45 bg-[#211c16]" : "border-white/10 bg-[#0d1117]"
      }`}
    >
      <span
        aria-hidden="true"
        className="h-9 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 text-[0.95rem] font-bold leading-tight text-[#f0f6fc]">
          To {arrival.destination}
          {highlight && highlightTag ? (
            <span className="rounded-full bg-[#ffb347] px-2 py-0.5 text-[0.62rem] font-bold text-[#0d1117]">
              {highlightTag}
            </span>
          ) : null}
        </p>
        <p className="mt-0.5 text-[0.78rem] font-medium text-[#8b949e]">
          {lineDisplayName(arrival.line)} Line · {directionDisplayLabel(arrival.direction)}
          {delay ? ` · ${delay}` : ""}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[1.5rem] font-bold leading-none tabular-nums text-[#f0f6fc]">
          {wait.value}
          {wait.unit ? <span className="ml-1 text-[0.7rem] font-semibold text-[#8b949e]">{wait.unit}</span> : null}
        </p>
        <p className={`mt-1 text-[0.62rem] font-semibold ${arrival.isRealtime ? "text-[#3fb950]" : "text-[#8b949e]"}`}>
          {arrival.isRealtime ? "live" : "scheduled"}
        </p>
      </div>
    </li>
  );
}

export function LiveTrainsBoard({
  stationLabel,
  subtitle,
  arrivals,
  status,
  isMock,
  highlightArrival,
  highlightTag
}: LiveTrainsBoardProps) {
  const badge = feedBadge(status, isMock);
  const rows = sortByWait(arrivals).slice(0, MAX_ROWS);
  const isWaiting = status === "loading" || status === "idle";

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold leading-tight text-[#f0f6fc]">Next trains</h2>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold ${
            badge.live ? "bg-[#102616] text-[#3fb950]" : "bg-[#211c16] text-[#ffb347]"
          }`}
        >
          <RadioTower aria-hidden="true" size={12} />
          {badge.label}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-[#8b949e]">{subtitle}</p>

      {isWaiting ? (
        <div className="mt-4 space-y-2" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div className="h-16 animate-pulse rounded-2xl bg-[#0d1117]" key={row} />
          ))}
        </div>
      ) : rows.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {rows.map((arrival, index) => (
            <ArrivalRow
              arrival={arrival}
              highlight={arrival === highlightArrival}
              highlightTag={highlightTag}
              key={`${arrival.line}-${arrival.destination}-${arrival.eventTime}-${index}`}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1117] p-4">
          <p className="text-sm font-semibold leading-5 text-[#f0f6fc]">
            No trains reported at {stationLabel} right now.
          </p>
          <p className="mt-1 text-[0.82rem] font-medium leading-5 text-[#8b949e]">
            MARTA&apos;s feed skips a beat sometimes. The signs at the station always have the final say.
          </p>
        </div>
      )}

      <p className="mt-3 text-xs font-medium leading-5 text-[#8b949e]">
        {badge.live
          ? "Straight from MARTA's feed — refreshes every 30 seconds."
          : "Live times aren't available right now, so treat these as a rough guide."}
      </p>
    </section>
  );
}
