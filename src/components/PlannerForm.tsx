"use client";

import { useState } from "react";
import { getDefaultMatch, matches } from "@/data/matches";
import { areStationsClose, findNearestStations, getStationById } from "@/data/stations";
import { MatchChipSelector } from "@/components/MatchChipSelector";
import { MatchCountdownCard } from "@/components/MatchCountdownCard";
import { BeforeYouGoAccordion } from "@/components/BeforeYouGoAccordion";
import { MartaRailMapCard } from "@/components/MartaRailMapCard";
import { NextTrainHero } from "@/components/NextTrainHero";
import { OfficialCheckCard } from "@/components/OfficialCheckCard";
import { StationFinderCard } from "@/components/StationFinderCard";
import { GetToStationActions } from "@/components/GetToStationActions";
import { getWalkEstimate } from "@/lib/distance";
import { useNow } from "@/lib/useNow";
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
  const defaultMatch = getDefaultMatch();
  const now = useNow(1000);
  const [selectedMatchId, setSelectedMatchId] = useState(defaultMatch.id);
  const [areaInput, setAreaInput] = useState("");
  const [stationState, setStationState] = useState<StationState>({
    status: "idle",
    options: []
  });
  const selectedMatch = matches.find((match) => match.id === selectedMatchId) ?? defaultMatch;
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
            ? "Nice — that's a spot we know well. Give the route a final glance in your map app."
            : "Got it. Give the route one last glance in your map app before you roll."
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
          ? "Starting at ATL? Lucky you — Airport Station is right inside the terminal."
          : "Our best read from what you typed — give it a quick sanity check in your map app."
    });
  }

  function requestNearestStation() {
    if (areaInput.trim()) {
      void setManualStation();
      return;
    }

    if (!navigator.geolocation) {
      setStationState({
        status: "error",
        options: [],
        message: "No worries — just type a hotel, address, neighborhood, or station instead."
      });
      return;
    }

    setStationState({
      status: "loading",
      options: [],
      message: "Finding a nearby MARTA station…"
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
          message: "Location used for this session only. No breadcrumbs saved."
        });
      },
      () => {
        setStationState({
          status: "denied",
          options: [],
          message: "No worries — just type a hotel, address, neighborhood, or station instead."
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
          <MatchChipSelector matches={matches} selectedMatchId={selectedMatch.id} onSelect={setSelectedMatchId} />

          <MatchCountdownCard
            countdownLabel={formatCountdown(defaultMatch.date, defaultMatch.kickoffTime, now)}
            dateLabel={formatMatchDate(defaultMatch.date)}
            kickoffLabel={formatKickoffTime(defaultMatch.date, defaultMatch.kickoffTime)}
            match={defaultMatch}
          />

          <StationFinderCard
            inputValue={areaInput}
            message={stationState.message}
            status={stationState.status}
            onFindStation={requestNearestStation}
            onInputChange={(value) => {
              setAreaInput(value);
            }}
          />
        </>
      ) : null}

      {selectedStation ? (
        <NextTrainHero
          approxWalkMinutes={currentOption?.approxWalkMinutes}
          options={stationState.options}
          station={selectedStation}
          onSelect={(station) => {
            setStationState((current) => ({
              ...current,
              selectedStation: station
            }));
          }}
        />
      ) : null}

      {selectedStation ? (
        <>
          <MartaRailMapCard startStationId={selectedStation.id} />
          {selectedStation ? <GetToStationActions origin={origin} station={selectedStation} /> : null}
          <OfficialCheckCard />
          <BeforeYouGoAccordion />
        </>
      ) : null}
    </div>
  );
}
