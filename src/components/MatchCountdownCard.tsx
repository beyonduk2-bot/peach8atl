import { Clock3, MapPin } from "lucide-react";
import type { Match } from "@/types";

type MatchCountdownCardProps = {
  countdownLabel: string;
  dateLabel: string;
  kickoffLabel: string;
  match: Match;
};

type CountdownUnit = {
  label: "DAYS" | "HOURS" | "MINS" | "SECS";
  value: string;
};

function twoDigit(value: number) {
  return value.toString().padStart(2, "0");
}

function countdownUnits(countdownLabel: string): CountdownUnit[] {
  const units = {
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0
  };

  const days = countdownLabel.match(/(\d+)d/);
  const hours = countdownLabel.match(/(\d+)h/);
  const mins = countdownLabel.match(/(\d+)m/);
  const secs = countdownLabel.match(/(\d+)s/);

  units.days = days ? Number(days[1]) : 0;
  units.hours = hours ? Number(hours[1]) : 0;
  units.mins = mins ? Number(mins[1]) : 0;
  units.secs = secs ? Number(secs[1]) : 0;

  return [
    { label: "DAYS", value: twoDigit(units.days) },
    { label: "HOURS", value: twoDigit(units.hours) },
    { label: "MINS", value: twoDigit(units.mins) },
    { label: "SECS", value: twoDigit(units.secs) }
  ];
}

export function MatchCountdownCard({ countdownLabel, dateLabel, kickoffLabel, match }: MatchCountdownCardProps) {
  const units = countdownUnits(countdownLabel);

  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <div className="text-center">
        <span className="inline-flex rounded-full bg-[#211c16] px-3 py-1 text-[0.7rem] font-black leading-tight text-[#ffb347]">
          {match.round}
        </span>
      </div>

      <div className="mt-3 border-y border-white/10 py-3 text-center">
        <div className="mx-auto flex max-w-full items-center justify-center gap-2.5">
          <span className="shrink-0 text-[1.45rem] leading-none" aria-hidden="true">
            {match.homeTeam.flagEmoji}
          </span>
          <h2 className="min-w-0 text-balance text-[1.08rem] font-black leading-snug text-[#f0f6fc]">
            {match.homeTeam.name} <span className="text-[0.78rem] uppercase text-[#8b949e]">vs</span>{" "}
            {match.awayTeam.name}
          </h2>
          <span className="shrink-0 text-[1.45rem] leading-none" aria-hidden="true">
            {match.awayTeam.flagEmoji}
          </span>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-[1rem] border border-white/10 bg-[#0d1117]" aria-label="Time until kickoff">
        <div className="grid grid-cols-4 divide-x divide-white/10">
          {units.map((unit) => (
            <div className="px-1 py-2.5 text-center" key={unit.label} suppressHydrationWarning>
              <p className="text-[1.35rem] font-black leading-none text-[#ffb347] tabular-nums" suppressHydrationWarning>
                {unit.value}
              </p>
              <p className="mt-1 text-[0.54rem] font-black tracking-[0.06em] text-[#8b949e]">{unit.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-[0.82rem] font-bold leading-5">
        <span className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#211c16] px-3 py-2 text-[#ffb347]">
          <Clock3 aria-hidden="true" size={14} />
          {dateLabel} kick off at {kickoffLabel}
        </span>
        <span className="inline-flex items-center justify-center gap-1.5 text-balance rounded-2xl bg-[#0d1117] px-3 py-2 text-center font-black text-[#f0f6fc]">
          <MapPin aria-hidden="true" size={14} />
          {match.stadiumAreaLabel}
        </span>
      </div>
    </section>
  );
}
