import { MartaMapSvgClone } from "@/components/MartaMapSvgClone";

type MartaRailMapCardProps = {
  startStationId?: string;
};

export function MartaRailMapCard({ startStationId }: MartaRailMapCardProps) {
  return (
    <details className="group rounded-[1.75rem] border border-white/10 bg-[#161b27] p-5 shadow-sm" id="full-rail-map">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
        <span>
          <span className="block text-lg font-bold leading-tight text-[#f0f6fc]">Full rail map</span>
          <span className="mt-1 block text-sm font-medium leading-5 text-[#8b949e]">
            The whole system at a glance, with your route lit up.
          </span>
        </span>
        <span className="shrink-0 text-sm font-semibold text-[#ffb347] group-open:hidden">Show</span>
        <span className="hidden shrink-0 text-sm font-semibold text-[#ffb347] group-open:inline">Hide</span>
      </summary>

      <div className="mx-auto mt-4 w-full max-w-[520px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#08101a] shadow-inner">
        <div className="aspect-[1086/1448] w-full">
          <MartaMapSvgClone startStationId={startStationId} />
        </div>
      </div>
    </details>
  );
}
