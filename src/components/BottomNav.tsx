"use client";

import Link from "next/link";
import { Info, Lightbulb, LinkIcon, TrainFront } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Go", icon: TrainFront },
  { href: "/tips", label: "Tips", icon: Lightbulb },
  { href: "/sources", label: "Links", icon: LinkIcon },
  { href: "/about", label: "About", icon: Info }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+0.65rem)] z-50 mx-auto w-[min(398px,calc(100vw-2rem))] rounded-full bg-[#0d1117] p-2 shadow-[0_18px_55px_rgba(0,0,0,0.45)]"
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
              className={`focus-ring flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-black transition ${
                isActive ? "bg-[#ffb347] text-[#0d1117]" : "text-[#8b949e] active:bg-white/10"
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
