"use client";

import { useMemo, useState } from "react";
import { LiveTrainsBoard } from "@/components/LiveTrainsBoard";
import { RailPathLive, type RailPathMode } from "@/components/RailPathLive";
import {
  nextHomewardArrival,
  nextStadiumArrival,
  SEC_DISTRICT_DISPLAY_NAME,
  SEC_DISTRICT_FEED_NAME
} from "@/lib/arrivals";
import { getMartaRoute } from "@/lib/martaRouting";
import { useRailArrivals } from "@/lib/useRailArrivals";
import type { Station } from "@/types";

type StationLiveSectionProps = {
  station: Station;
};

// One fetch feeds both the arrivals board and the rail path strip. In
// heading-back mode the boarding point flips to SEC District by the stadium.
export function StationLiveSection({ station }: StationLiveSectionProps) {
  const [mode, setMode] = useState<RailPathMode>("toStadium");
  const headingBack = mode === "headingBack";
  const feedStation = headingBack ? SEC_DISTRICT_FEED_NAME : station.name;
  const { status, arrivals, isMock } = useRailArrivals(feedStation);
  const route = useMemo(() => getMartaRoute(station), [station]);
  const highlightArrival = useMemo(
    () => (headingBack ? nextHomewardArrival(arrivals, station) : nextStadiumArrival(arrivals, station, route)),
    [arrivals, headingBack, station, route]
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-[#161b27] p-1 shadow-sm" role="tablist">
        <button
          aria-selected={!headingBack}
          className={`focus-ring min-h-11 rounded-full text-sm font-bold transition ${
            !headingBack ? "bg-[#ffb347] text-[#0d1117]" : "text-[#8b949e] active:bg-white/10"
          }`}
          role="tab"
          type="button"
          onClick={() => setMode("toStadium")}
        >
          To the stadium
        </button>
        <button
          aria-selected={headingBack}
          className={`focus-ring min-h-11 rounded-full text-sm font-bold transition ${
            headingBack ? "bg-[#ffb347] text-[#0d1117]" : "text-[#8b949e] active:bg-white/10"
          }`}
          role="tab"
          type="button"
          onClick={() => setMode("headingBack")}
        >
          Heading back
        </button>
      </div>

      <LiveTrainsBoard
        arrivals={arrivals}
        highlightArrival={highlightArrival}
        highlightTag={headingBack ? "Your way back" : "⚽ Stadium-bound"}
        isMock={isMock}
        stationLabel={headingBack ? SEC_DISTRICT_DISPLAY_NAME : station.name}
        status={status}
        subtitle={
          headingBack
            ? "At SEC District, by the stadium — the highlighted one heads your way."
            : `At ${station.name} — the highlighted one takes you to the match.`
        }
      />
      <RailPathLive
        isLive={!isMock && status === "ready"}
        mode={mode}
        nextArrival={highlightArrival}
        route={route}
        station={station}
      />
    </>
  );
}
