"use client";

import { ArrowRight, LocateFixed } from "lucide-react";

type StationFinderCardProps = {
  inputValue: string;
  status: "idle" | "loading" | "ready" | "denied" | "error";
  message?: string;
  onUseLocation: () => void;
  onSubmitText: () => void;
  onInputChange: (value: string) => void;
};

export function StationFinderCard({
  inputValue,
  status,
  message,
  onUseLocation,
  onSubmitText,
  onInputChange
}: StationFinderCardProps) {
  const isLoading = status === "loading";

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-5 shadow-sm">
      <h1 className="text-[1.9rem] font-bold leading-[1.08] tracking-tight text-[#f0f6fc]">
        Find your MARTA station
      </h1>
      <p className="mt-2 text-[0.95rem] font-medium leading-6 text-[#8b949e]">
        Tell us where you&apos;re starting from. We&apos;ll pick the closest rail station and keep an eye on the next
        trains for you.
      </p>

      <button
        className="focus-ring mt-5 flex min-h-[3.4rem] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#ffb347] px-5 py-3.5 text-base font-bold text-[#0d1117] transition active:scale-[0.99]"
        disabled={isLoading}
        type="button"
        onClick={onUseLocation}
      >
        <LocateFixed aria-hidden="true" size={20} />
        {isLoading ? "Looking around…" : "Use my location"}
      </button>

      <div aria-hidden="true" className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-semibold text-[#8b949e]">or type a place</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (inputValue.trim()) onSubmitText();
        }}
      >
        <input
          aria-label="Where are you starting from?"
          className="focus-ring min-h-[3.25rem] w-full flex-1 rounded-2xl border border-white/10 bg-[#0d1117] px-4 py-3 text-[0.95rem] font-medium text-[#f0f6fc] placeholder:text-[#8b949e]"
          inputMode="text"
          maxLength={120}
          placeholder="Hotel, address, or neighborhood"
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
        />
        <button
          aria-label="Find my station"
          className="focus-ring grid min-h-[3.25rem] w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#211c16] text-[#ffb347] transition active:scale-95 disabled:opacity-50"
          disabled={!inputValue.trim() || isLoading}
          type="submit"
        >
          <ArrowRight aria-hidden="true" size={20} />
        </button>
      </form>

      {message && status !== "ready" ? (
        <p className="mt-4 rounded-2xl bg-[#211c16] p-3 text-sm font-semibold leading-5 text-[#ffb347]">{message}</p>
      ) : null}

      <p className="mt-4 text-xs font-medium leading-5 text-[#8b949e]">
        Your location stays on your phone for this session — nothing gets saved.
      </p>
    </section>
  );
}
