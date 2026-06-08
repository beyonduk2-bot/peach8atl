import { LocateFixed } from "lucide-react";

type StationFinderCardProps = {
  inputValue: string;
  status: "idle" | "loading" | "ready" | "denied" | "error";
  message?: string;
  onFindStation: () => void;
  onInputChange: (value: string) => void;
};

export function StationFinderCard({
  inputValue,
  status,
  message,
  onFindStation,
  onInputChange
}: StationFinderCardProps) {
  return (
    <section className="rounded-[1.45rem] border border-white/10 bg-[#161b27] p-4 shadow-sm">
      <p className="text-[0.78rem] font-bold tracking-[0.03em] text-[#ffb347]">Nearest MARTA station</p>
      <h2 className="mt-1 text-[1.35rem] font-bold leading-tight text-[#f0f6fc]">Start with the station near you.</h2>
      <p className="mt-1.5 text-[0.92rem] font-semibold leading-5 text-[#8b949e]">
        Share your location or type where you are. Peach8 will point you to a nearby MARTA station first.
      </p>
      <button
        className="focus-ring mt-3 flex min-h-[3.25rem] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#ffb347] px-5 py-3.5 text-base font-bold text-[#0d1117] shadow-lg shadow-black/20 transition active:bg-[#ff8c69]"
        type="button"
        onClick={onFindStation}
      >
        <LocateFixed aria-hidden="true" size={20} />
        {status === "loading" ? "Finding nearby MARTA…" : "Find nearby MARTA station"}
      </button>

      <label className="mt-3 block">
        <span className="mb-1.5 block text-xs font-bold text-[#8b949e]">Where are you now?</span>
        <input
          className="focus-ring min-h-12 w-full rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-[0.95rem] font-semibold text-[#f0f6fc] placeholder:text-[#8b949e]"
          inputMode="text"
          maxLength={120}
          placeholder="Hotel, address, or area"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
        />
      </label>

      {message && status !== "ready" ? (
        <p className="mt-3 rounded-2xl bg-[#211c16] p-3 text-sm font-bold leading-5 text-[#ffb347]">{message}</p>
      ) : null}
    </section>
  );
}
