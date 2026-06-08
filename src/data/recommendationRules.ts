import { getMatchById } from "@/data/matches";
import { getStationById } from "@/data/stations";
import { buildGoogleMapsUrl } from "@/lib/maps";
import { addMinutes, combineDateAndTime, formatPlanTime } from "@/lib/time";
import type { DestinationType, GeneratedPlan, StartingType, Station } from "@/types";

type GeneratePlanInput = {
  matchId: string;
  destination: DestinationType;
  startingType: StartingType;
  areaInput: string;
  stationId?: string;
};

type RuleResult = {
  station: Station;
  backupStation?: Station;
  transferNote?: string;
};

const destinationDetails: Record<
  DestinationType,
  {
    label: string;
    transitDestination: string;
    exitSuggestion: string;
  }
> = {
  stadium: {
    label: "Stadium",
    transitDestination: "Five Points Station Atlanta GA",
    exitSuggestion: "SEC District Station"
  },
  "fan-festival": {
    label: "Fan Festival",
    transitDestination: "Centennial Olympic Park Atlanta GA",
    exitSuggestion: "Downtown park and Fan Festival area"
  }
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function stationForArea(areaInput: string, startingType: StartingType): RuleResult {
  const area = normalize(areaInput);

  if (area.includes("alpharetta") || area.includes("johns creek") || area.includes("north atlanta")) {
    return {
      station: getStationById("north-springs"),
      backupStation: getStationById("sandy-springs")
    };
  }

  if (area.includes("north springs")) {
    return {
      station: getStationById("north-springs"),
      backupStation: getStationById("sandy-springs")
    };
  }

  if (area.includes("duluth") || area.includes("doraville")) {
    return {
      station: getStationById("doraville"),
      backupStation: getStationById("chamblee"),
      transferNote: "Gold line riders can usually stay on the same line toward downtown."
    };
  }

  if (area.includes("chamblee")) {
    return {
      station: getStationById("chamblee"),
      backupStation: getStationById("doraville"),
      transferNote: "Gold line riders can usually stay on the same line toward downtown."
    };
  }

  if (area.includes("decatur")) {
    return {
      station: getStationById("avondale"),
      backupStation: getStationById("indian-creek"),
      transferNote: "Blue line riders may transfer downtown for the shortest walk, depending on event operations."
    };
  }

  if (area.includes("stone mountain")) {
    return {
      station: getStationById("indian-creek"),
      backupStation: getStationById("avondale"),
      transferNote: "Blue line riders may transfer downtown for the shortest walk, depending on event operations."
    };
  }

  if (area.includes("west") || area.includes("douglasville") || area.includes("mableton")) {
    return {
      station: getStationById("hamilton-e-holmes"),
      transferNote: "Blue line riders may transfer downtown for the shortest walk, depending on event operations."
    };
  }

  if (area.includes("airport")) {
    if (startingType === "driving-in") {
      return {
        station: getStationById("college-park"),
        backupStation: getStationById("east-point")
      };
    }

    return {
      station: getStationById("airport"),
      backupStation: getStationById("college-park")
    };
  }

  if (area.includes("south") || area.includes("college park") || area.includes("east point")) {
    return {
      station: getStationById("college-park"),
      backupStation: getStationById("east-point")
    };
  }

  if (area.includes("buckhead")) {
    if (startingType === "driving-in") {
      return {
        station: getStationById("north-springs"),
        backupStation: getStationById("sandy-springs")
      };
    }

    return {
      station: getStationById("buckhead"),
      backupStation: getStationById("midtown")
    };
  }

  if (area.includes("midtown") || area.includes("downtown")) {
    if (startingType === "driving-in") {
      return {
        station: getStationById("north-springs"),
        backupStation: getStationById("doraville")
      };
    }

    return {
      station: getStationById("midtown")
    };
  }

  if (startingType === "driving-in") {
    return {
      station: getStationById("north-springs"),
      backupStation: getStationById("doraville")
    };
  }

  return {
    station: getStationById("midtown"),
    backupStation: getStationById("buckhead")
  };
}

function stationForInput({ areaInput, startingType, stationId }: GeneratePlanInput): RuleResult {
  if (stationId) {
    try {
      return {
        station: getStationById(stationId)
      };
    } catch {
      return stationForArea(areaInput, startingType);
    }
  }

  return stationForArea(areaInput, startingType);
}

function estimateRailMinutes(station: Station) {
  switch (station.directionGroup) {
    case "north":
      return 35;
    case "south":
      return 30;
    case "east":
      return 28;
    case "west":
      return 24;
    case "central":
      return 16;
    default:
      return 35;
  }
}

function railDirectionFor(station: Station) {
  if (station.directionGroup === "south") {
    return "northbound toward downtown";
  }

  if (station.directionGroup === "central") {
    return "toward the stadium area";
  }

  if (station.directionGroup === "east" || station.directionGroup === "west") {
    return "toward Five Points";
  }

  return station.line.includes("Red") || station.line.includes("Gold") ? "southbound toward downtown" : "toward downtown";
}

function needsFivePointsTransfer(station: Station) {
  return station.directionGroup === "east" || station.directionGroup === "west";
}

export function generatePlan(input: GeneratePlanInput): GeneratedPlan {
  const { matchId, destination, startingType, areaInput } = input;
  const match = getMatchById(matchId);
  const destinationDetail = destinationDetails[destination];
  const { station, backupStation, transferNote } = stationForInput(input);
  const kickoff = combineDateAndTime(match.date, match.kickoffTime);
  const targetArrival = addMinutes(kickoff, -match.recommendedArrivalBufferMinutes);
  const railMinutes = estimateRailMinutes(station);
  const driveBuffer = startingType === "driving-in" ? 35 : 10;
  const leaveBy = addMinutes(targetArrival, -(railMinutes + driveBuffer));
  const railLine = station.line.join(" / ");
  const railDirection = railDirectionFor(station);
  const originProvided = Boolean(areaInput.trim()) && areaInput !== "Current location";
  const originForMaps = originProvided ? areaInput.trim() : undefined;
  const transferStation = needsFivePointsTransfer(station) ? "Five Points" : undefined;
  const parkingNote =
    startingType === "driving-in"
      ? `${station.parkingNote} Do not rely on this MVP for final parking availability.`
      : undefined;
  const originNote = originProvided
    ? "Address text is passed only to Google Maps links in this MVP; no geocoding or storage is implemented."
    : "No precise origin is stored. Confirm the final route in Google Maps before leaving.";

  const routeSteps = [
    {
      kind: "start" as const,
      title: "Start",
      body: originProvided ? "Leave your address, hotel, area, or station." : "Start from your current place.",
      label: originProvided ? areaInput.trim() : undefined
    },
    {
      kind: startingType === "driving-in" ? ("drive" as const) : ("station" as const),
      title: startingType === "driving-in" ? "Drive to station" : "Go to station",
      body: `Head to ${station.name} Station.`,
      label: startingType === "driving-in" ? "Park & ride" : "Station"
    },
    {
      kind: "rail" as const,
      title: "Ride MARTA rail",
      body: `Take ${railLine} Line ${railDirection}.`,
      label: `${railLine} Line`
    },
    ...(transferStation
      ? [
          {
            kind: "transfer" as const,
            title: "Transfer",
            body: `Transfer at ${transferStation} for the shortest stadium-area walk.`,
            label: transferStation
          }
        ]
      : []),
    {
      kind: "arrive" as const,
      title: `Exit near ${destinationDetail.label}`,
      body: `Exit at ${destinationDetail.exitSuggestion} and walk to the stadium area.`,
      label: destinationDetail.label
    }
  ];

  const googleDriveUrl = buildGoogleMapsUrl({
    origin: originForMaps,
    destination: station.mapsQuery,
    mode: "driving"
  });
  const googleTransitUrl = buildGoogleMapsUrl({
    origin: startingType === "near-rail" ? originForMaps ?? station.mapsQuery : station.mapsQuery,
    destination: destinationDetail.transitDestination,
    mode: "transit"
  });
  const shareText = [
    "My Peach8 ATL matchday transit plan:",
    `${match.displayName}, ${match.round}.`,
    `Leave by ${formatPlanTime(leaveBy)}.`,
    `Start at ${station.name} station.`,
    `Ride ${railLine} ${railDirection}.`,
    `Exit near ${destinationDetail.exitSuggestion}.`,
    "Unofficial fan-made guide. Check official sources before you go."
  ].join(" ");

  return {
    match,
    startingType,
    destination,
    destinationLabel: destinationDetail.label,
    areaInput,
    recommendedStation: station,
    backupStation,
    routeSteps,
    leaveByTime: formatPlanTime(leaveBy),
    targetStationArrivalTime: formatPlanTime(targetArrival),
    railLine,
    railDirection,
    transferNote,
    exitStationSuggestion: destinationDetail.exitSuggestion,
    parkingNote,
    originNote,
    googleDriveUrl,
    googleTransitUrl,
    calendarEventUrl: leaveBy.toISOString(),
    shareText
  };
}
