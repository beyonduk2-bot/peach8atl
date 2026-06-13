import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { HeaderWeather } from "@/components/HeaderWeather";

function Peach8Logo() {
  return (
    <span className="block min-w-0" aria-hidden="true">
      <span className="block text-[1.34rem] font-bold leading-none text-[var(--text-primary)]">Peach8 ATL</span>
      <span className="mt-1 block text-[0.68rem] font-bold leading-none text-[var(--text-muted)]">
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
        <Link
          aria-label="About Peach8 ATL"
          className="focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] text-[var(--text-primary)] shadow-sm active:bg-[var(--surface-warm)]"
          href="/about"
        >
          <MoreHorizontal aria-hidden="true" size={21} />
        </Link>
      </div>
    </header>
  );
}
