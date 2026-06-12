"use client";

import { useEffect, useState } from "react";
import type { RailArrival, RailArrivalsResponse } from "@/types";

export type RailArrivalsStatus = "idle" | "loading" | "ready" | "error";

export type RailArrivalsState = {
  status: RailArrivalsStatus;
  arrivals: RailArrival[];
  isMock: boolean;
};

const REFRESH_MS = 30_000;
const REQUEST_TIMEOUT_MS = 5_000;

function initialState(stationName?: string): RailArrivalsState {
  return {
    status: stationName ? "loading" : "idle",
    arrivals: [],
    isMock: true
  };
}

export function useRailArrivals(stationName?: string): RailArrivalsState {
  const [state, setState] = useState<RailArrivalsState>(() => initialState(stationName));
  const [trackedStation, setTrackedStation] = useState(stationName);

  // Reset during render when the station changes, so stale arrivals never flash.
  if (trackedStation !== stationName) {
    setTrackedStation(stationName);
    setState(initialState(stationName));
  }

  useEffect(() => {
    if (!stationName) {
      return;
    }

    let active = true;
    let controller: AbortController | undefined;

    async function load() {
      controller?.abort();
      const currentController = new AbortController();
      controller = currentController;

      try {
        const params = new URLSearchParams({ station: stationName ?? "" });
        const timeout = window.setTimeout(() => currentController.abort(), REQUEST_TIMEOUT_MS);
        const response = await fetch(`/api/rail-arrivals?${params.toString()}`, {
          signal: currentController.signal
        }).finally(() => window.clearTimeout(timeout));

        if (!response.ok) {
          throw new Error("Unable to load rail arrivals");
        }

        const data = (await response.json()) as RailArrivalsResponse;
        if (!active) return;

        setState({ status: "ready", arrivals: data.arrivals, isMock: data.isMock });
      } catch {
        if (!currentController.signal.aborted && active) {
          setState({ status: "error", arrivals: [], isMock: true });
        }
      }
    }

    void load();
    const intervalId = window.setInterval(() => void load(), REFRESH_MS);

    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(intervalId);
    };
  }, [stationName]);

  return state;
}
