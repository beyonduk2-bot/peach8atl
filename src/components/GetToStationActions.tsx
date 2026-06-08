import { StationAppButtons } from "@/components/StationAppButtons";
import type { Station } from "@/types";

type GetToStationActionsProps = {
  origin?: string;
  station: Station;
};

export function GetToStationActions({ origin, station }: GetToStationActionsProps) {
  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.78rem] font-bold tracking-[0.03em] text-[#ffb347]">First leg</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#8b949e]">
            Getting to {station.name} Station first? Maps, walking, or a rideshare — your call.
          </p>
        </div>
      </div>
      <StationAppButtons station={station} origin={origin} />
    </section>
  );
}
