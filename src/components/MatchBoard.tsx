"use client";

import { DoorOpen, Info } from "lucide-react";
import { useState } from "react";
import { MatchChipSelector } from "@/components/MatchChipSelector";
import { MatchCountdownCard } from "@/components/MatchCountdownCard";
import { getDefaultMatch, getGatesOpenTime, matches } from "@/data/matches";
import { useNow } from "@/lib/useNow";

function formatMatchDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(new Date(`${date}T12:00:00-04:00`));
}

function formatKickoffTime(date: string, time: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  })
    .format(new Date(`${date}T${time}:00-04:00`))
    .toLowerCase();
}

function formatCountdown(date: string, time: string, now: Date) {
  const kickoff = new Date(`${date}T${time}:00-04:00`).getTime();
  const diff = Math.max(0, kickoff - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (diff === 0) {
    return "match time";
  }

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function MatchBoard() {
  const now = useNow(1000);
  const [selectedMatchId, setSelectedMatchId] = useState(() => getDefaultMatch().id);
  const selectedMatch = matches.find((match) => match.id === selectedMatchId) ?? getDefaultMatch();
  const gatesOpen = getGatesOpenTime(selectedMatch);

  return (
    <div className="space-y-3">
      <MatchChipSelector matches={matches} selectedMatchId={selectedMatch.id} onSelect={setSelectedMatchId} />

      <MatchCountdownCard
        countdownLabel={formatCountdown(selectedMatch.date, selectedMatch.kickoffTime, now)}
        dateLabel={formatMatchDate(selectedMatch.date)}
        kickoffLabel={formatKickoffTime(selectedMatch.date, selectedMatch.kickoffTime)}
        match={selectedMatch}
      />

      <section className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
        <h2 className="text-lg font-bold leading-tight text-[#f0f6fc]">Good to know</h2>
        <div className="mt-3 space-y-3">
          {gatesOpen ? (
            <p className="flex items-start gap-2.5 text-sm font-medium leading-5 text-[#8b949e]">
              <DoorOpen aria-hidden="true" className="mt-0.5 shrink-0 text-[#ffb347]" size={16} />
              Gates usually open around {gatesOpen} — plan to be at your station well before that.
            </p>
          ) : null}
          <p className="flex items-start gap-2.5 text-sm font-medium leading-5 text-[#8b949e]">
            <Info aria-hidden="true" className="mt-0.5 shrink-0 text-[#ffb347]" size={16} />
            {selectedMatch.planningNote}
          </p>
        </div>
      </section>
    </div>
  );
}
