const GOOGLE_MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1";

type MapsMode = "driving" | "transit";

export function buildGoogleMapsUrl({
  origin,
  destination,
  mode
}: {
  origin?: string;
  destination: string;
  mode: MapsMode;
}) {
  const params = new URLSearchParams({
    destination,
    travelmode: mode
  });

  if (origin?.trim()) {
    params.set("origin", origin.trim());
  }

  return `${GOOGLE_MAPS_DIRECTIONS_URL}&${params.toString()}`;
}
