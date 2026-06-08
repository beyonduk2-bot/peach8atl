import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { HeaderWeather } from "@/components/HeaderWeather";
import { ThemeToggle } from "@/components/ThemeToggle";

function Peach8Logo() {
  return (
    <span className="block min-w-0" aria-hidden="true">
      <span className="block text-[1.34rem] font-bold leading-none text-[#f0f6fc]">Peach8 ATL</span>
      <span className="mt-1 block text-[0.68rem] font-bold leading-none text-[#8b949e]">
        No car drama. Just rail.
      </span>
    </span>
  );
}

export function AppHeader() {
  return (
    <header className="mx-auto flex w-full items-center justify-between gap-2 px-4 pb-3 pt-3">
      <Link aria-label="Peach8 ATL home" className="focus-ring min-w-0 flex-1 rounded-2xl text-left" href="/">
        <Peach8Logo />
      </Link>
      <div className="flex shrink-0 items-center gap-2">
        <HeaderWeather />
        <ThemeToggle />
        <Link
          aria-label="About Peach8 ATL"
          className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-[#161b27] text-[#f0f6fc] shadow-sm active:bg-[#211c16]"
          href="/about"
        >
          <MoreHorizontal aria-hidden="true" size={21} />
        </Link>
      </div>
    </header>
  );
}
