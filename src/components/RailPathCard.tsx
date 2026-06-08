import { getMartaRoute } from "@/lib/martaRouting";
import type { Station } from "@/types";

type RailPathCardProps = {
  station: Station;
};

type RouteNodeProps = {
  markerClassName: string;
  role: string;
  title: string;
  subtitle: string;
};

function shortStationName(name: string) {
  return name.replace(/ Station$/, "");
}

function routeLineLabel(station: Station) {
  return `${station.line.join("/")} Line`;
}

function lineMarkerColor(station: Station) {
  if (station.line.includes("Gold")) return "bg-[#ffb347]";
  if (station.line.includes("Red")) return "bg-[#ff4d4d]";
  if (station.line.includes("Blue")) return "bg-[#4a9eff]";
  if (station.line.includes("Green")) return "bg-[#3fb950]";
  return "bg-[#8b949e]";
}

function stopsBefore(routeStops: string[], startName: string, targetName: string) {
  const startIndex = routeStops.indexOf(startName);
  const targetIndex = routeStops.indexOf(targetName);

  if (startIndex < 0 || targetIndex < 0 || targetIndex <= startIndex) {
    return 0;
  }

  return Math.max(0, targetIndex - startIndex - 1);
}

function stopLabel(count: number) {
  if (count <= 0) return "Next stop";
  if (count === 1) return "1 stop away";
  return `${count} stops away`;
}

function RouteNode({ markerClassName, role, subtitle, title }: RouteNodeProps) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-2.5">
      <div className="flex justify-center">
        <span
          className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-[#0d1117] shadow-sm ${markerClassName}`}
          aria-hidden="true"
        />
      </div>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#8b949e]">{role}</p>
        <p className="mt-0.5 text-[1rem] font-black leading-tight text-[#f0f6fc]">{title}</p>
        <p className="mt-0.5 text-[0.82rem] font-semibold leading-5 text-[#8b949e]">{subtitle}</p>
      </div>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-2.5 py-1">
      <div className="flex justify-center">
        <span className="block h-5 w-1 rounded-full bg-white/15" aria-hidden="true" />
      </div>
      <div className="flex items-center">
        <span className="rounded-full bg-[#0d1117] px-2.5 py-0.5 text-[0.72rem] font-black text-[#8b949e]">{label}</span>
      </div>
    </div>
  );
}

export function RailPathCard({ station }: RailPathCardProps) {
  const route = getMartaRoute(station);
  const exitName = shortStationName(route.exitStation);
  const transferName = route.transferStation;
  const firstTarget = transferName ?? route.exitStation;
  const firstStopCount = stopsBefore(route.stops, station.name, firstTarget);
  const transferStopCount = transferName ? stopsBefore(route.stops, transferName, route.exitStation) : 0;
  const summary = transferName ? `${station.name} → ${transferName} → ${exitName}` : `${station.name} → ${exitName}`;
  const meta = `~${route.estimatedRideMinutes} min on rail · ${transferName ? "1 quick switch" : "no switch needed"}`;

  return (
    <section className="rounded-[1.55rem] border border-white/10 bg-[#161b27] p-4 text-[#f0f6fc] shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffb347]">Rail game plan</p>
          <h2 className="mt-1 text-[1.35rem] font-black leading-tight text-[#f0f6fc]">{summary}</h2>
          <p className="mt-1 text-sm font-bold text-[#8b949e]">{meta}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-[#0d1117] p-3">
        <RouteNode
          markerClassName={lineMarkerColor(station)}
          role="Roll out"
          title={station.name}
          subtitle={`Board ${routeLineLabel(station)}`}
        />

        <Connector label={stopLabel(firstStopCount)} />

        {transferName ? (
          <>
            <RouteNode
              markerClassName="border-[#f0f6fc] bg-[#0d1117]"
              role="Quick switch"
              title={transferName}
              subtitle={`Switch toward ${exitName}`}
            />
            <Connector label={transferStopCount <= 0 ? "1 stop away" : stopLabel(transferStopCount)} />
          </>
        ) : null}

        <RouteNode
          markerClassName="bg-[#ff4d4d]"
          role="Hop off"
          title={exitName}
          subtitle="Follow event signs out of the station"
        />

        <Connector label="Short walk in" />

        <RouteNode
          markerClassName="bg-[#ffb347]"
          role="Final stroll"
          title="Stadium area"
          subtitle="Stroll into the stadium area"
        />
      </div>

    </section>
  );
}
