import { StationAppButtons } from "@/components/StationAppButtons";
import type { Station } from "@/types";

type GetToStationActionsProps = {
  origin?: string;
  station: Station;
};

export function GetToStationActions({ origin, station }: GetToStationActionsProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
      <h2 className="text-lg font-bold leading-tight text-[#f0f6fc]">How do I get there?</h2>
      <p className="mb-3 mt-1 text-sm font-medium leading-5 text-[#8b949e]">
        Walk it, or hand the trip to {station.name} over to your favorite app.
      </p>
      <StationAppButtons station={station} origin={origin} />
    </section>
  );
}
