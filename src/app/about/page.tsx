import { BriefcaseBusiness, HeartHandshake, Info, ShieldCheck, TrainFront } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Peach8 ATL"
};

const disclaimer =
  "Peach8 ATL is an unofficial, fan-made guide. It is not affiliated with or endorsed by FIFA, MARTA, Mercedes-Benz Stadium, the City of Atlanta, or any official event organizer. Always double-check official sources before you head out.";

const sections = [
  {
    icon: BriefcaseBusiness,
    title: "Why this exists",
    body: "Atlanta matchday info lives in a dozen places at once. Peach8 keeps it to one job: pick a MARTA station, see the rail move, and get to the stadium area with a lot less guessing."
  },
  {
    icon: TrainFront,
    title: "What it does",
    body: "Built for your phone. Find a nearby MARTA station, trace the rail path, check train timing, and jump straight to official sources when the details matter."
  },
  {
    icon: HeartHandshake,
    title: "Why I made it",
    body: "I made Peach8 as a fan who loves soccer and loves this city. When Atlanta fills up for matchday, getting there should feel simple, local, and a little more fun."
  },
  {
    icon: ShieldCheck,
    title: "Privacy",
    body: "Your location never leaves this browser session. Peach8 doesn't store a thing."
  }
];

export default function AboutPage() {
  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <section className="rounded-[1.6rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
        <p className="flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.03em] text-[#ffb347]">
          <Info aria-hidden="true" size={16} />
          About
        </p>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-[#f0f6fc]">A tiny rail guide for getting to the match without making it a project.</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#8b949e]">{disclaimer}</p>
      </section>

      <section className="mt-5 space-y-3">
        {sections.map(({ icon: Icon, title, body }) => (
          <article className="rounded-[1.45rem] border border-white/10 bg-[#161b27] p-4 shadow-sm" key={title}>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#211c16] text-[#ffb347]">
              <Icon aria-hidden="true" size={20} />
            </span>
            <h2 className="mt-3 text-lg font-bold text-[#f0f6fc]">{title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#8b949e]">{body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
