import type { Metadata } from "next";
import { UsefulLinks } from "@/components/UsefulLinks";

export const metadata: Metadata = {
  title: "Links | Peach8 ATL"
};

export default function SourcesPage() {
  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <section className="mb-5 rounded-[1.6rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
        <p className="text-[0.78rem] font-bold tracking-[0.03em] text-[#ffb347]">Links</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-[#f0f6fc]">The official tabs, already warmed up.</h1>
        <p className="mt-2 text-sm font-semibold leading-5 text-[#8b949e]">
          Peach8 gets you oriented. These links get the final word on routes, alerts, parking, and stadium rules.
        </p>
      </section>

      <UsefulLinks />
    </main>
  );
}
