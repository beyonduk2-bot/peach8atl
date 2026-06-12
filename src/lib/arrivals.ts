import type { MartaRoute } from "@/lib/martaRouting";
import type { Coordinates, RailArrival, Station } from "@/types";

// The station right outside the stadium. Riders see "SEC District", but
// MARTA's realtime feed still reports it under the legacy name
// "OMNI DOME STATION" (verified against the live feed on 2026-06-11).
export const SEC_DISTRICT_DISPLAY_NAME = "SEC District";
export const SEC_DISTRICT_FEED_NAME = "Omni Dome";
export const SEC_DISTRICT_COORDS: Coordinates = {
  latitude: 33.7589,
  longitude: -84.3987
};

// MARTA line colors, shared by the live board and the rail path strip.
// These hexes match the light-theme override table in globals.css.
export const LINE_HEX: Record<string, string> = {
  red: "#ff4d4d",
  gold: "#ffb347",
  blue: "#4a9eff",
  green: "#3fb950"
};

export function normalizedLine(value: string) {
  return value.toLowerCase().replace(/\s+line\b/g, "").trim();
}

export function lineHex(line: string) {
  const normalized = normalizedLine(line);
  const key = Object.keys(LINE_HEX).find((candidate) => normalized.includes(candidate));
  return key ? LINE_HEX[key] : "#8b949e";
}

export function lineDisplayName(line: string) {
  const normalized = normalizedLine(line);
  const key = Object.keys(LINE_HEX).find((candidate) => normalized.includes(candidate));
  if (!key) return line.trim() || "Rail";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function directionDisplayLabel(direction: string) {
  const value = direction.trim().toUpperCase();
  if (value.startsWith("N")) return "Northbound";
  if (value.startsWith("S")) return "Southbound";
  if (value.startsWith("E")) return "Eastbound";
  if (value.startsWith("W")) return "Westbound";
  return direction.trim();
}

// MARTA reports schedule deviation as strings like "T0S" or "T120S" (seconds behind).
export function delayDisplayLabel(delay: string): string | undefined {
  const match = delay.trim().match(/^T(-?\d+)S$/i);
  if (!match) return undefined;

  const seconds = Number(match[1]);
  if (!Number.isFinite(seconds)) return undefined;
  if (Math.abs(seconds) < 90) return "On time";
  if (seconds > 0) return `About ${Math.round(seconds / 60)} min behind`;
  return "A touch early";
}

export function waitDisplay(arrival: RailArrival): { value: string; unit?: string } {
  const text = arrival.waitingTime.trim().toLowerCase();
  if (text === "boarding" || text === "arriving") {
    return { value: "Now" };
  }

  const minutes = Math.max(0, Math.ceil(arrival.waitingSeconds / 60));
  if (minutes === 0) return { value: "Now" };
  return { value: String(minutes), unit: "min" };
}

export function arrivalMatchesStationLine(arrival: RailArrival, station: Station) {
  const arrivalLine = normalizedLine(arrival.line);
  return station.line.some((line) => arrivalLine.includes(normalizedLine(line)));
}

export function desiredArrivalDirection(station: Station, route: MartaRoute) {
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

export function isStadiumBound(arrival: RailArrival, station: Station, route: MartaRoute) {
  if (!arrivalMatchesStationLine(arrival, station)) return false;

  const desired = desiredArrivalDirection(station, route);
  if (!desired) return true;
  return arrival.direction.trim().toUpperCase().startsWith(desired);
}

export function sortByWait(arrivals: RailArrival[]) {
  return [...arrivals].sort((a, b) => a.waitingSeconds - b.waitingSeconds);
}

// The first train that actually moves you toward the stadium from this station.
export function nextStadiumArrival(arrivals: RailArrival[], station: Station, route: MartaRoute) {
  return sortByWait(arrivals.filter((arrival) => isStadiumBound(arrival, station, route)))[0];
}

// Heading back: boarding at SEC District, west-side stations ride westbound,
// everyone else rides eastbound (direct on Blue, or one stop to Five Points
// for a Red/Gold transfer). Only Blue/Green trains stop at SEC District.
export function homewardDirection(station: Station) {
  return station.directionGroup === "west" ? "W" : "E";
}

export function isHomewardBound(arrival: RailArrival, station: Station) {
  const arrivalLine = normalizedLine(arrival.line);
  const ridesStadiumSegment = arrivalLine.includes("blue") || arrivalLine.includes("green");

  return ridesStadiumSegment && arrival.direction.trim().toUpperCase().startsWith(homewardDirection(station));
}

// The first train out of SEC District that starts your trip back.
export function nextHomewardArrival(arrivals: RailArrival[], station: Station) {
  return sortByWait(arrivals.filter((arrival) => isHomewardBound(arrival, station)))[0];
}
