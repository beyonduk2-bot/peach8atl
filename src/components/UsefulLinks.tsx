import { AlertCircle, ExternalLink, LinkIcon } from "lucide-react";
import { officialLinks } from "@/data/officialLinks";

type LinkItem = {
  href: string;
  label: string;
};

type LinkSection = {
  links: LinkItem[];
  title: string;
};

const sections: LinkSection[] = [
  {
    title: "Matchday essentials",
    links: [
      {
        label: "MARTA event guide",
        href: officialLinks.martaWorldCupGuide
      },
      {
        label: "Official MARTA match planner",
        href: officialLinks.martaMatchPlanner
      },
      {
        label: "MARTA service alerts",
        href: officialLinks.martaServiceAlerts
      },
      {
        label: "MARTA On the Go app",
        href: officialLinks.martaOnTheGo
      }
    ]
  },
  {
    title: "MARTA and transit",
    links: [
      {
        label: "Interactive system map",
        href: officialLinks.martaInteractiveMap
      },
      {
        label: "MARTA rail map",
        href: officialLinks.martaRailMap
      },
      {
        label: "MARTA fares / Breeze",
        href: officialLinks.martaFares
      },
      {
        label: "How to ride MARTA",
        href: officialLinks.martaHowToRide
      }
    ]
  },
  {
    title: "First mile and safety",
    links: [
      {
        label: "Parking availability",
        href: officialLinks.martaParking
      },
      {
        label: "MARTA Reach zones",
        href: officialLinks.martaReach
      },
      {
        label: "See & Say safety app",
        href: officialLinks.martaSeeSay
      },
      {
        label: "ATL SPOKE shuttle",
        href: officialLinks.atlSpoke
      }
    ]
  },
  {
    title: "Stadium and match",
    links: [
      {
        label: "Stadium bag policy",
        href: officialLinks.stadiumBagPolicy
      },
      {
        label: "Stadium A-Z guide",
        href: officialLinks.stadiumGuide
      },
      {
        label: "Food & Beverage menu",
        href: officialLinks.stadiumFood
      },
      {
        label: "Tournament match info",
        href: officialLinks.fifa
      }
    ]
  },
  {
    title: "Fan extras",
    links: [
      {
        label: "StationSoccer",
        href: officialLinks.stationSoccer
      },
      {
        label: "Pickup match info",
        href: officialLinks.pickupMatchInfo
      }
    ]
  },
  {
    title: "Weather and safety",
    links: [
      {
        label: "Weather forecast",
        href: officialLinks.weatherForecast
      }
    ]
  }
];

export function UsefulLinks() {
  return (
    <section className="space-y-5">
      {sections.map((section) => (
        <div className="space-y-3" key={section.title}>
          <h2 className="px-1 text-sm font-bold tracking-[0.03em] text-[#ffb347]">{section.title}</h2>
          <div className="space-y-3">
            {section.links.map((link) => (
              <a
                className="focus-ring flex min-h-[64px] items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-[#161b27] p-4 font-black text-[#f0f6fc] shadow-sm active:bg-[#211c16]"
                href={link.href}
                key={link.href}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#211c16] text-[#ffb347]">
                    <LinkIcon aria-hidden="true" size={18} />
                  </span>
                  <span className="min-w-0">{link.label}</span>
                </span>
                <ExternalLink aria-hidden="true" className="shrink-0 text-[#8b949e]" size={18} />
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 rounded-[1.35rem] border border-white/10 bg-[#161b27] p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#211c16] text-[#ffb347]">
          <AlertCircle aria-hidden="true" size={19} />
        </span>
        <p className="text-sm font-bold leading-5 text-[#8b949e]">
          Peach8 gives you the quick read. Transit, stadium, weather, and event sources get the final word.
        </p>
      </div>
    </section>
  );
}
