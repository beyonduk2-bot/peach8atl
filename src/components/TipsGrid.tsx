import {
  CloudSun,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Landmark,
  Plane,
  ShoppingBag,
  ShieldCheck,
  TrainFront,
  Trophy,
  Utensils,
  WalletCards,
  Watch
} from "lucide-react";
import { officialLinks } from "@/data/officialLinks";

type TipCard = {
  badge?: string;
  body: string;
  href?: string;
  icon: typeof TrainFront;
  isHighlight?: boolean;
  linkLabel?: string;
  title: string;
};

type TipSection = {
  cards: TipCard[];
  title: string;
};

const sections: TipSection[] = [
  {
    title: "The rail move",
    cards: [
      {
        badge: "Rail-first",
        body: "Skip the parking spiral. MARTA gets you close without the car hunt.",
        href: officialLinks.martaMatchPlanner,
        icon: TrainFront,
        linkLabel: "Official planner",
        title: "Rail over parking"
      },
      {
        body: "Landing at ATL? Follow airport signs to MARTA, ride downtown, then make the stadium move.",
        href: officialLinks.martaAirport,
        icon: Plane,
        linkLabel: "Airport rail",
        title: "Landing at ATL"
      },
      {
        body: "Card or phone wallet ready means less gate fumbling.",
        href: officialLinks.martaFares,
        icon: CreditCard,
        linkLabel: "Fares",
        title: "Tap and keep moving"
      },
      {
        body: "Check official alerts before you roll. Single tracking has no chill.",
        href: officialLinks.martaServiceAlerts,
        icon: Watch,
        linkLabel: "Service alerts",
        title: "Peek before you leave"
      },
      {
        body: "Driving part way in? Parking can shift fast, so check availability before you commit.",
        href: officialLinks.martaParking,
        icon: Landmark,
        linkLabel: "Parking",
        title: "Park with receipts"
      }
    ]
  },
  {
    title: "Inside the venue",
    cards: [
      {
        body: "No bag is the cleanest move. If you bring one, keep it clear and stadium-ready.",
        href: officialLinks.stadiumBagPolicy,
        icon: ShoppingBag,
        linkLabel: "Bag policy",
        title: "Bag light"
      },
      {
        body: "Bring a card or phone wallet. Cash-to-card kiosks are the backup plan.",
        href: officialLinks.stadiumGuide,
        icon: WalletCards,
        linkLabel: "A-Z guide",
        title: "Wallet ready"
      },
      {
        badge: "Fan Favorite",
        body: "The stadium is known for friendlier food prices. Check the menu before panic-snacking outside.",
        href: officialLinks.stadiumFood,
        icon: Utensils,
        isHighlight: true,
        linkLabel: "Food menu",
        title: "Fan-first eats"
      },
      {
        body: "Give yourself cushion for security, crowds, and the walk in. Future you will approve.",
        href: officialLinks.stadiumGuide,
        icon: Landmark,
        linkLabel: "Entry guide",
        title: "Pad the clock"
      }
    ]
  },
  {
    title: "Last-minute checks",
    cards: [
      {
        body: "Atlanta weather can change outfits fast. Check the forecast before you roll.",
        href: officialLinks.weatherForecast,
        icon: CloudSun,
        linkLabel: "Forecast",
        title: "Weather check"
      },
      {
        body: "MARTA apps cover live movement and safety. Keep the official tools one tap away.",
        href: officialLinks.martaOnTheGo,
        icon: ShieldCheck,
        linkLabel: "MARTA apps",
        title: "Official tools"
      },
      {
        body: "If you need help in the station, follow signage and look for official on-site staff.",
        href: officialLinks.martaWorldCupGuide,
        icon: HelpCircle,
        linkLabel: "MARTA guide",
        title: "Ask the humans"
      },
      {
        body: "Extra time before kickoff? StationSoccer is the fan-side quest worth knowing.",
        href: officialLinks.stationSoccer,
        icon: Trophy,
        linkLabel: "StationSoccer",
        title: "Pre-match kickabout"
      },
      {
        body: "Rules and walking routes can shift. If it matters, verify it at the source.",
        href: officialLinks.fifa,
        icon: ExternalLink,
        linkLabel: "Tournament info",
        title: "Final source check"
      }
    ]
  }
];

function TipCard({ badge, body, href, icon: Icon, isHighlight = false, linkLabel, title }: TipCard) {
  const cardClass = isHighlight
    ? "border-[#ffb347]/40 bg-[#ffb347] text-[#0d1117]"
    : "border-white/10 bg-[#161b27] text-[#f0f6fc]";
  const iconClass = isHighlight ? "bg-[#0d1117] text-[#ffb347]" : "bg-[#211c16] text-[#ffb347]";
  const bodyClass = isHighlight ? "text-[#211c16]" : "text-[#8b949e]";

  return (
    <article className={`flex min-h-[178px] flex-col rounded-[1.45rem] border p-4 shadow-sm ${cardClass}`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${iconClass}`}>
          <Icon aria-hidden="true" size={20} />
        </span>
        {badge ? (
          <span className="rounded-full bg-[#0d1117] px-2.5 py-1 text-[0.68rem] font-bold tracking-[0.02em] text-[#ffb347]">
            {badge}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-bold leading-tight">{title}</h3>
      <p className={`mt-2 flex-1 text-sm font-semibold leading-5 ${bodyClass}`}>{body}</p>

      {href && linkLabel ? (
        <a
          className={`focus-ring mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full text-xs font-black ${
            isHighlight ? "text-[#0d1117]" : "text-[#ffb347]"
          }`}
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {linkLabel}
          <ExternalLink aria-hidden="true" size={13} />
        </a>
      ) : null}
    </article>
  );
}

export function TipsGrid() {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <section className="space-y-3" key={section.title}>
          <h2 className="px-1 text-sm font-bold tracking-[0.03em] text-[#ffb347]">{section.title}</h2>
          <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2">
            {section.cards.map((card) => (
              <TipCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
