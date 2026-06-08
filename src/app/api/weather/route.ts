import { NextRequest, NextResponse } from "next/server";
import type { WeatherForecast, WeatherResponse } from "@/types";

const ATLANTA_STADIUM_AREA = {
  latitude: 33.7554,
  longitude: -84.4008,
  label: "Atlanta stadium area"
};
const WEATHER_CACHE_TTL_MS = 15 * 60_000;
const WEATHER_REQUEST_TIMEOUT_MS = 3_500;
const NWS_USER_AGENT = "Peach8ATL/1.0 (https://peach8atl.vercel.app)";

type NwsPointResponse = {
  properties?: {
    forecastHourly?: string;
  };
};

type NwsHourlyPeriod = {
  startTime?: string;
  endTime?: string;
  temperature?: number;
  temperatureUnit?: string;
  shortForecast?: string;
  windSpeed?: string;
  probabilityOfPrecipitation?: {
    value?: number | null;
  };
};

type NwsHourlyResponse = {
  properties?: {
    periods?: NwsHourlyPeriod[];
  };
};

type WeatherCache = {
  expiresAt: number;
  response: WeatherResponse;
};

type HourlyPeriodsCache = {
  expiresAt: number;
  periods: NwsHourlyPeriod[];
};

let hourlyForecastUrlCache: string | null = null;
let hourlyPeriodsCache: HourlyPeriodsCache | null = null;
const weatherCache = new Map<string, WeatherCache>();

function parseTargetTime(request: NextRequest) {
  const matchDate = request.nextUrl.searchParams.get("matchDate");
  const kickoffTime = request.nextUrl.searchParams.get("kickoffTime");

  if (!matchDate || !kickoffTime) {
    return undefined;
  }

  const parsed = new Date(`${matchDate}T${kickoffTime}:00-04:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEATHER_REQUEST_TIMEOUT_MS);

  const response = await fetch(url, {
    headers: {
      Accept: "application/geo+json, application/json",
      "User-Agent": NWS_USER_AGENT
    },
    next: { revalidate: 900 },
    signal: controller.signal
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function getHourlyForecastUrl() {
  if (hourlyForecastUrlCache) {
    return hourlyForecastUrlCache;
  }

  const pointUrl = `https://api.weather.gov/points/${ATLANTA_STADIUM_AREA.latitude},${ATLANTA_STADIUM_AREA.longitude}`;
  const point = await fetchJson<NwsPointResponse>(pointUrl);
  const hourlyUrl = point.properties?.forecastHourly;

  if (!hourlyUrl) {
    throw new Error("NWS hourly forecast URL unavailable");
  }

  hourlyForecastUrlCache = hourlyUrl;
  return hourlyUrl;
}

function temperatureRange(periods: NwsHourlyPeriod[], selectedPeriod: NwsHourlyPeriod) {
  const startIndex = Math.max(0, periods.findIndex((period) => period.startTime === selectedPeriod.startTime));
  const temperatures = periods
    .slice(startIndex, startIndex + 24)
    .map((period) => period.temperature)
    .filter((temperature): temperature is number => typeof temperature === "number");

  if (!temperatures.length) {
    return {};
  }

  return {
    temperatureHigh: Math.max(...temperatures),
    temperatureLow: Math.min(...temperatures)
  };
}

function normalizeForecast(period: NwsHourlyPeriod, periods: NwsHourlyPeriod[]): WeatherForecast | undefined {
  if (!period.startTime || typeof period.temperature !== "number" || !period.shortForecast) {
    return undefined;
  }

  const range = temperatureRange(periods, period);

  return {
    startTime: period.startTime,
    temperature: period.temperature,
    ...range,
    temperatureUnit: period.temperatureUnit ?? "F",
    shortForecast: period.shortForecast,
    windSpeed: period.windSpeed ?? "Wind unavailable",
    precipitationChance:
      typeof period.probabilityOfPrecipitation?.value === "number"
        ? period.probabilityOfPrecipitation.value
        : undefined
  };
}

function periodMatchesTarget(period: NwsHourlyPeriod, targetTime: Date) {
  if (!period.startTime || !period.endTime) {
    return false;
  }

  const start = new Date(period.startTime).getTime();
  const end = new Date(period.endTime).getTime();
  const target = targetTime.getTime();

  return Number.isFinite(start) && Number.isFinite(end) && target >= start && target < end;
}

function selectForecast(periods: NwsHourlyPeriod[], targetTime?: Date) {
  if (!periods.length) {
    return {
      period: undefined,
      isMatchWindow: false
    };
  }

  if (targetTime) {
    const matchPeriod = periods.find((period) => periodMatchesTarget(period, targetTime));

    if (matchPeriod) {
      return {
        period: matchPeriod,
        isMatchWindow: true
      };
    }
  }

  return {
    period: periods[0],
    isMatchWindow: false
  };
}

function weatherCacheKey(targetTime?: Date) {
  return targetTime ? `match:${targetTime.toISOString()}` : "current";
}

async function getHourlyPeriods() {
  if (hourlyPeriodsCache && hourlyPeriodsCache.expiresAt > Date.now()) {
    return hourlyPeriodsCache.periods;
  }

  const hourlyUrl = await getHourlyForecastUrl();
  const hourly = await fetchJson<NwsHourlyResponse>(hourlyUrl);
  const periods = hourly.properties?.periods ?? [];

  hourlyPeriodsCache = {
    expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
    periods
  };

  return periods;
}

export async function GET(request: NextRequest) {
  const targetTime = parseTargetTime(request);
  const cacheKey = weatherCacheKey(targetTime);
  const cachedEntry = weatherCache.get(cacheKey);
  const cached = cachedEntry && cachedEntry.expiresAt > Date.now() ? cachedEntry.response : null;

  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const periods = await getHourlyPeriods();
    const { period, isMatchWindow } = selectForecast(periods, targetTime);
    const forecast = period ? normalizeForecast(period, periods) : undefined;

    if (!forecast) {
      throw new Error("NWS forecast period unavailable");
    }

    const response: WeatherResponse = {
      isFallback: false,
      isMatchWindow,
      locationLabel: ATLANTA_STADIUM_AREA.label,
      sourceName: "National Weather Service",
      updatedAt: new Date().toISOString(),
      forecast
    };

    weatherCache.set(cacheKey, {
      expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
      response
    });

    return NextResponse.json(response);
  } catch {
    const response: WeatherResponse = {
      isFallback: true,
      isMatchWindow: false,
      locationLabel: ATLANTA_STADIUM_AREA.label,
      sourceName: "National Weather Service",
      updatedAt: new Date().toISOString(),
      errorMessage: "Weather is temporarily unavailable. Check the forecast before leaving."
    };

    return NextResponse.json(response);
  }
}
