import { NextRequest, NextResponse } from "next/server";
import type { RailArrival } from "@/types";
import { stations } from "@/data/stations";

const MARTA_RAIL_REALTIME_URL =
  "https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata";
const CACHE_TTL_MS = 30_000;
const LIVE_REQUEST_TIMEOUT_MS = 3_500;
const LIVE_UNAVAILABLE_MESSAGE = "Live MARTA rail data is temporarily unavailable. Showing sample data.";

type MartaRailRealtimeArrival = {
  DESTINATION?: string;
  DIRECTION?: string;
  EVENT_TIME?: string;
  IS_REALTIME?: string | boolean;
  LINE?: string;
  NEXT_ARR?: string;
  STATION?: string;
  WAITING_SECONDS?: string | number;
  WAITING_TIME?: string;
  DELAY?: string;
  LATITUDE?: string | number;
  LONGITUDE?: string | number;
};

type RailCache = {
  expiresAt: number;
  arrivals: RailArrival[];
};

let railCache: RailCache | null = null;

function normalizeStationName(value: string) {
  return value
    .toLowerCase()
    .replace(/\bstation\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function findStationRecord(stationName: string) {
  const normalized = normalizeStationName(stationName);
  return stations.find((candidate) => {
    const candidateName = normalizeStationName(candidate.name);
    return normalized.includes(candidateName) || candidateName.includes(normalized);
  });
}

function coordinatesForStation(stationName: string) {
  const station = findStationRecord(stationName);

  return {
    latitude: station?.latitude ?? 33.7537,
    longitude: station?.longitude ?? -84.3863
  };
}

// Sample data mirrors what the live feed would say at this station, so the UI
// reads the same either way: correct line, a stadium-bound direction, and a
// plausible opposite-direction train.
function mockArrivals(station: string): RailArrival[] {
  // The stadium station isn't in the planning data (it's the destination, not
  // a start), so sample its Blue/Green stadium-segment trains explicitly. It
  // can be requested as "SEC District" or by its feed name "Omni Dome".
  const normalized = normalizeStationName(station);
  if (normalized.includes("secdistrict") || normalized.includes("omnidome")) {
    return mockSecDistrictArrivals(station);
  }

  const record = findStationRecord(station);
  const latitude = record?.latitude ?? 33.7537;
  const longitude = record?.longitude ?? -84.3863;
  const line = (record?.line[0] ?? "Red").toUpperCase();
  const group = record?.directionGroup ?? "central";

  const toStadium =
    group === "south"
      ? { direction: "N", destination: line === "GOLD" ? "Doraville" : "North Springs" }
      : group === "east"
        ? { direction: "W", destination: "H. E. Holmes" }
        : group === "west"
          ? { direction: "E", destination: "Indian Creek" }
          : { direction: "S", destination: "Airport" };
  const opposite =
    group === "south"
      ? { direction: "S", destination: "Airport" }
      : group === "east"
        ? { direction: "E", destination: "Indian Creek" }
        : group === "west"
          ? { direction: "W", destination: "H. E. Holmes" }
          : { direction: "N", destination: line === "GOLD" ? "Doraville" : "North Springs" };

  const sample = (minutes: number, direction: string, destination: string): RailArrival => ({
    destination,
    direction,
    eventTime: new Date(Date.now() + minutes * 60_000).toISOString(),
    isRealtime: false,
    line,
    nextArrival: `${minutes} min`,
    station,
    waitingSeconds: minutes * 60,
    waitingTime: `${minutes} min`,
    delay: "T0S",
    latitude,
    longitude
  });

  return [
    sample(4, toStadium.direction, toStadium.destination),
    sample(12, toStadium.direction, toStadium.destination),
    sample(7, opposite.direction, opposite.destination)
  ];
}

function mockSecDistrictArrivals(station: string): RailArrival[] {
  const latitude = 33.7589;
  const longitude = -84.3987;

  const sample = (minutes: number, line: string, direction: string, destination: string): RailArrival => ({
    destination,
    direction,
    eventTime: new Date(Date.now() + minutes * 60_000).toISOString(),
    isRealtime: false,
    line,
    nextArrival: `${minutes} min`,
    station,
    waitingSeconds: minutes * 60,
    waitingTime: `${minutes} min`,
    delay: "T0S",
    latitude,
    longitude
  });

  return [
    sample(3, "BLUE", "E", "Indian Creek"),
    sample(8, "GREEN", "E", "Edgewood/Candler Park"),
    sample(5, "BLUE", "W", "H. E. Holmes")
  ];
}

function parseBoolean(value: string | boolean | undefined) {
  if (typeof value === "boolean") {
    return value;
  }

  return value?.toLowerCase() === "true";
}

function parseNumber(value: string | number | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseMartaEventTime(value: string | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

function normalizeArrival(arrival: MartaRailRealtimeArrival): RailArrival {
  const stationName = arrival.STATION?.trim() || "Unknown station";
  const fallbackCoordinates = coordinatesForStation(stationName);

  return {
    destination: arrival.DESTINATION?.trim() || "Unknown destination",
    direction: arrival.DIRECTION?.trim() || "Unknown direction",
    eventTime: parseMartaEventTime(arrival.EVENT_TIME),
    isRealtime: parseBoolean(arrival.IS_REALTIME),
    line: arrival.LINE?.trim() || "Unknown line",
    nextArrival: arrival.NEXT_ARR?.trim() || arrival.WAITING_TIME?.trim() || "Unavailable",
    station: stationName,
    waitingSeconds: parseNumber(arrival.WAITING_SECONDS),
    waitingTime: arrival.WAITING_TIME?.trim() || "Unavailable",
    delay: arrival.DELAY?.trim() || "No delay reported",
    latitude: parseNumber(arrival.LATITUDE, fallbackCoordinates.latitude),
    longitude: parseNumber(arrival.LONGITUDE, fallbackCoordinates.longitude)
  };
}

// Only ever return trains for the requested station. An empty list is more
// honest than borrowing arrivals from elsewhere and labeling them "Live".
function filterArrivalsForStation(arrivals: RailArrival[], station: string) {
  const requestedStation = normalizeStationName(station);

  return arrivals.filter((arrival) => {
    const arrivalStation = normalizeStationName(arrival.station);
    return arrivalStation.includes(requestedStation) || requestedStation.includes(arrivalStation);
  });
}

async function fetchLiveArrivals(apiKey: string) {
  const cached = railCache && railCache.expiresAt > Date.now() ? railCache.arrivals : null;

  if (cached) {
    return cached;
  }

  const url = new URL(MARTA_RAIL_REALTIME_URL);
  url.searchParams.set("apiKey", apiKey);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LIVE_REQUEST_TIMEOUT_MS);

  const response = await fetch(url, {
    cache: "no-store",
    signal: controller.signal
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`Rail realtime request failed with status ${response.status}`);
  }

  const data = (await response.json()) as MartaRailRealtimeArrival[] | MartaRailRealtimeArrival;
  const rawArrivals = Array.isArray(data) ? data : [data];
  const arrivals = rawArrivals.map(normalizeArrival);

  railCache = {
    arrivals,
    expiresAt: Date.now() + CACHE_TTL_MS
  };

  return arrivals;
}

export async function GET(request: NextRequest) {
  const station = request.nextUrl.searchParams.get("station") ?? "Selected station";
  // MARTA_API_KEY is server-only. Never rename it to NEXT_PUBLIC_MARTA_API_KEY:
  // NEXT_PUBLIC_ variables are bundled into browser JavaScript and would expose the key.
  const apiKey = process.env.MARTA_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json({
      isMock: true,
      arrivals: mockArrivals(station)
    });
  }

  try {
    const arrivals = await fetchLiveArrivals(apiKey);

    return NextResponse.json({
      isMock: false,
      arrivals: filterArrivalsForStation(arrivals, station)
    });
  } catch {
    return NextResponse.json({
      isMock: true,
      errorMessage: LIVE_UNAVAILABLE_MESSAGE,
      arrivals: mockArrivals(station)
    });
  }
}
