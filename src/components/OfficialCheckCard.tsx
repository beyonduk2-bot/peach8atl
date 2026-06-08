import { Accessibility, CarFront, ExternalLink, ShieldCheck, TrainFront } from "lucide-react";
import { officialLinks } from "@/data/officialLinks";

type OfficialAction = {
  body: string;
  href: string;
  icon: typeof TrainFront;
  label: string;
  title: string;
};

const actions: OfficialAction[] = [
  {
    body: "Use Peach8 for the quick read, then confirm the exact trip with MARTA.",
    href: officialLinks.martaMatchPlanner,
    icon: TrainFront,
    label: "Planner",
    title: "MARTA planner"
  },
  {
    body: "Check rail alerts before you roll. Single tracking can change the whole mood.",
    href: officialLinks.martaServiceAlerts,
    icon: ShieldCheck,
    label: "Alerts",
    title: "Service status"
  },
  {
    body: "Driving part way in? Check parking, Reach zones, and first-mile options.",
    href: officialLinks.martaParking,
    icon: CarFront,
    label: "Parking",
    title: "Drive-to-rail"
  },
  {
    body: "Need help in the station? Use official tools and follow on-site wayfinding.",
    href: officialLinks.martaSeeSay,
    icon: Accessibility,
    label: "Safety",
    title: "On-site help"
  }
];

export function OfficialCheckCard() {
  return (
    <section className="rounded-[1.55rem] border border-[#ffb347]/25 bg-[#161b27] p-4 text-[#f0f6fc] shadow-sm">
      <div className="mb-3">
        <p className="text-[0.78rem] font-black uppercase tracking-[0.14em] text-[#ffb347]">Official check</p>
        <h2 className="mt-1 text-[1.35rem] font-black leading-tight">Quick plan here. Final check there.</h2>
        <p className="mt-1.5 text-sm font-bold leading-5 text-[#8b949e]">
          Peach8 keeps the matchday move simple. MARTA keeps the official details.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <a
              className="focus-ring flex min-h-[122px] flex-col rounded-[1.2rem] border border-white/10 bg-[#0d1117] p-3 shadow-sm transition active:scale-[0.98]"
              href={action.href}
              key={action.title}
              rel="noreferrer"
              target="_blank"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-[#211c16] text-[#ffb347]">
                  <Icon aria-hidden="true" size={18} />
                </span>
                <span className="inline-flex items-center gap-1 text-[0.68rem] font-black text-[#ffb347]">
                  {action.label}
                  <ExternalLink aria-hidden="true" size={12} />
                </span>
              </span>
              <span className="mt-2 text-sm font-black leading-tight">{action.title}</span>
              <span className="mt-1 text-[0.74rem] font-bold leading-4 text-[#8b949e]">{action.body}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
