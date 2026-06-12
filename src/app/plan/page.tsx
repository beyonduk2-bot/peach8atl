import { BeforeYouGoAccordion } from "@/components/BeforeYouGoAccordion";
import { GetToStationActions } from "@/components/GetToStationActions";
import { MartaRailMapCard } from "@/components/MartaRailMapCard";
import { OfficialCheckCard } from "@/components/OfficialCheckCard";
import { StationLiveSection } from "@/components/StationLiveSection";
import { StationResultCard } from "@/components/StationResultCard";
import { stations } from "@/data/stations";

type PlanPageProps = {
  searchParams: Promise<{
    match?: string;
    stationId?: string;
  }>;
};

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;
  const station = stations.find((candidate) => candidate.id === params.stationId) ?? stations.find((candidate) => candidate.id === "midtown")!;

  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <div className="space-y-3">
        <StationResultCard station={station} />
        <GetToStationActions station={station} />
        <StationLiveSection station={station} />
        <MartaRailMapCard startStationId={station.id} />
        <OfficialCheckCard />
        <BeforeYouGoAccordion />
      </div>
    </main>
  );
}
