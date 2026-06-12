"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Match } from "@/types";

type MatchChipSelectorProps = {
  matches: Match[];
  selectedMatchId: string;
  onSelect: (matchId: string) => void;
};

function formatChipDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    timeZone: "America/New_York"
  }).format(new Date(`${date}T12:00:00-04:00`));
}

export function MatchChipSelector({ matches, selectedMatchId, onSelect }: MatchChipSelectorProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollMatches(direction: "left" | "right") {
    scrollerRef.current?.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth"
    });
  }

  return (
    <section aria-label="Match selector" className="-mx-4 flex items-center gap-2 px-4">
      <button
        aria-label="Scroll matches left"
        className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#161b27] text-[#f0f6fc] shadow-sm active:bg-[#211c16]"
        type="button"
        onClick={() => scrollMatches("left")}
      >
        <ChevronLeft aria-hidden="true" size={20} />
      </button>

      <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]" ref={scrollerRef}>
        <div className="flex min-w-max gap-2 pb-1" role="tablist">
          {matches.map((match, index) => {
            const selected = selectedMatchId === match.id;

            return (
              <button
                aria-label={`Match ${index + 1}: ${match.displayName}, ${formatChipDate(match.date)}`}
                aria-selected={selected}
                className={`focus-ring flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center font-bold shadow-sm transition ${
                  selected
                    ? "bg-[#ffb347] text-[#0d1117]"
                    : "border border-white/10 bg-[#0d1117] text-[#8b949e] active:bg-[#211c16]"
                }`}
                key={match.id}
                role="tab"
                type="button"
                onClick={() => onSelect(match.id)}
              >
                <span className="text-sm leading-none">M{index + 1}</span>
                <span className="mt-0.5 text-[0.72rem] leading-none" aria-hidden="true">
                  {match.homeTeam.flagEmoji}
                  {match.awayTeam.flagEmoji}
                </span>
                <span className="mt-0.5 text-[0.6rem] leading-none">{formatChipDate(match.date)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        aria-label="Scroll matches right"
        className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#161b27] text-[#f0f6fc] shadow-sm active:bg-[#211c16]"
        type="button"
        onClick={() => scrollMatches("right")}
      >
        <ChevronRight aria-hidden="true" size={20} />
      </button>
    </section>
  );
}
