import type { Coordinates } from "@/types";

const EARTH_RADIUS_MILES = 3958.8;
const WALK_MINUTES_PER_MILE = 20;
const WALK_BUFFER_MINUTES = 1;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function distanceMiles(from: Coordinates, to: Coordinates) {
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function approxWalkMinutes(distance: number) {
  if (distance <= 0.05) {
    return 2;
  }

  return Math.max(2, Math.ceil(distance * WALK_MINUTES_PER_MILE + WALK_BUFFER_MINUTES));
}

export function getWalkEstimate(from: Coordinates, to: Coordinates) {
  const miles = distanceMiles(from, to);

  return {
    distanceMiles: miles,
    approxWalkMinutes: approxWalkMinutes(miles)
  };
}
