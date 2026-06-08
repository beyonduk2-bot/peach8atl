import { NextRequest, NextResponse } from "next/server";
import type { GeocodeResponse } from "@/types";

export const dynamic = "force-dynamic";

type CensusAddressMatch = {
  matchedAddress?: string;
  coordinates?: {
    x?: number;
    y?: number;
  };
};

type CensusGeocodeResponse = {
  result?: {
    addressMatches?: CensusAddressMatch[];
  };
};

type PlaceHint = {
  label: string;
  latitude: number;
  longitude: number;
  patterns: string[];
};

const ATLANTA_AREA_HINTS: PlaceHint[] = [
  {
    label: "Ballpark / Cumberland area",
    latitude: 33.8898,
    longitude: -84.4666,
    patterns: ["even hotel atlanta ballpark", "ballpark area by ihg", "battery", "truist", "cumberland", "cobb galleria"]
  }
];

function normalizedText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findPlaceHint(query: string) {
  const normalized = normalizedText(query);

  return ATLANTA_AREA_HINTS.find((hint) => hint.patterns.some((pattern) => normalized.includes(pattern)));
}

function atlantaBiasedQuery(query: string) {
  const normalized = normalizedText(query);

  if (/\bga\b/.test(normalized) || /\bgeorgia\b/.test(normalized) || /\batlanta\b/.test(normalized)) {
    return query;
  }

  return `${query}, Atlanta, GA`;
}

function fallbackResponse(query: string, errorMessage: string): GeocodeResponse {
  return {
    isFallback: true,
    sourceName: "None",
    query,
    errorMessage
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() ?? "";

  if (!query) {
    return NextResponse.json(fallbackResponse(query, "Enter a starting point to look up."), { status: 400 });
  }

  const hint = findPlaceHint(query);

  if (hint) {
    return NextResponse.json({
      isFallback: true,
      sourceName: "Peach8 place hint",
      query,
      result: {
        label: hint.label,
        latitude: hint.latitude,
        longitude: hint.longitude
      }
    } satisfies GeocodeResponse);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  const params = new URLSearchParams({
    address: atlantaBiasedQuery(query),
    benchmark: "Public_AR_Current",
    format: "json"
  });

  try {
    const response = await fetch(`https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        fallbackResponse(query, "We could not locate that text. Showing a rule-based station suggestion."),
        { status: 502 }
      );
    }

    const data = (await response.json()) as CensusGeocodeResponse;
    const match = data.result?.addressMatches?.[0];
    const latitude = match?.coordinates?.y;
    const longitude = match?.coordinates?.x;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(fallbackResponse(query, "We could not locate that text. Showing a rule-based station suggestion."));
    }

    return NextResponse.json({
      isFallback: false,
      sourceName: "U.S. Census Geocoder",
      query,
      result: {
        label: match?.matchedAddress ?? query,
        latitude,
        longitude
      }
    } satisfies GeocodeResponse);
  } catch {
    return NextResponse.json(
      fallbackResponse(query, "Geocoding is temporarily unavailable. Showing a rule-based station suggestion."),
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
