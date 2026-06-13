"use client";

import { ArrowRight, Search, TrainFront } from "lucide-react";

type StationFinderCardProps = {
  inputValue: string;
  status: "idle" | "loading" | "ready" | "denied" | "error";
  message?: string;
  onUseLocation: () => void;
  onSubmitText: () => void;
  onInputChange: (value: string) => void;
};

const animatedWords = ["Find", "my", "MARTA", "station", "near", "me"];
const letsGoLetters = "LET'S GO".split("");

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
    <section className="relative overflow-hidden rounded-[2.2rem] border border-[#172033]/10 bg-[linear-gradient(180deg,#fffaf2_0%,#fff6e8_56%,#f3f8ff_100%)] p-5 text-[#172033] shadow-[0_24px_80px_rgba(148,107,65,.16)]">
      <style>{`
        @keyframes finderWordRise {
          0% { opacity: 0; transform: translateY(14px); filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes goLetterLift {
          0%, 100% { transform: translateY(0) scale(1); opacity: .72; }
          38% { transform: translateY(-4px) scale(1.045); opacity: 1; }
          62% { transform: translateY(1px) scale(.99); opacity: .9; }
        }
        @keyframes goSoftSweep {
          0% { transform: translateX(-130%) rotate(-8deg); opacity: 0; }
          18% { opacity: .75; }
          74% { opacity: .75; }
          100% { transform: translateX(130%) rotate(-8deg); opacity: 0; }
        }
        @keyframes goFrameBreathe {
          0%, 100% { transform: scale(1); box-shadow: 0 18px 46px rgba(28,39,64,.1), inset 0 0 0 1px rgba(23,32,51,.08); }
          50% { transform: scale(1.012); box-shadow: 0 22px 56px rgba(180,83,9,.13), inset 0 0 0 1px rgba(180,83,9,.16); }
        }
        @keyframes goDot {
          0%, 100% { transform: scale(.78); opacity: .46; }
          45% { transform: scale(1.18); opacity: .9; }
        }
        .finder-word {
          animation: finderWordRise .62s cubic-bezier(.2,.9,.2,1) both;
        }
        .go-letter {
          animation: goLetterLift 2.15s ease-in-out infinite;
        }
      `}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.2rem]">
        <div className="absolute bottom-24 left-[-5rem] h-44 w-44 rounded-full bg-[#4a9eff]/10 blur-3xl" />
        <div className="absolute right-[-4rem] top-20 h-52 w-52 rounded-full bg-[#c77a32]/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <h1 className="flex flex-wrap gap-x-2 gap-y-1 text-[2.28rem] font-black leading-[.98] tracking-tight text-[#172033]">
          {animatedWords.map((word, index) => (
            <span className="finder-word" key={word} style={{ animationDelay: `${index * 90}ms` }}>
              {word}
            </span>
          ))}
        </h1>
        <p className="mt-4 max-w-[18rem] text-[0.95rem] font-semibold leading-6 text-[#667085]">
          Share your location or type a place. Peach8 turns it into the right rail starting point.
        </p>
      </div>

      <button
        className="focus-ring relative z-10 mx-auto mt-28 flex w-full max-w-[318px] items-center justify-center gap-3 overflow-hidden rounded-full border border-[#172033]/10 bg-white/72 px-5 py-4 text-[#172033] backdrop-blur transition active:scale-[.985]"
        disabled={isLoading}
        style={{ animation: "goFrameBreathe 2.8s ease-in-out infinite" }}
        type="button"
        onClick={onUseLocation}
      >
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent)]" style={{ animation: "goSoftSweep 2.6s ease-in-out infinite" }} />
        <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#172033] shadow-[0_8px_18px_rgba(23,32,51,.12)] ring-1 ring-[#172033]/10">
          <TrainFront aria-hidden="true" size={18} />
        </span>
        <span className="relative flex items-center justify-center gap-[0.08em] text-[1.42rem] font-black uppercase leading-none tracking-[0.08em]">
          {(isLoading ? "FINDING" : "LET'S GO").split("").map((letter, index) => (
            <span
              className={letter === " " ? "w-2.5" : "go-letter inline-block"}
              key={`${letter}-${index}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
        <span aria-hidden="true" className="relative flex shrink-0 items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e5484d]" style={{ animation: "goDot 1.5s ease-in-out infinite" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-[#d29922]" style={{ animation: "goDot 1.5s ease-in-out infinite .16s" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-[#15803d]" style={{ animation: "goDot 1.5s ease-in-out infinite .32s" }} />
          <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" style={{ animation: "goDot 1.5s ease-in-out infinite .48s" }} />
        </span>
      </button>

      <form
        className="relative z-10 mt-28 rounded-[1.35rem] border border-[#172033]/10 bg-white/70 p-2 shadow-[0_14px_34px_rgba(23,32,51,.08)] backdrop-blur"
        onSubmit={(event) => {
          event.preventDefault();
          if (inputValue.trim()) onSubmitText();
        }}
      >
        <div className="flex items-center gap-2">
          <Search aria-hidden="true" className="ml-2 shrink-0 text-[#667085]" size={18} />
          <input
            aria-label="Where are you starting from?"
            className="min-h-[3.1rem] min-w-0 flex-1 bg-transparent text-[0.95rem] font-bold text-[#172033] outline-none placeholder:text-[#667085]/75"
            inputMode="text"
            maxLength={120}
            placeholder="Hotel, address, or neighborhood"
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
          />
          <button
            aria-label="Find my station"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#172033] text-white transition active:scale-95 disabled:opacity-40"
            disabled={!inputValue.trim() || isLoading}
            type="submit"
          >
            <ArrowRight aria-hidden="true" size={19} />
          </button>
        </div>
      </form>

      <div className="relative z-10 mt-5 min-h-[5.4rem] rounded-[1.35rem] border border-[#172033]/10 bg-white/54 p-4 shadow-[0_12px_30px_rgba(23,32,51,.06)]">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#667085]">How it works</p>
        <p className="mt-2 text-[0.95rem] font-semibold leading-5 text-[#667085]">
          {message && status !== "ready" ? message : "Location stays on your phone for this session."}
        </p>
      </div>
    </section>
  );
}
