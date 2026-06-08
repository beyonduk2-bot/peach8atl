import { MartaMapSvgClone } from "@/components/MartaMapSvgClone";

type MartaRailMapCardProps = {
  startStationId?: string;
};

export function MartaRailMapCard({ startStationId }: MartaRailMapCardProps) {
  return (
    <section aria-label="Rail map" className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-4 shadow-sm" id="full-rail-map">
      <div className="mb-3">
        <h2 className="text-base font-black text-[#f0f6fc]">Rail Map</h2>
        <p className="mt-1 text-sm font-bold leading-5 text-[#8b949e]">Route preview from your station to SEC District.</p>
      </div>

      <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#08101a] shadow-inner">
        <div className="aspect-[1086/1448] w-full">
          <MartaMapSvgClone startStationId={startStationId} />
        </div>
      </div>
    </section>
  );
}
