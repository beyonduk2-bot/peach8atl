"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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

function formatMatchInfoDate(date: string, time: string) {
  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    timeZone: "America/New_York",
    year: "numeric"
  }).format(new Date(`${date}T12:00:00-04:00`));

  return `${dateLabel}, ${time}`;
}

export function MatchChipSelector({ matches, selectedMatchId, onSelect }: MatchChipSelectorProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [previewMatch, setPreviewMatch] = useState<Match | null>(null);

  function scrollMatches(direction: "left" | "right") {
    scrollerRef.current?.scrollBy({
      left: direction === "left" ? -180 : 180,
      behavior: "smooth"
    });
  }

  function renderMatchPreview(match: Match) {
    function renderTeamCard(side: "home" | "away") {
      const team = side === "home" ? match.homeTeam : match.awayTeam;

      return (
        <section className="rounded-[1.25rem] bg-[#0d1117] p-3" key={team.name}>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none" aria-hidden="true">
              {team.flagEmoji}
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-black leading-tight text-[#f0f6fc]">
                {team.name}
              </h3>
            </div>
          </div>

          <p className="mt-3 text-sm font-semibold leading-5 text-[#8b949e]">
            Team details can shift. Keep Peach8 focused on the ride and verify match info at the source.
          </p>
        </section>
      );
    }

    return (
      <>
        <p className="pr-12 text-sm font-bold tracking-[0.03em] text-[#ffb347]">Match snapshot</p>

        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-[1.35rem] bg-[#211c16] p-3 text-center">
          <div className="min-w-0">
            <p className="text-3xl leading-none" aria-hidden="true">
              {match.homeTeam.flagEmoji}
            </p>
            <p className="mt-1 truncate text-sm font-black text-[#f0f6fc]">{match.homeTeam.name}</p>
          </div>
          <span className="rounded-full bg-[#ffb347] px-3 py-1 text-xs font-black uppercase text-[#0d1117]">
            vs
          </span>
          <div className="min-w-0">
            <p className="text-3xl leading-none" aria-hidden="true">
              {match.awayTeam.flagEmoji}
            </p>
            <p className="mt-1 truncate text-sm font-black text-[#f0f6fc]">{match.awayTeam.name}</p>
          </div>
        </div>

        <section className="mt-3 rounded-[1.25rem] bg-[#0d1117] p-3">
          <h2 className="text-base font-black text-[#f0f6fc]">The essentials</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-[0.72rem] font-bold tracking-[0.02em] text-[#8b949e]">Kickoff</dt>
              <dd className="mt-0.5 font-black text-[#f0f6fc]">
                {formatMatchInfoDate(match.date, match.kickoffTime)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.72rem] font-bold tracking-[0.02em] text-[#8b949e]">Round</dt>
              <dd className="mt-0.5 font-black text-[#f0f6fc]">{match.round}</dd>
            </div>
            <div>
              <dt className="text-[0.72rem] font-bold tracking-[0.02em] text-[#8b949e]">Venue</dt>
              <dd className="mt-0.5 font-black text-[#f0f6fc]">Atlanta Stadium</dd>
            </div>
            <div>
              <dt className="text-[0.72rem] font-bold tracking-[0.02em] text-[#8b949e]">City</dt>
              <dd className="mt-0.5 font-black text-[#f0f6fc]">Atlanta</dd>
            </div>
          </dl>
        </section>

        <div className="mt-3 grid gap-3">
          {renderTeamCard("home")}
          {renderTeamCard("away")}
        </div>

        <button
          className="focus-ring mx-auto mt-4 flex min-h-12 w-full max-w-[180px] items-center justify-center rounded-2xl bg-[#ffb347] px-4 text-sm font-black text-[#0d1117]"
          type="button"
          onClick={() => setPreviewMatch(null)}
        >
          Looks good
        </button>
      </>
    );
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
                className={`focus-ring flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center font-black shadow-sm transition ${
                  selected
                    ? "bg-[#ffb347] text-[#0d1117]"
                    : "border border-white/10 bg-[#0d1117] text-[#8b949e] active:bg-[#211c16]"
                }`}
                key={match.id}
                role="tab"
                type="button"
                onClick={() => {
                  onSelect(match.id);
                  setPreviewMatch(match);
                }}
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

      {previewMatch ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-end bg-black/45 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-[calc(env(safe-area-inset-top)+1rem)]"
          role="dialog"
        >
          <button
            aria-label="Close match info"
            className="absolute inset-0 cursor-default"
            type="button"
            onClick={() => setPreviewMatch(null)}
          />
          <article className="relative mx-auto max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem)] w-full max-w-[398px] overflow-y-auto rounded-[2rem] border border-white/10 bg-[#161b27] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <button
              aria-label="Close match info"
              className="focus-ring absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#0d1117] text-[#f0f6fc]"
              type="button"
              onClick={() => setPreviewMatch(null)}
            >
              <X aria-hidden="true" size={18} />
            </button>

            {renderMatchPreview(previewMatch)}
          </article>
        </div>
      ) : null}
    </section>
  );
}
