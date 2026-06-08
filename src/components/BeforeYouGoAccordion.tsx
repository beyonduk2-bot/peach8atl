import { ExternalLink } from "lucide-react";
import { officialLinks } from "@/data/officialLinks";

const officialChecks = [
  {
    href: officialLinks.martaWorldCupGuide,
    label: "MARTA guide"
  },
  {
    href: officialLinks.martaOnTheGo,
    label: "MARTA app"
  },
  {
    href: officialLinks.martaSeeSay,
    label: "See & Say"
  },
  {
    href: officialLinks.martaParking,
    label: "Parking"
  }
];

export function BeforeYouGoAccordion() {
  return (
    <details className="group rounded-[1.35rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-black text-[#f0f6fc]">
        <span>Tiny sanity check</span>
        <span className="text-sm text-[#ffb347] group-open:hidden">Open</span>
        <span className="hidden text-sm text-[#ffb347] group-open:inline">Done</span>
      </summary>
      <div className="mt-3 space-y-2 text-[0.95rem] font-semibold leading-6 text-[#8b949e]">
        <p>One quick sweep before you head out: rail alerts, bag policy, weather, and street closures all love to shift at the last minute.</p>
        <p>Peach8 ATL is fan-made, so when the details disagree, official sources always get the final word.</p>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {officialChecks.map((check) => (
            <a
              className="focus-ring inline-flex min-h-10 items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#0d1117] px-3 py-2 text-xs font-black text-[#f0f6fc]"
              href={check.href}
              key={check.label}
              rel="noreferrer"
              target="_blank"
            >
              {check.label}
              <ExternalLink aria-hidden="true" className="shrink-0 text-[#ffb347]" size={13} />
            </a>
          ))}
        </div>
      </div>
    </details>
  );
}
