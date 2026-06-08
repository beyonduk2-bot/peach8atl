import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Matchday Guide | Peach8 ATL"
};

export default function CityGuidePage() {
  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <section className="rounded-[2rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
        <p className="flex items-center gap-2 text-sm font-bold tracking-[0.03em] text-[#ffb347]">
          <Info aria-hidden="true" size={16} />
          V1 guide
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-[#f0f6fc]">Peach8 does one thing well.</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#8b949e]">
          For now, it&apos;s all about MARTA rail, matchday basics, and the official links worth bookmarking.
        </p>
        <div className="mt-5 grid gap-2">
          <Link
            className="focus-ring flex min-h-12 items-center justify-between rounded-2xl bg-[#ffb347] px-4 font-black text-[#0d1117]"
            href="/tips"
          >
            Open Tips
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <Link
            className="focus-ring flex min-h-12 items-center justify-between rounded-2xl bg-[#0d1117] px-4 font-black text-[#f0f6fc]"
            href="/sources"
          >
            Open Links
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
