import type { MartaRoute } from "@/lib/martaRouting";

type RouteAtGlanceProps = {
  route: MartaRoute;
};

export function RouteAtGlance({ route }: RouteAtGlanceProps) {
  const transferCount = route.transferStation ? 1 : 0;

  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <p className="text-[0.78rem] font-bold tracking-[0.03em] text-[#ffb347]">Route in one line</p>
      <div className="mt-3 flex items-center justify-between gap-2 rounded-[1.25rem] bg-[#0d1117] p-3 text-center">
        <p className="min-w-0 flex-1 truncate text-sm font-black text-[#f0f6fc]">{route.startLabel}</p>
        <span className="text-[#8b949e]" aria-hidden="true">→</span>
        <p className="min-w-0 flex-1 truncate text-sm font-black text-[#f0f6fc]">
          {route.transferStation ?? "Downtown"}
        </p>
        <span className="text-[#8b949e]" aria-hidden="true">→</span>
        <p className="min-w-0 flex-1 truncate text-sm font-black text-[#f0f6fc]">SEC District</p>
      </div>
      <p className="mt-3 text-sm font-black text-[#8b949e]">
        ~{route.estimatedRideMinutes} min ride · {transferCount} {transferCount === 1 ? "transfer" : "transfers"} · fare info via MARTA
      </p>
    </section>
  );
}
