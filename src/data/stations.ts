import type { Coordinates, Station } from "@/types";
import { distanceMiles } from "@/lib/distance";

// Rail station planning data checked against MARTA parking availability/fees pages on 2026-06-06.
export const stations: Station[] = [
  {
    id: "north-springs",
    name: "North Springs",
    line: ["Red"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at North Springs.",
    latitude: 33.9456,
    longitude: -84.3572,
    mapsQuery: "North Springs Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "sandy-springs",
    name: "Sandy Springs",
    line: ["Red"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at Sandy Springs.",
    latitude: 33.9321,
    longitude: -84.3516,
    mapsQuery: "Sandy Springs Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "dunwoody",
    name: "Dunwoody",
    line: ["Red"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at Dunwoody.",
    latitude: 33.9211,
    longitude: -84.3441,
    mapsQuery: "Dunwoody Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "medical-center",
    name: "Medical Center",
    line: ["Red"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at Medical Center.",
    latitude: 33.9104,
    longitude: -84.3517,
    mapsQuery: "Medical Center Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "buckhead",
    name: "Buckhead",
    line: ["Red"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Best treated as a walk-up or rideshare drop-off MARTA rail option in this MVP.",
    latitude: 33.8479,
    longitude: -84.3673,
    mapsQuery: "Buckhead Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "lindbergh-center",
    name: "Lindbergh Center",
    line: ["Red", "Gold"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at Lindbergh Center.",
    latitude: 33.8237,
    longitude: -84.3694,
    mapsQuery: "Lindbergh Center Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "arts-center",
    name: "Arts Center",
    line: ["Red", "Gold"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Best for riders already near the MARTA rail corridor.",
    latitude: 33.7893,
    longitude: -84.3871,
    mapsQuery: "Arts Center Station Atlanta GA",
    directionGroup: "central"
  },
  {
    id: "midtown",
    name: "Midtown",
    line: ["Red", "Gold"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Best for riders already near the MARTA rail corridor.",
    latitude: 33.7807,
    longitude: -84.3867,
    mapsQuery: "Midtown Station Atlanta GA",
    directionGroup: "central"
  },
  {
    id: "north-avenue",
    name: "North Avenue",
    line: ["Red", "Gold"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Best for riders already near the MARTA rail corridor.",
    latitude: 33.7716,
    longitude: -84.3873,
    mapsQuery: "North Avenue Station Atlanta GA",
    directionGroup: "central"
  },
  {
    id: "civic-center",
    name: "Civic Center",
    line: ["Red", "Gold"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Best for riders already near the MARTA rail corridor.",
    latitude: 33.7663,
    longitude: -84.3876,
    mapsQuery: "Civic Center Station Atlanta GA",
    directionGroup: "central"
  },
  {
    id: "peachtree-center",
    name: "Peachtree Center",
    line: ["Red", "Gold"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Best for riders already near downtown.",
    latitude: 33.7597,
    longitude: -84.3875,
    mapsQuery: "Peachtree Center Station Atlanta GA",
    directionGroup: "central"
  },
  {
    id: "doraville",
    name: "Doraville",
    line: ["Gold"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at Doraville.",
    latitude: 33.9026,
    longitude: -84.2802,
    mapsQuery: "Doraville Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "brookhaven",
    name: "Brookhaven",
    line: ["Gold"],
    hasDailyParking: true,
    hasLongTermParking: false,
    parkingNote: "MARTA lists free daily parking at Brookhaven/Oglethorpe University; long-term parking is not listed as available.",
    latitude: 33.8603,
    longitude: -84.339,
    mapsQuery: "Brookhaven Oglethorpe Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "lenox",
    name: "Lenox",
    line: ["Gold"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at Lenox.",
    latitude: 33.8463,
    longitude: -84.3579,
    mapsQuery: "Lenox Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "chamblee",
    name: "Chamblee",
    line: ["Gold"],
    hasDailyParking: true,
    hasLongTermParking: false,
    parkingNote: "MARTA lists free daily parking at Chamblee; long-term parking is not listed as available.",
    latitude: 33.8874,
    longitude: -84.3058,
    mapsQuery: "Chamblee Station Atlanta GA",
    directionGroup: "north"
  },
  {
    id: "avondale",
    name: "Avondale",
    line: ["Blue"],
    hasDailyParking: true,
    hasLongTermParking: false,
    parkingNote: "MARTA lists free daily parking at Avondale; long-term parking is not listed as available.",
    latitude: 33.7754,
    longitude: -84.2819,
    mapsQuery: "Avondale Station Decatur GA",
    directionGroup: "east"
  },
  {
    id: "indian-creek",
    name: "Indian Creek",
    line: ["Blue"],
    hasDailyParking: true,
    hasLongTermParking: false,
    parkingNote: "MARTA lists free daily parking at Indian Creek; long-term parking is not listed as available.",
    latitude: 33.7696,
    longitude: -84.2292,
    mapsQuery: "Indian Creek Station Atlanta GA",
    directionGroup: "east"
  },
  {
    id: "hamilton-e-holmes",
    name: "Hamilton E. Holmes",
    line: ["Blue"],
    hasDailyParking: true,
    hasLongTermParking: false,
    parkingNote: "MARTA lists free daily parking at Hamilton E. Holmes; long-term parking is not listed as available.",
    latitude: 33.7546,
    longitude: -84.469,
    mapsQuery: "Hamilton E Holmes Station Atlanta GA",
    directionGroup: "west"
  },
  {
    id: "vine-city",
    name: "Vine City",
    line: ["Blue", "Green"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Treat as a stadium-area exit option, not a parking recommendation.",
    latitude: 33.7566,
    longitude: -84.4039,
    mapsQuery: "Vine City Station Atlanta GA",
    directionGroup: "west"
  },
  {
    id: "airport",
    name: "Airport",
    line: ["Red", "Gold"],
    hasDailyParking: false,
    hasLongTermParking: false,
    parkingNote: "Use for airport-origin riders, not as a matchday parking recommendation.",
    latitude: 33.6407,
    longitude: -84.4466,
    mapsQuery: "Airport Station Atlanta GA",
    directionGroup: "south"
  },
  {
    id: "college-park",
    name: "College Park",
    line: ["Red", "Gold"],
    hasDailyParking: true,
    hasLongTermParking: true,
    parkingNote: "MARTA lists free daily parking and paid long-term parking at College Park.",
    latitude: 33.6515,
    longitude: -84.4487,
    mapsQuery: "College Park Station Atlanta GA",
    directionGroup: "south"
  },
  {
    id: "east-point",
    name: "East Point",
    line: ["Red", "Gold"],
    hasDailyParking: true,
    hasLongTermParking: false,
    parkingNote: "MARTA lists free daily parking at East Point; long-term parking is not listed as available.",
    latitude: 33.6767,
    longitude: -84.4404,
    mapsQuery: "East Point Station Atlanta GA",
    directionGroup: "south"
  }
];

export function getStationById(stationId: string): Station {
  const station = stations.find((candidate) => candidate.id === stationId);

  if (!station) {
    throw new Error(`Unknown station id: ${stationId}`);
  }

  return station;
}

export function distanceToStationMiles(from: Coordinates, station: Station) {
  return distanceMiles(from, station);
}

export function findNearestStation(
  coordinates: Coordinates,
  { preferParking = false }: { preferParking?: boolean } = {}
): Station {
  return findNearestStations(coordinates, { preferParking, limit: 1 })[0].station;
}

export function findNearestStations(
  coordinates: Coordinates,
  { preferParking = false, limit = 2 }: { preferParking?: boolean; limit?: number } = {}
): Array<{ station: Station; distanceMiles: number }> {
  const candidates = preferParking ? stations.filter((station) => station.hasDailyParking) : stations;

  return [...(candidates.length ? candidates : stations)]
    .map((station) => ({
      station,
      distanceMiles: distanceToStationMiles(coordinates, station)
    }))
    .sort(
      (a, b) => a.distanceMiles - b.distanceMiles
    )
    .slice(0, limit);
}

export function areStationsClose(firstDistance: number, secondDistance: number) {
  return secondDistance - firstDistance <= 0.25;
}
