import { BeforeYouGoAccordion } from "@/components/BeforeYouGoAccordion";
import { GetToStationActions } from "@/components/GetToStationActions";
import { MartaRailMapCard } from "@/components/MartaRailMapCard";
import { NextTrainHero } from "@/components/NextTrainHero";
import { OfficialCheckCard } from "@/components/OfficialCheckCard";
import { generatePlan } from "@/data/recommendationRules";

type PlanPageProps = {
  searchParams: Promise<{
    match?: string;
    stationId?: string;
  }>;
};

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const params = await searchParams;
  const plan = generatePlan({
    matchId: params.match ?? "",
    destination: "stadium",
    startingType: "near-rail",
    areaInput: "",
    stationId: params.stationId
  });

  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <div className="space-y-3">
        <NextTrainHero station={plan.recommendedStation} />
        <MartaRailMapCard startStationId={plan.recommendedStation.id} />
        <GetToStationActions station={plan.recommendedStation} />
        <OfficialCheckCard />
        <BeforeYouGoAccordion />
      </div>
    </main>
  );
}
