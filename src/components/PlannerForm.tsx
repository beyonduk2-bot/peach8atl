"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { GetToStationActions } from "@/components/GetToStationActions";
import { MartaRailMapCard } from "@/components/MartaRailMapCard";
import { StationFinderCard } from "@/components/StationFinderCard";
import { StationLiveSection } from "@/components/StationLiveSection";
import { StationResultCard } from "@/components/StationResultCard";
import { areStationsClose, findNearestStations, getStationById } from "@/data/stations";
import { getWalkEstimate } from "@/lib/distance";
import type { Coordinates, GeocodeResponse, Station } from "@/types";

type NearbyStation = {
  station: Station;
  distanceMiles?: number;
  approxWalkMinutes?: number;
};

type StationState = {
  status: "idle" | "loading" | "ready" | "denied" | "error";
  coordinates?: Coordinates;
  message?: string;
  options: NearbyStation[];
  selectedStation?: Station;
};

const IDLE_STATE: StationState = { status: "idle", options: [] };

function stationFromText(value: string) {
  const input = value.trim().toLowerCase();
  const normalized = input.replace(/[^a-z0-9]+/g, " ").trim();
  const hasAirportSignal =
    normalized === "atl" ||
    /\bairport\b/.test(normalized) ||
    /\bhartsfield\b/.test(normalized) ||
    /\bhartsfield jackson\b/.test(normalized);

  if (hasAirportSignal) return getStationById("airport");
  if (
    input.includes("ballpark") ||
    input.includes("battery") ||
    input.includes("truist") ||
    input.includes("cumberland") ||
    input.includes("cobb") ||
    input.includes("smyrna")
  ) {
    return getStationById("buckhead");
  }
  if (input.includes("buckhead")) return getStationById("buckhead");
  if (input.includes("dunwoody")) return getStationById("dunwoody");
  if (input.includes("medical center")) return getStationById("medical-center");
  if (input.includes("lindbergh")) return getStationById("lindbergh-center");
  if (input.includes("arts center")) return getStationById("arts-center");
  if (input.includes("north avenue")) return getStationById("north-avenue");
  if (input.includes("civic center")) return getStationById("civic-center");
  if (input.includes("peachtree center")) return getStationById("peachtree-center");
  if (input.includes("midtown") || input.includes("downtown")) return getStationById("midtown");
  if (input.includes("alpharetta") || input.includes("north springs") || input.includes("johns creek")) {
    return getStationById("north-springs");
  }
  if (input.includes("doraville") || input.includes("duluth")) return getStationById("doraville");
  if (input.includes("chamblee")) return getStationById("chamblee");
  if (input.includes("brookhaven")) return getStationById("brookhaven");
  if (input.includes("lenox")) return getStationById("lenox");
  if (input.includes("decatur")) return getStationById("avondale");
  if (input.includes("stone mountain")) return getStationById("indian-creek");
  if (input.includes("west") || input.includes("mableton") || input.includes("douglasville")) {
    return getStationById("hamilton-e-holmes");
  }
  if (input.includes("college park") || input.includes("east point") || input.includes("south")) {
    return getStationById("college-park");
  }

  return getStationById("midtown");
}

function stationOptionsFromCoordinates(coordinates: Coordinates) {
  const nearest = findNearestStations(coordinates, { limit: 2 });
  const options = nearest.map(({ station, distanceMiles }) => ({
    station,
    distanceMiles,
    approxWalkMinutes: getWalkEstimate(coordinates, station).approxWalkMinutes
  }));

  return options.length > 1 && areStationsClose(options[0].distanceMiles ?? 0, options[1].distanceMiles ?? 99)
    ? options
    : options.slice(0, 1);
}

async function geocodeStartingPoint(query: string) {
  const response = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`, {
    cache: "no-store"
  });
  const data = (await response.json()) as GeocodeResponse;

  if (!response.ok || !data.result) {
    return undefined;
  }

  return data;
}

function originFromCoordinates(coordinates?: Coordinates) {
  if (!coordinates) return undefined;
  return `${coordinates.latitude},${coordinates.longitude}`;
}

function selectedOption(options: NearbyStation[], station?: Station) {
  if (!station) return undefined;
  return options.find((option) => option.station.id === station.id) ?? { station };
}

export function PlannerForm() {
  const [areaInput, setAreaInput] = useState("");
  const [stationState, setStationState] = useState<StationState>(IDLE_STATE);
  const currentOption = selectedOption(stationState.options, stationState.selectedStation);
  const selectedStation = currentOption?.station;
  const origin = stationState.coordinates ? originFromCoordinates(stationState.coordinates) : areaInput.trim() || undefined;

  async function setManualStation() {
    const query = areaInput.trim();

    setStationState({
      status: "loading",
      options: [],
      message: "Pinning down your starting point…"
    });

    const geocode = await geocodeStartingPoint(query).catch(() => undefined);

    if (geocode?.result) {
      const coordinates = {
        latitude: geocode.result.latitude,
        longitude: geocode.result.longitude
      };
      const options = stationOptionsFromCoordinates(coordinates);

      setStationState({
        status: "ready",
        coordinates,
        options,
        selectedStation: options[0].station,
        message:
          geocode.sourceName === "Peach8 place hint"
            ? "That's a spot we know well — still worth a quick glance in your map app."
            : "Found it. Give the route one last look in your map app before you head out."
      });
      return;
    }

    const station = stationFromText(query);

    setStationState({
      status: "ready",
      options: [{ station }],
      selectedStation: station,
      message:
        station.id === "airport"
          ? "Starting at the airport? Easy — the station is right inside the terminal."
          : "Our best guess from what you typed — double-check it in your map app."
    });
  }

  function requestNearestStation() {
    if (!navigator.geolocation) {
      setStationState({
        status: "error",
        options: [],
        message: "Location isn't available here — type a hotel, address, or neighborhood instead."
      });
      return;
    }

    setStationState({
      status: "loading",
      options: [],
      message: "Looking for stations near you…"
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        const closeOptions = stationOptionsFromCoordinates(coordinates);

        setStationState({
          status: "ready",
          coordinates,
          options: closeOptions,
          selectedStation: closeOptions[0].station,
          message: "Location used for this session only — nothing saved."
        });
      },
      () => {
        setStationState({
          status: "denied",
          options: [],
          message: "No worries — type a hotel, address, or neighborhood instead."
        });
      },
      {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 8_000
      }
    );
  }

  return (
    <div className="space-y-3 pb-2">
      {!selectedStation ? (
        <>
          <StationFinderCard
            inputValue={areaInput}
            message={stationState.message}
            status={stationState.status}
            onInputChange={(value) => {
              setAreaInput(value);
            }}
            onSubmitText={() => {
              void setManualStation();
            }}
            onUseLocation={requestNearestStation}
          />

          <Link
            className="focus-ring flex items-center justify-between gap-3 rounded-[1.75rem] border border-white/10 bg-[#161b27] p-4 text-sm font-semibold text-[#8b949e] shadow-sm transition active:scale-[0.99]"
            href="/matches"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="text-[#ffb347]" size={16} />
              Wondering when the matches are?
            </span>
            <span className="text-[#ffb347]">Matchdays →</span>
          </Link>
        </>
      ) : (
        <>
          <StationResultCard
            approxWalkMinutes={currentOption?.approxWalkMinutes}
            distanceMiles={currentOption?.distanceMiles}
            note={stationState.message}
            options={stationState.options}
            station={selectedStation}
            onReset={() => setStationState(IDLE_STATE)}
            onSelect={(station) => {
              setStationState((current) => ({
                ...current,
                selectedStation: station
              }));
            }}
          />
          <GetToStationActions origin={origin} station={selectedStation} />
          <StationLiveSection station={selectedStation} />
          <MartaRailMapCard startStationId={selectedStation.id} />
        </>
      )}
    </div>
  );
}
