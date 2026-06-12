"use client";

import { homewardDirection, lineDisplayName, lineHex, SEC_DISTRICT_COORDS, waitDisplay } from "@/lib/arrivals";
import { distanceMiles } from "@/lib/distance";
import type { MartaRoute } from "@/lib/martaRouting";
import type { Coordinates, RailArrival, Station } from "@/types";

export type RailPathMode = "toStadium" | "headingBack";

type RailPathLiveProps = {
  station: Station;
  route: MartaRoute;
  mode: RailPathMode;
  nextArrival?: RailArrival;
  isLive: boolean;
};

type StripRow = {
  key: string;
  kind: "train" | "start" | "between" | "transfer" | "exit";
  title: string;
  caption?: string;
  color: string;
  connectorColor?: string;
  connectorDashed?: boolean;
};

const STADIUM_HEX = "#ffb347";

function shortName(value: string) {
  return value.replace(/ Station$/, "");
}

function trainDistanceLabel(arrival: RailArrival, target: Coordinates) {
  const miles = distanceMiles({ latitude: arrival.latitude, longitude: arrival.longitude }, target);

  // Hide implausible or zero-ish values (mock data reuses station coordinates).
  if (!Number.isFinite(miles) || miles < 0.15 || miles > 40) return undefined;
  return ` · ${miles.toFixed(1)} mi away`;
}

function trainRow(target: Coordinates, connectorColor: string, nextArrival: RailArrival, isLive?: boolean): StripRow {
  const wait = waitDisplay(nextArrival);
  const waitText = wait.unit ? `${wait.value} ${wait.unit}` : "pulling in now";
  const miles = isLive ? trainDistanceLabel(nextArrival, target) : undefined;

  return {
    key: "train",
    kind: "train",
    title: `Next train · ${waitText}`,
    caption: `${lineDisplayName(nextArrival.line)} Line to ${nextArrival.destination}${miles ?? ""}`,
    color: lineHex(nextArrival.line),
    connectorColor,
    connectorDashed: true
  };
}

function betweenRow(route: MartaRoute, color: string, connectorColor: string): StripRow | undefined {
  const exitIndex = route.stops.indexOf(route.exitStation);
  const transferIndex = route.transferStation ? route.stops.indexOf(route.transferStation) : -1;
  const betweenCount = Math.max(0, (route.transferStation ? transferIndex : exitIndex) - 1);

  if (betweenCount === 0) return undefined;

  return {
    key: "between",
    kind: "between",
    title: `${betweenCount} ${betweenCount === 1 ? "stop" : "stops"}`,
    caption: `about ${route.estimatedRideMinutes} min on the train`,
    color,
    connectorColor
  };
}

function buildStadiumRows(station: Station, route: MartaRoute, nextArrival?: RailArrival, isLive?: boolean): StripRow[] {
  const startColor = lineHex(route.line);
  const finalLegColor = route.transferStation ? lineHex("blue") : startColor;
  const rows: StripRow[] = [];

  if (nextArrival) {
    rows.push(trainRow(station, startColor, nextArrival, isLive));
  }

  rows.push({
    key: "start",
    kind: "start",
    title: station.name,
    caption: `Board here — ride ${route.direction}`,
    color: startColor,
    connectorColor: startColor
  });

  const between = betweenRow(route, startColor, route.transferStation ? startColor : finalLegColor);
  if (between) rows.push(between);

  if (route.transferStation) {
    rows.push({
      key: "transfer",
      kind: "transfer",
      title: route.transferStation,
      caption: "Switch once — any train toward the stadium, it's one stop",
      color: finalLegColor,
      connectorColor: finalLegColor
    });
  }

  rows.push({
    key: "exit",
    kind: "exit",
    title: shortName(route.exitStation),
    caption: "Hop off — short walk to the gates",
    color: STADIUM_HEX
  });

  return rows;
}

function buildReturnRows(station: Station, route: MartaRoute, nextArrival?: RailArrival, isLive?: boolean): StripRow[] {
  const homeColor = lineHex(route.line);
  const stadiumLegColor = route.transferStation ? lineHex("blue") : homeColor;
  const ridesEast = homewardDirection(station) === "E";
  const returnLegDirection = station.directionGroup === "south" ? "southbound" : "northbound";
  const rows: StripRow[] = [];

  if (nextArrival) {
    rows.push(trainRow(SEC_DISTRICT_COORDS, stadiumLegColor, nextArrival, isLive));
  }

  rows.push({
    key: "start",
    kind: "start",
    title: shortName(route.exitStation),
    caption: route.transferStation
      ? "Board here — any eastbound train works, it's one stop to Five Points"
      : `Board here — ride ${ridesEast ? "eastbound" : "westbound"} toward ${station.name}`,
    color: STADIUM_HEX,
    connectorColor: stadiumLegColor
  });

  if (route.transferStation) {
    rows.push({
      key: "transfer",
      kind: "transfer",
      title: route.transferStation,
      caption: `Switch to the ${lineDisplayName(route.line)} Line, ${returnLegDirection} toward ${station.name}`,
      color: homeColor,
      connectorColor: homeColor
    });
  }

  const between = betweenRow(route, homeColor, homeColor);
  if (between) rows.push(between);

  rows.push({
    key: "exit",
    kind: "exit",
    title: station.name,
    caption: "Hop off — you're back where you started",
    color: homeColor
  });

  return rows;
}

function Marker({ row }: { row: StripRow }) {
  if (row.kind === "train") {
    return (
      <span className="relative grid h-6 w-6 place-items-center">
        <span
          aria-hidden="true"
          className="train-pulse absolute h-5 w-5 rounded-full opacity-30"
          style={{ backgroundColor: row.color }}
        />
        <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ backgroundColor: row.color }} />
      </span>
    );
  }

  if (row.color === STADIUM_HEX && (row.kind === "exit" || row.kind === "start")) {
    return (
      <span aria-hidden="true" className="grid h-6 w-6 place-items-center text-base leading-none">
        ⚽
      </span>
    );
  }

  if (row.kind === "between") {
    return (
      <span aria-hidden="true" className="grid h-6 w-6 place-items-center">
        <span className="h-1.5 w-1.5 rounded-full opacity-60" style={{ backgroundColor: row.color }} />
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="grid h-6 w-6 place-items-center">
      <span
        className="h-3.5 w-3.5 rounded-full border-2 bg-[#161b27]"
        style={{ borderColor: row.color }}
      />
    </span>
  );
}

export function RailPathLive({ station, route, mode, nextArrival, isLive }: RailPathLiveProps) {
  const headingBack = mode === "headingBack";
  const rows = headingBack
    ? buildReturnRows(station, route, nextArrival, isLive)
    : buildStadiumRows(station, route, nextArrival, isLive);

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold leading-tight text-[#f0f6fc]">
          {headingBack ? `Your ride back to ${station.name}` : "Your ride to the stadium"}
        </h2>
        <span className="shrink-0 rounded-full bg-[#0d1117] px-3 py-1 text-[0.7rem] font-bold text-[#8b949e]">
          {route.transferStation ? "1 easy switch" : "Direct"}
        </span>
      </div>

      <div className="mt-4">
        {rows.map((row, index) => {
          const isLast = index === rows.length - 1;
          const emphasized = row.kind === "start" || row.kind === "transfer" || row.kind === "exit";

          return (
            <div className="flex gap-3" key={row.key}>
              <div className="flex w-6 flex-col items-center">
                <Marker row={row} />
                {!isLast ? (
                  row.connectorDashed ? (
                    <span
                      aria-hidden="true"
                      className="w-[3px] flex-1 rounded-full opacity-50"
                      style={{
                        minHeight: "1.1rem",
                        backgroundImage: `repeating-linear-gradient(${row.connectorColor} 0 4px, transparent 4px 9px)`
                      }}
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="w-[3px] flex-1 rounded-full"
                      style={{ minHeight: "1.1rem", backgroundColor: row.connectorColor }}
                    />
                  )
                ) : null}
              </div>
              <div className={isLast ? "pb-0" : "pb-5"}>
                <p
                  className={
                    emphasized
                      ? "text-[1.05rem] font-bold leading-tight text-[#f0f6fc]"
                      : "text-[0.85rem] font-semibold leading-tight text-[#8b949e]"
                  }
                >
                  {row.title}
                </p>
                {row.caption ? (
                  <p className="mt-0.5 text-[0.8rem] font-medium leading-5 text-[#8b949e]">{row.caption}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 border-t border-white/10 pt-3 text-xs font-medium leading-5 text-[#8b949e]">
        {headingBack
          ? `Platform packed after the final whistle? The short walk to ${shortName(route.alternateExitStation)} usually means an easier board.`
          : `Crowded after the final whistle? ${shortName(route.alternateExitStation)} is one stop past and usually calmer.`}
      </p>
    </section>
  );
}
