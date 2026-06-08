import type { Match } from "@/types";

// Atlanta match list checked against MARTA and FIFA public schedule references on 2026-06-06.
// Re-check close to launch because match operations, team labels, and kickoff handling can still change.
export const matches: Match[] = [
  {
    id: "atl-matchday-1",
    date: "2026-06-15",
    kickoffTime: "12:00",
    displayName: "Spain vs Cabo Verde",
    homeTeam: { name: "Spain", flagEmoji: "🇪🇸" },
    awayTeam: { name: "Cabo Verde", flagEmoji: "🇨🇻" },
    round: "Group H · Match 14",
    gatesOpenOffsetMinutes: 120,
    planningNote: "Expect first-match energy downtown. Build in extra time for station crowds and wayfinding.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 90
  },
  {
    id: "atl-matchday-2",
    date: "2026-06-18",
    kickoffTime: "12:00",
    displayName: "Czechia vs South Africa",
    homeTeam: { name: "Czechia", flagEmoji: "🇨🇿" },
    awayTeam: { name: "South Africa", flagEmoji: "🇿🇦" },
    round: "Group A · Match 25",
    gatesOpenOffsetMinutes: 120,
    planningNote: "Midday kickoff. Build in extra time for lunch-hour MARTA rail crowds and downtown wayfinding.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 90
  },
  {
    id: "atl-matchday-3",
    date: "2026-06-21",
    kickoffTime: "12:00",
    displayName: "Spain vs Saudi Arabia",
    homeTeam: { name: "Spain", flagEmoji: "🇪🇸" },
    awayTeam: { name: "Saudi Arabia", flagEmoji: "🇸🇦" },
    round: "Group H · Match 38",
    gatesOpenOffsetMinutes: 120,
    planningNote: "Weekend midday kickoff. Pick your station early and confirm MARTA rail service before leaving.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 90
  },
  {
    id: "atl-matchday-4",
    date: "2026-06-24",
    kickoffTime: "18:00",
    displayName: "Morocco vs Haiti",
    homeTeam: { name: "Morocco", flagEmoji: "🇲🇦" },
    awayTeam: { name: "Haiti", flagEmoji: "🇭🇹" },
    round: "Group C · Match 50",
    gatesOpenOffsetMinutes: 120,
    planningNote: "Evening kickoff can overlap with commuter traffic. Give MARTA rail transfers a wider buffer.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 90
  },
  {
    id: "atl-matchday-5",
    date: "2026-06-27",
    kickoffTime: "19:30",
    displayName: "Congo DR vs Uzbekistan",
    homeTeam: { name: "Congo DR", flagEmoji: "🇨🇩" },
    awayTeam: { name: "Uzbekistan", flagEmoji: "🇺🇿" },
    round: "Group K · Match 72",
    gatesOpenOffsetMinutes: 120,
    planningNote: "Late group-stage kickoff. Confirm return MARTA rail timing before heading downtown.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 90
  },
  {
    id: "atl-matchday-6",
    date: "2026-07-01",
    kickoffTime: "12:00",
    displayName: "Group L winner vs 3rd place",
    homeTeam: { name: "Group L winner", flagEmoji: "🏳️" },
    awayTeam: { name: "3rd place", flagEmoji: "🏳️" },
    round: "Round of 32 · Match 80",
    gatesOpenOffsetMinutes: 150,
    planningNote: "Knockout-round demand may be heavier. Aim to be downtown earlier than usual.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 90
  },
  {
    id: "atl-matchday-7",
    date: "2026-07-07",
    kickoffTime: "12:00",
    displayName: "Winner M86 vs Winner M88",
    homeTeam: { name: "Winner M86", flagEmoji: "🏳️" },
    awayTeam: { name: "Winner M88", flagEmoji: "🏳️" },
    round: "Round of 16 · Match 95",
    gatesOpenOffsetMinutes: 150,
    planningNote: "Give yourself a calm arrival window and verify event-day pedestrian guidance.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 105
  },
  {
    id: "atl-matchday-8",
    date: "2026-07-15",
    kickoffTime: "15:00",
    displayName: "Winner M99 vs Winner M100",
    homeTeam: { name: "Winner M99", flagEmoji: "🏳️" },
    awayTeam: { name: "Winner M100", flagEmoji: "🏳️" },
    round: "Semifinal · Match 102",
    gatesOpenOffsetMinutes: 180,
    planningNote: "This is likely to be one of the busiest Atlanta matchdays. Plan conservatively.",
    stadiumAreaLabel: "Downtown stadium area",
    recommendedArrivalBufferMinutes: 120
  }
];

export function getMatchStart(match: Match): Date {
  return new Date(`${match.date}T${match.kickoffTime}:00-04:00`);
}

export function getGatesOpenTime(match: Match): string | undefined {
  if (match.gatesOpenTime) {
    return match.gatesOpenTime;
  }

  if (typeof match.gatesOpenOffsetMinutes !== "number") {
    return undefined;
  }

  const gatesOpen = new Date(getMatchStart(match).getTime() - match.gatesOpenOffsetMinutes * 60_000);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).format(gatesOpen);
}

export function getNextUpcomingMatch(now = new Date()): Match | undefined {
  return matches.find((match) => getMatchStart(match).getTime() > now.getTime());
}

export function areAllMatchesPast(now = new Date()): boolean {
  return matches.every((match) => getMatchStart(match).getTime() < now.getTime());
}

export function getDefaultMatch(now = new Date()): Match {
  return getNextUpcomingMatch(now) ?? matches[matches.length - 1];
}

export function getMatchById(matchId: string | null | undefined): Match {
  return matches.find((match) => match.id === matchId) ?? getDefaultMatch();
}
