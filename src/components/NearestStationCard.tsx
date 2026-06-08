import type { Station } from "@/types";
import { getMartaRoute } from "@/lib/martaRouting";

type NearbyStation = {
  station: Station;
  distanceMiles?: number;
  approxWalkMinutes?: number;
};

type NearestStationCardProps = {
  options: NearbyStation[];
  selectedStation: Station;
  onSelect: (station: Station) => void;
};

function lineLabel(station: Station) {
  return `${station.line.join(" / ")} Line`;
}

function lineDot(station: Station) {
  if (station.line.includes("Red")) return "bg-[#ff4d4d]";
  if (station.line.includes("Gold")) return "bg-[#ffb347]";
  if (station.line.includes("Blue")) return "bg-[#4a9eff]";
  if (station.line.includes("Green")) return "bg-[#3fb950]";
  return "bg-[#8b949e]";
}

function directionLabel(route: ReturnType<typeof getMartaRoute>) {
  if (route.transferStation) return `toward ${route.transferStation}`;
  return route.direction.startsWith("toward") ? route.direction : `toward ${route.exitStation.replace(" Station", "")}`;
}

export function NearestStationCard({ options, selectedStation, onSelect }: NearestStationCardProps) {
  const selected = options.find((option) => option.station.id === selectedStation.id) ?? {
    station: selectedStation
  };
  const hasTwoOptions = options.length > 1;
  const route = getMartaRoute(selected.station);

  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <p className="text-[0.8rem] font-semibold leading-none text-[#3fb950]">
        {hasTwoOptions ? "Pick your launch spot" : "Your launch point"}
      </p>
      <h2 className="mt-2 text-[2rem] font-bold leading-tight text-[#f0f6fc]">{selected.station.name} Station</h2>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#0d1117] px-3 py-1.5 text-[0.95rem] font-bold text-[#f0f6fc]">
          <span className={`h-2.5 w-2.5 rounded-full ${lineDot(selected.station)}`} aria-hidden="true" />
          {lineLabel(selected.station)} · {directionLabel(route)}
        </span>
      </div>

      {hasTwoOptions ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {options.map((option) => {
            const active = option.station.id === selectedStation.id;

            return (
              <button
                className={`focus-ring min-h-16 rounded-2xl border p-3 text-left ${
                  active
                    ? "border-[#ffb347] bg-[#211c16] text-[#f0f6fc]"
                    : "border-white/10 bg-[#0d1117] text-[#8b949e]"
                }`}
                key={option.station.id}
                type="button"
                onClick={() => onSelect(option.station)}
              >
                <span className="block text-sm font-black">{option.station.name}</span>
                {typeof option.distanceMiles === "number" ? (
                  <span className="mt-1 block text-xs font-bold">{option.distanceMiles.toFixed(1)} mi from you</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
