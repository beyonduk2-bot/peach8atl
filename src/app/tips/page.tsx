import type { Metadata } from "next";
import { TipsGrid } from "@/components/TipsGrid";

export const metadata: Metadata = {
  title: "Tips | Peach8 ATL"
};

export default function TipsPage() {
  return (
    <main className="w-full px-4 pb-[calc(120px_+_env(safe-area-inset-bottom))]">
      <section className="mb-5 rounded-[1.6rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
        <p className="text-[0.78rem] font-bold tracking-[0.03em] text-[#ffb347]">Tips</p>
        <h1 className="mt-2 text-2xl font-bold leading-tight text-[#f0f6fc]">Small moves that save big matchday headaches.</h1>
      </section>

      <TipsGrid />
    </main>
  );
}
