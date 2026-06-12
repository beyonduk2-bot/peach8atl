import type { Station } from "@/types";

export type MartaRoute = {
  modeLabel: string;
  startLabel: string;
  line: string;
  direction: string;
  transferStation?: string;
  exitStation: string;
  alternateExitStation: string;
  walkInstruction: string;
  estimatedRideMinutes: number;
  stops: string[];
  instructions: string[];
};

const redNorthToFivePoints = [
  "North Springs",
  "Sandy Springs",
  "Dunwoody",
  "Medical Center",
  "Buckhead",
  "Lindbergh Center",
  "Arts Center",
  "Midtown",
  "North Avenue",
  "Civic Center",
  "Peachtree Center",
  "Five Points"
];

const goldNorthToFivePoints = [
  "Doraville",
  "Chamblee",
  "Brookhaven",
  "Lenox",
  "Lindbergh Center",
  "Arts Center",
  "Midtown",
  "North Avenue",
  "Civic Center",
  "Peachtree Center",
  "Five Points"
];

const southToFivePoints = [
  "Airport",
  "College Park",
  "East Point",
  "Lakewood/Ft. McPherson",
  "Oakland City",
  "West End",
  "Garnett",
  "Five Points"
];

const eastBlueToSecDistrict = [
  "Indian Creek",
  "Kensington",
  "Avondale",
  "Decatur",
  "East Lake",
  "Edgewood/Candler Park",
  "Inman Park/Reynoldstown",
  "King Memorial",
  "Georgia State",
  "Five Points",
  "SEC District Station"
];

const westBlueToSecDistrict = ["Hamilton E. Holmes", "West Lake", "Ashby", "Vine City", "SEC District Station"];
const greenToSecDistrict = ["Bankhead", "Ashby", "Vine City", "SEC District Station"];

function uniqueStops(stops: string[]) {
  return stops.filter((stop, index) => stops.indexOf(stop) === index);
}

function primaryLine(station: Station) {
  return station.line[0] ?? "Rail";
}

function stopsFrom(stationName: string, sequence: string[]) {
  const stationIndex = sequence.indexOf(stationName);

  if (stationIndex < 0) {
    return sequence;
  }

  return sequence.slice(stationIndex);
}

function withoutStart(stationName: string, stops: string[]) {
  return stops.filter((stop) => stop !== stationName);
}

function estimateRailMinutesForStation(station: Station) {
  switch (station.directionGroup) {
    case "north":
      return station.line.includes("Gold") && !station.line.includes("Red") ? 32 : 28;
    case "south":
      return station.id === "airport" ? 24 : 20;
    case "east":
      return 26;
    case "west":
      return station.id === "vine-city" ? 5 : 18;
    case "central":
      return 12;
    default:
      return 30;
  }
}

function routeToStadium(station: Station): MartaRoute {
  const line = primaryLine(station);
  const isRed = station.line.includes("Red");
  const isGold = station.line.includes("Gold") && !isRed;
  const isBlue = station.line.includes("Blue");
  const isGreen = station.line.includes("Green");
  const exitStation = "SEC District Station";
  const alternateExitStation = "Vine City Station";
  let direction = "toward Five Points";
  let transferStation: string | undefined = "Five Points";
  let middleStops = ["Five Points"];

  if (isRed && station.directionGroup !== "south") {
    direction = "southbound";
    middleStops = withoutStart(station.name, stopsFrom(station.name, redNorthToFivePoints));
  } else if (isGold && station.directionGroup !== "south") {
    direction = "southbound";
    middleStops = withoutStart(station.name, stopsFrom(station.name, goldNorthToFivePoints));
  } else if ((isRed || isGold) && station.directionGroup === "south") {
    direction = "northbound";
    middleStops = withoutStart(station.name, stopsFrom(station.name, southToFivePoints));
  } else if (isBlue && station.directionGroup === "east") {
    direction = "westbound toward the stadium";
    middleStops = withoutStart(station.name, stopsFrom(station.name, eastBlueToSecDistrict));
    transferStation = undefined;
  } else if ((isBlue || isGreen) && station.directionGroup === "west") {
    direction = "eastbound toward the stadium";
    middleStops = withoutStart(station.name, stopsFrom(station.name, isGreen && station.name === "Bankhead" ? greenToSecDistrict : westBlueToSecDistrict));
    transferStation = undefined;
  } else if (station.directionGroup === "central") {
    direction = "toward Five Points";
    middleStops = withoutStart(station.name, stopsFrom(station.name, redNorthToFivePoints));
  }

  const stops = uniqueStops([station.name, ...middleStops.filter((stop) => stop !== station.name), exitStation, alternateExitStation]);
  const instructions = [
    `Start at ${station.name} Station`,
    `Ride ${line} Line ${direction}`,
    ...(transferStation ? [`Transfer at ${transferStation}`] : []),
    `Exit at ${exitStation}`,
    "Walk to stadium area"
  ];

  return {
    modeLabel: "To Stadium",
    startLabel: station.name,
    line: `${line} Line`,
    direction,
    transferStation,
    exitStation,
    alternateExitStation,
    walkInstruction: "Walk to stadium area",
    estimatedRideMinutes: estimateRailMinutesForStation(station),
    stops,
    instructions
  };
}

export function getMartaRoute(station: Station) {
  return routeToStadium(station);
}
