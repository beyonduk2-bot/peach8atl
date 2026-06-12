import { BeforeYouGoAccordion } from "@/components/BeforeYouGoAccordion";
import { MatchBoard } from "@/components/MatchBoard";
import { OfficialCheckCard } from "@/components/OfficialCheckCard";

export const metadata = {
  title: "Peach8 ATL · Atlanta matchdays"
};

export default function MatchesPage() {
  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <div className="space-y-3 pb-2">
        <div className="px-1">
          <h1 className="text-[1.9rem] font-bold leading-[1.08] tracking-tight text-[#f0f6fc]">Atlanta matchdays</h1>
          <p className="mt-2 text-[0.95rem] font-medium leading-6 text-[#8b949e]">
            Eight matches downtown this summer. Pick one to see the kickoff countdown — all times are Eastern.
          </p>
        </div>

        <MatchBoard />
        <BeforeYouGoAccordion />
        <OfficialCheckCard />
      </div>
    </main>
  );
}
