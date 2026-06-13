"use client";

import Link from "next/link";
import { CalendarDays, Lightbulb, LinkIcon, TrainFront } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Go", icon: TrainFront },
  { href: "/matches", label: "Matches", icon: CalendarDays },
  { href: "/tips", label: "Tips", icon: Lightbulb },
  { href: "/sources", label: "Links", icon: LinkIcon }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.65rem)] z-50 mx-auto w-[min(398px,calc(100vw-2rem))] rounded-full border border-[var(--border-soft)] bg-[var(--surface)] p-2 shadow-[var(--shadow-card)]"
    >
      <div className="grid grid-cols-4 gap-1">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href ||
            (href === "/" && pathname === "/plan") ||
            (href === "/sources" && pathname === "/city-guide");

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`focus-ring flex min-h-12 items-center justify-center gap-1.5 rounded-full text-sm font-bold transition ${
                isActive ? "bg-[#172033] text-white" : "text-[var(--text-muted)] active:bg-[var(--surface-warm)]"
              }`}
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
