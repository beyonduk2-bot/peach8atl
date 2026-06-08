"use client";

import { Car, Compass, Map } from "lucide-react";
import type { Station } from "@/types";

type StationAppButtonsProps = {
  station: Station;
  origin?: string;
};

function encode(value: string) {
  return encodeURIComponent(value);
}

function googleMapsUrl(station: Station, origin?: string) {
  const params = new URLSearchParams({
    api: "1",
    destination: station.mapsQuery,
    travelmode: "transit"
  });

  if (origin?.trim()) {
    params.set("origin", origin.trim());
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function appleMapsUrl(station: Station, origin?: string) {
  const params = new URLSearchParams({
    daddr: station.mapsQuery,
    dirflg: "r"
  });

  if (origin?.trim()) {
    params.set("saddr", origin.trim());
  }

  return `https://maps.apple.com/?${params.toString()}`;
}

function uberUrl(station: Station) {
  return `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encode(station.mapsQuery)}`;
}

function lyftUrl(station: Station) {
  return `https://www.lyft.com/rider/routes?destination=${encode(station.mapsQuery)}`;
}

export function StationAppButtons({ station, origin }: StationAppButtonsProps) {
  const buttons = [
    {
      href: googleMapsUrl(station, origin),
      label: "Open in Google Maps",
      text: "Maps",
      className: "bg-[#211c16] text-[#ffb347]",
      icon: <Compass aria-hidden="true" size={18} />
    },
    {
      href: appleMapsUrl(station, origin),
      label: "Open in Apple Maps",
      text: "Apple",
      className: "bg-[#1b2230] text-[#f0f6fc]",
      icon: <Map aria-hidden="true" size={18} />
    },
    {
      href: uberUrl(station),
      label: "Open Uber",
      text: "Uber",
      className: "bg-[#0d1117] text-[#f0f6fc]",
      icon: <Car aria-hidden="true" size={18} />
    },
    {
      href: lyftUrl(station),
      label: "Open Lyft",
      text: "Lyft",
      className: "bg-[#2a1725] text-[#ff8c69]",
      icon: <Car aria-hidden="true" size={18} />
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-2" aria-label="Open route in another app">
      {buttons.map((button) => (
        <a
          aria-label={button.label}
          className={`focus-ring flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 px-2 py-2 text-[0.68rem] font-black shadow-sm transition active:scale-95 ${button.className}`}
          href={button.href}
          key={button.label}
          rel="noreferrer"
          target="_blank"
        >
          {button.icon}
          <span>{button.text}</span>
        </a>
      ))}
    </div>
  );
}
