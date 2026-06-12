import {
  getMapOverlayRoute,
  SEC_DISTRICT_POINT,
  type MapRoutePoint
} from "@/data/martaMapOverlayRoutes";

type MartaMapSvgCloneProps = {
  startStationId?: string;
};

type TextAnchor = "start" | "middle" | "end";

type StationDot = {
  color: string;
  r?: number;
  stationKey?: string;
  x: number;
  y: number;
};

type StationLabel = {
  anchor?: TextAnchor;
  rotate?: number;
  size?: number;
  stationKey?: string;
  text: string;
  weight?: number;
  x: number;
  y: number;
};

type RailPathDefinition = {
  color: string;
  d: string;
  id: string;
  width?: number;
};

type ActiveRouteSegment = {
  color: string;
  d: string;
  id: string;
  width?: number;
};

const COLORS = {
  background: "#0a0f16",
  dot: "#ffffff",
  blue: "#1d81d0",
  gold: "#e5a60b",
  green: "#229634",
  muted: "#8f98a2",
  red: "#d51d19",
  text: "#eaeaea"
};

const MAP_WIDTH = 1086;
const MAP_HEIGHT = 1448;
const DEFAULT_START_STATION_KEY = "north-springs";
const DESTINATION_STATION_KEY = "sec-district";

const railPaths: RailPathDefinition[] = [
  {
    id: "red",
    color: COLORS.red,
    d: "M583 78 L583 137 C583 149 590 156 605 162 C623 173 629 185 629 205 L629 255 C629 271 619 280 598 286 L584 286 L584 428 C584 456 562 483 535 512 L506 542 C497 552 496 577 496 620 L496 920 C496 942 476 957 456 977 C437 996 434 1015 434 1040 L434 1297 C434 1320 454 1346 492 1383",
    width: 11.5
  },
  {
    id: "gold",
    color: COLORS.gold,
    d: "M780 298 L760 320 L740 340 L720 362 L700 384 L680 405 L660 426 L640 449 L620 470 L600 490 L580 511 L560 532 L540 552 L520 578 C518 595 519 620 519 660 L519 920 C519 943 506 960 492 977 C470 998 457 1016 457 1048 L457 1267 C457 1300 476 1326 500 1369",
    width: 11.5
  },
  {
    id: "green",
    color: COLORS.green,
    d: "M259 815 L330 888 C350 906 376 899 436 899 L518 899",
    width: 10.5
  },
  {
    id: "blue",
    color: COLORS.blue,
    d: "M157 920 H991",
    width: 13
  }
];

const dots: StationDot[] = [
  { x: 583, y: 78, color: COLORS.red, r: 10.5, stationKey: "north-springs" },
  { x: 595, y: 148, color: COLORS.red, stationKey: "sandy-springs" },
  { x: 629, y: 214, color: COLORS.red, stationKey: "dunwoody" },
  { x: 598, y: 286, color: COLORS.red, stationKey: "medical-center" },
  { x: 583, y: 428, color: COLORS.red, stationKey: "buckhead" },
  { x: 497, y: 619, color: COLORS.red, r: 9, stationKey: "arts-center" },
  { x: 518, y: 619, color: COLORS.gold, r: 9, stationKey: "arts-center" },
  { x: 497, y: 661, color: COLORS.red, r: 9, stationKey: "midtown" },
  { x: 518, y: 661, color: COLORS.gold, r: 9, stationKey: "midtown" },
  { x: 497, y: 704, color: COLORS.red, r: 9, stationKey: "north-avenue" },
  { x: 518, y: 704, color: COLORS.gold, r: 9, stationKey: "north-avenue" },
  { x: 497, y: 748, color: COLORS.red, r: 9, stationKey: "civic-center" },
  { x: 518, y: 748, color: COLORS.gold, r: 9, stationKey: "civic-center" },
  { x: 497, y: 794, color: COLORS.red, r: 9, stationKey: "peachtree-center" },
  { x: 518, y: 794, color: COLORS.gold, r: 9, stationKey: "peachtree-center" },
  { x: 780, y: 298, color: COLORS.gold, stationKey: "doraville" },
  { x: 736, y: 350, color: COLORS.gold, stationKey: "chamblee" },
  { x: 696, y: 391, color: COLORS.gold, stationKey: "brookhaven" },
  { x: 651, y: 438, color: COLORS.gold, stationKey: "lenox" },
  { x: 560, y: 532, color: COLORS.gold, stationKey: "lindbergh-center" },
  { x: 492, y: 991, color: COLORS.gold, stationKey: "garnett" },
  { x: 456, y: 1048, color: COLORS.gold, stationKey: "west-end" },
  { x: 456, y: 1099, color: COLORS.gold, stationKey: "oakland-city" },
  { x: 456, y: 1151, color: COLORS.gold, stationKey: "lakewood-ft-mcpherson" },
  { x: 456, y: 1205, color: COLORS.gold, stationKey: "east-point" },
  { x: 456, y: 1267, color: COLORS.gold, stationKey: "college-park" },
  { x: 500, y: 1369, color: COLORS.gold, stationKey: "airport" },
  { x: 492, y: 1383, color: COLORS.red, r: 10.5, stationKey: "airport" },
  { x: 259, y: 815, color: COLORS.green, r: 9, stationKey: "bankhead" },
  { x: 376, y: 899, color: COLORS.green, r: 9, stationKey: "vine-city" },
  { x: 436, y: 899, color: COLORS.green, r: 9, stationKey: DESTINATION_STATION_KEY },
  { x: 518, y: 899, color: COLORS.green, r: 9, stationKey: "five-points" },
  { x: 157, y: 920, color: COLORS.blue, r: 9, stationKey: "hamilton-e-holmes" },
  { x: 231, y: 920, color: COLORS.blue, r: 9, stationKey: "west-lake" },
  { x: 299, y: 920, color: COLORS.blue, r: 9, stationKey: "ashby" },
  { x: 376, y: 920, color: COLORS.blue, r: 9, stationKey: "vine-city" },
  { x: 436, y: 920, color: COLORS.blue, r: 9, stationKey: DESTINATION_STATION_KEY },
  { x: 557, y: 920, color: COLORS.blue, r: 9, stationKey: "georgia-state" },
  { x: 607, y: 920, color: COLORS.blue, r: 9, stationKey: "king-memorial" },
  { x: 668, y: 920, color: COLORS.blue, r: 9, stationKey: "inman-park-reynoldstown" },
  { x: 732, y: 920, color: COLORS.blue, r: 9, stationKey: "edgewood-candler-park" },
  { x: 793, y: 920, color: COLORS.blue, r: 9, stationKey: "east-lake" },
  { x: 846, y: 920, color: COLORS.blue, r: 9, stationKey: "decatur" },
  { x: 897, y: 920, color: COLORS.blue, r: 9, stationKey: "avondale" },
  { x: 949, y: 920, color: COLORS.blue, r: 9, stationKey: "kensington" },
  { x: 991, y: 920, color: COLORS.blue, r: 9, stationKey: "indian-creek" }
];

const labels: StationLabel[] = [
  { text: "North Springs", x: 609, y: 78, anchor: "start", size: 18, weight: 700, stationKey: "north-springs" },
  { text: "Sandy Springs", x: 623, y: 147, anchor: "start", size: 18, weight: 700, stationKey: "sandy-springs" },
  { text: "Dunwoody", x: 659, y: 214, anchor: "start", size: 19, weight: 700, stationKey: "dunwoody" },
  { text: "Medical Center", x: 575, y: 287, anchor: "end", size: 19, weight: 700, stationKey: "medical-center" },
  { text: "Buckhead", x: 565, y: 427, anchor: "end", size: 18, weight: 700, stationKey: "buckhead" },
  { text: "Doraville", x: 803, y: 298, anchor: "start", size: 18, weight: 700, stationKey: "doraville" },
  { text: "Chamblee", x: 759, y: 349, anchor: "start", size: 14, weight: 700, stationKey: "chamblee" },
  { text: "Brookhaven/Oglethorpe", x: 719, y: 392, anchor: "start", size: 16, weight: 700, stationKey: "brookhaven" },
  { text: "Lenox", x: 678, y: 441, anchor: "start", size: 16, weight: 700, stationKey: "lenox" },
  { text: "Lindbergh Center", x: 601, y: 520, anchor: "start", size: 19, weight: 700, stationKey: "lindbergh-center" },
  { text: "Arts Center", x: 464, y: 619, anchor: "end", size: 19, weight: 700, stationKey: "arts-center" },
  { text: "Midtown", x: 467, y: 660, anchor: "end", size: 19, weight: 700, stationKey: "midtown" },
  { text: "North Avenue", x: 467, y: 702, anchor: "end", size: 19, weight: 700, stationKey: "north-avenue" },
  { text: "Civic Center", x: 467, y: 747, anchor: "end", size: 19, weight: 700, stationKey: "civic-center" },
  { text: "Peachtree Center", x: 466, y: 792, anchor: "end", size: 18, weight: 700, stationKey: "peachtree-center" },
  { text: "Bankhead", x: 212, y: 792, anchor: "middle", size: 18, weight: 700, stationKey: "bankhead" },
  { text: "Hamilton E. Holmes", x: 111, y: 1000, anchor: "middle", rotate: -45, size: 12, weight: 700, stationKey: "hamilton-e-holmes" },
  { text: "West Lake", x: 205, y: 984, anchor: "middle", rotate: -45, size: 14, weight: 700, stationKey: "west-lake" },
  { text: "Ashby", x: 286, y: 970, anchor: "middle", rotate: -45, size: 13, weight: 700, stationKey: "ashby" },
  { text: "Vine City", x: 357, y: 972, anchor: "middle", rotate: -45, size: 14, weight: 700, stationKey: "vine-city" },
  { text: "SEC District", x: 405, y: 984, anchor: "middle", rotate: -45, size: 16, weight: 760, stationKey: DESTINATION_STATION_KEY },
  { text: "Five Points", x: 573, y: 852, anchor: "middle", rotate: -45, size: 15, weight: 760, stationKey: "five-points" },
  { text: "Georgia State", x: 592, y: 866, anchor: "middle", rotate: -45, size: 10, weight: 700, stationKey: "georgia-state" },
  { text: "King Memorial", x: 655, y: 866, anchor: "middle", rotate: -45, size: 10, weight: 700, stationKey: "king-memorial" },
  { text: "Inman Park/Reynoldstown", x: 728, y: 855, anchor: "middle", rotate: -45, size: 12, weight: 700, stationKey: "inman-park-reynoldstown" },
  { text: "Edgewood/Candler Park", x: 791, y: 850, anchor: "middle", rotate: -45, size: 12, weight: 700, stationKey: "edgewood-candler-park" },
  { text: "East Lake", x: 845, y: 873, anchor: "middle", rotate: -45, size: 12, weight: 700, stationKey: "east-lake" },
  { text: "Decatur", x: 902, y: 874, anchor: "middle", rotate: -45, size: 13, weight: 700, stationKey: "decatur" },
  { text: "Avondale", x: 955, y: 872, anchor: "middle", rotate: -45, size: 13, weight: 700, stationKey: "avondale" },
  { text: "Kensington", x: 1004, y: 868, anchor: "middle", rotate: -45, size: 12, weight: 700, stationKey: "kensington" },
  { text: "Indian Creek", x: 1046, y: 872, anchor: "middle", rotate: -45, size: 12, weight: 700, stationKey: "indian-creek" },
  { text: "Garnett", x: 518, y: 992, anchor: "start", size: 18, weight: 700, stationKey: "garnett" },
  { text: "West End", x: 483, y: 1048, anchor: "start", size: 19, weight: 700, stationKey: "west-end" },
  { text: "Oakland City", x: 484, y: 1099, anchor: "start", size: 19, weight: 700, stationKey: "oakland-city" },
  {
    text: "Lakewood/Ft. McPherson",
    x: 488,
    y: 1150,
    anchor: "start",
    size: 19,
    weight: 700,
    stationKey: "lakewood-ft-mcpherson"
  },
  { text: "East Point", x: 485, y: 1205, anchor: "start", size: 19, weight: 700, stationKey: "east-point" },
  { text: "College Park", x: 484, y: 1266, anchor: "start", size: 19, weight: 700, stationKey: "college-park" },
  { text: "Airport", x: 526, y: 1385, anchor: "start", size: 16, weight: 700, stationKey: "airport" }
];

const redNorthOrder = [
  "north-springs",
  "sandy-springs",
  "dunwoody",
  "medical-center",
  "buckhead",
  "arts-center",
  "midtown",
  "north-avenue",
  "civic-center",
  "peachtree-center"
];

const goldNorthOrder = [
  "doraville",
  "chamblee",
  "brookhaven",
  "lenox",
  "lindbergh-center",
  "arts-center",
  "midtown",
  "north-avenue",
  "civic-center",
  "peachtree-center"
];

const southOrderFromFivePoints = [
  "garnett",
  "west-end",
  "oakland-city",
  "lakewood-ft-mcpherson",
  "east-point",
  "college-park",
  "airport"
];

const blueWestOrderToDestination = ["hamilton-e-holmes", "west-lake", "ashby", "vine-city", DESTINATION_STATION_KEY];
const blueEastOrderFromDestination = [
  DESTINATION_STATION_KEY,
  "five-points",
  "georgia-state",
  "king-memorial",
  "inman-park-reynoldstown",
  "edgewood-candler-park",
  "east-lake",
  "decatur",
  "avondale",
  "kensington",
  "indian-creek"
];

function getActiveStationKeys(startStationId?: string) {
  const startKey = startStationId ?? DEFAULT_START_STATION_KEY;
  const activeKeys = new Set<string>([startKey, DESTINATION_STATION_KEY]);
  const addSegment = (stations: string[]) => stations.forEach((station) => activeKeys.add(station));

  const redIndex = redNorthOrder.indexOf(startKey);
  if (redIndex >= 0) {
    addSegment(redNorthOrder.slice(redIndex));
    activeKeys.add("five-points");
    return activeKeys;
  }

  const goldIndex = goldNorthOrder.indexOf(startKey);
  if (goldIndex >= 0) {
    addSegment(goldNorthOrder.slice(goldIndex));
    activeKeys.add("five-points");
    return activeKeys;
  }

  const southIndex = southOrderFromFivePoints.indexOf(startKey);
  if (southIndex >= 0) {
    addSegment(southOrderFromFivePoints.slice(0, southIndex + 1));
    activeKeys.add("five-points");
    return activeKeys;
  }

  const westIndex = blueWestOrderToDestination.indexOf(startKey);
  if (westIndex >= 0) {
    addSegment(blueWestOrderToDestination.slice(westIndex));
    return activeKeys;
  }

  const eastIndex = blueEastOrderFromDestination.indexOf(startKey);
  if (eastIndex >= 0) {
    addSegment(blueEastOrderFromDestination.slice(0, eastIndex + 1));
    return activeKeys;
  }

  if (startKey === "bankhead") {
    addSegment(["bankhead", "vine-city", DESTINATION_STATION_KEY]);
  }

  return activeKeys;
}

function getPrimaryRouteColor(startStationId?: string) {
  const startKey = startStationId ?? DEFAULT_START_STATION_KEY;

  if (redNorthOrder.includes(startKey)) return COLORS.red;
  if (goldNorthOrder.includes(startKey)) return COLORS.gold;
  if (startKey === "airport") return COLORS.red;
  if (southOrderFromFivePoints.includes(startKey)) return COLORS.gold;
  if (blueWestOrderToDestination.includes(startKey) || blueEastOrderFromDestination.includes(startKey)) {
    return COLORS.blue;
  }
  if (startKey === "bankhead") return COLORS.green;

  return COLORS.blue;
}

function getLastPointFromPath(d: string) {
  const numbers = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];

  if (numbers.length < 2) return undefined;

  return {
    x: numbers[numbers.length - 2],
    y: numbers[numbers.length - 1]
  };
}

function getActiveRouteSegments(startStationId: string | undefined, path: string): ActiveRouteSegment[] {
  const startKey = startStationId ?? DEFAULT_START_STATION_KEY;
  const primaryColor = getPrimaryRouteColor(startKey);

  if (startKey === DESTINATION_STATION_KEY || path === "M436 921") return [];
  if (primaryColor === COLORS.blue || primaryColor === COLORS.green) {
    return [{ id: `${startKey}-route`, color: primaryColor, d: path, width: primaryColor === COLORS.blue ? 13 : 10.5 }];
  }

  const transferSuffix = " L436 921";
  const transferIndex = path.lastIndexOf(transferSuffix);

  if (transferIndex < 0) {
    return [{ id: `${startKey}-route`, color: primaryColor, d: path, width: 11.5 }];
  }

  const trunkPath = path.slice(0, transferIndex);
  const transferStart = getLastPointFromPath(trunkPath);

  if (!transferStart) {
    return [{ id: `${startKey}-route`, color: primaryColor, d: path, width: 11.5 }];
  }

  return [
    { id: `${startKey}-trunk`, color: primaryColor, d: trunkPath, width: 11.5 },
    { id: `${startKey}-transfer`, color: COLORS.blue, d: `M${transferStart.x} ${transferStart.y} L436 921`, width: 13 }
  ];
}

function isNearPoint(point: MapRoutePoint, target: MapRoutePoint, tolerance = 18) {
  return Math.hypot(point.x - target.x, point.y - target.y) <= tolerance;
}

function RailPath({ color, d, id, muted = false, width = 15 }: RailPathDefinition & { muted?: boolean }) {
  return (
    <g opacity={muted ? 0.23 : 1}>
      <path
        d={d}
        fill="none"
        stroke="#02060c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={id === "blue" ? 0.24 : 0.5}
        strokeWidth={width + 2}
      />
      <path
        d={d}
        fill="none"
        filter="url(#clone-rail-glow)"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={width}
      />
      <path
        d={d}
        fill="none"
        opacity={0.08}
        stroke={id === "blue" ? "#56b6f6" : "#ffffff"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={id === "blue" ? 1.4 : 1.25}
      />
    </g>
  );
}

function ActiveRoutePath({ color, d, width = 12 }: ActiveRouteSegment) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke="#02060c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.62}
        strokeWidth={width + 2.5}
      />
      <path
        d={d}
        fill="none"
        filter="url(#clone-rail-glow)"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={width}
      />
    </g>
  );
}

function StationDot({
  muted = false,
  pulse,
  r = 9,
  x,
  y
}: StationDot & { muted?: boolean; pulse?: "start" | "destination" }) {
  const dotRadius = r >= 10 ? 5.8 : 5.1;

  return (
    <g
      className={pulse === "start" ? "map-dot-pulse-start" : pulse === "destination" ? "map-dot-pulse-destination" : undefined}
      opacity={muted ? 0.24 : 1}
    >
      <circle cx={x} cy={y} fill={COLORS.dot} r={dotRadius} />
    </g>
  );
}

function FivePointsHub({ muted = false }: { muted?: boolean }) {
  return (
    <g opacity={muted ? 0.26 : 1}>
      <circle cx={497} cy={920} fill={COLORS.dot} r={6.4} />
      <circle cx={518} cy={920} fill={COLORS.dot} r={6.4} />
    </g>
  );
}

function StationLabel({
  active = false,
  anchor = "start",
  muted = false,
  pulse,
  rotate = 0,
  routeActive = false,
  size = 20,
  text,
  weight = 700,
  x,
  y
}: StationLabel & {
  active?: boolean;
  muted?: boolean;
  pulse?: "start" | "destination";
  routeActive?: boolean;
}) {
  const transform = rotate ? `rotate(${rotate} ${x} ${y})` : undefined;
  const renderedSize = active ? Math.max(size * 0.95, pulse === "destination" ? 17 : 16) : size * 0.95;
  const renderedWeight = active || weight >= 750 ? 700 : weight >= 700 ? 600 : weight;
  const opacity = active ? 1 : routeActive ? 0.72 : muted ? 0.2 : 1;

  return (
    <text
      className={
        pulse === "start"
          ? "map-label-pulse-start"
          : pulse === "destination"
            ? "map-label-pulse-destination"
            : undefined
      }
      dominantBaseline={rotate ? "alphabetic" : "middle"}
      fill={COLORS.text}
      filter="url(#clone-text-shadow)"
      fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      fontSize={renderedSize}
      fontWeight={renderedWeight}
      letterSpacing={0}
      opacity={opacity}
      paintOrder="stroke fill"
      stroke="#02060c"
      strokeLinejoin="round"
      strokeWidth={active ? 0.8 : 0.4}
      textAnchor={anchor}
      transform={transform}
      x={x}
      y={y}
    >
      {text}
    </text>
  );
}

function LegendLine({ color, label, y }: { color: string; label: string; y: number }) {
  return (
    <g>
      <line stroke={color} strokeLinecap="round" strokeWidth={9} x1={84} x2={128} y1={y} y2={y} />
      <text
        dominantBaseline="middle"
        fill={COLORS.text}
        fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
        fontSize={18}
        fontWeight={700}
        x={151}
        y={y}
      >
        {label}
      </text>
    </g>
  );
}

function SoccerBallMarker() {
  return (
    <text
      dominantBaseline="central"
      filter="url(#clone-text-shadow)"
      fontFamily="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
      fontSize={30}
      textAnchor="middle"
      x={0}
      y={0}
    >
      ⚽
    </text>
  );
}

export function MartaMapSvgClone({ startStationId }: MartaMapSvgCloneProps) {
  const activeRoute = getMapOverlayRoute(startStationId);
  const activeRouteSegments = getActiveRouteSegments(activeRoute.key, activeRoute.path);
  const routeUsesGreen = activeRouteSegments.some((segment) => segment.color === COLORS.green);
  const activeStationKeys = getActiveStationKeys(activeRoute.key);
  const activeRoutePathId = `svg-clone-active-route-${activeRoute.key}`;
  const isDestinationOnly = activeRoute.key === DESTINATION_STATION_KEY;

  return (
    <svg
      aria-label="MARTA rail map with your route to the stadium highlighted"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
    >
      <defs>
        <radialGradient cx="50%" cy="40%" id="clone-map-bg" r="80%">
          <stop offset="0%" stopColor="#0a0f16" />
          <stop offset="58%" stopColor="#0a0f16" />
          <stop offset="100%" stopColor="#0a0f16" />
        </radialGradient>
        <filter id="clone-bg-texture" x="0" y="0" width="100%" height="100%">
          <feTurbulence baseFrequency="0.9" numOctaves="2" seed="8" type="fractalNoise" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA slope="0.035" type="linear" />
          </feComponentTransfer>
        </filter>
        <filter id="clone-rail-glow" filterUnits="userSpaceOnUse" height="1608" width="1246" x="-80" y="-80">
          <feDropShadow dx="0" dy="0" floodColor="#000000" floodOpacity="0.15" stdDeviation="1" />
        </filter>
        <filter id="clone-text-shadow" x="-20%" y="-35%" width="140%" height="170%">
          <feDropShadow dx="0" dy="0" floodColor="#000000" floodOpacity="0.25" stdDeviation="0.6" />
        </filter>
        <filter id="clone-active-route-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="0" floodColor="#ffffff" floodOpacity="0.24" stdDeviation="2.4" />
        </filter>
        <filter id="clone-ball-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="4" floodColor="#000000" floodOpacity="0.45" stdDeviation="4" />
        </filter>
      </defs>

      <rect fill="url(#clone-map-bg)" height={MAP_HEIGHT} rx="21" width={MAP_WIDTH} x="0" y="0" />
      <rect filter="url(#clone-bg-texture)" height={MAP_HEIGHT} opacity={0.3} rx="21" width={MAP_WIDTH} x="0" y="0" />
      <rect fill="none" height={MAP_HEIGHT} opacity={0.12} rx="18" stroke="#202a37" strokeWidth="1" width={MAP_WIDTH} x="0" y="0" />

      <g opacity={0.67} transform="translate(986 89) scale(0.96)">
        <path d="M0 -28 L12 8 L4 8 L4 38 L-4 38 L-4 8 L-12 8 Z" fill="#aeb6c1" />
        <circle cx="0" cy="58" fill="none" r="34" stroke="#aeb6c1" strokeWidth="5" />
        <text
          dominantBaseline="middle"
          fill="#aeb6c1"
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
          fontSize={32}
          fontWeight={800}
          textAnchor="middle"
          x="0"
          y="58"
        >
          N
        </text>
      </g>

      <g>
        {railPaths
          .filter((path) => path.id !== "blue")
          .map((path) => (
            <RailPath key={path.id} muted {...path} />
          ))}
        <RailPath muted {...railPaths.find((path) => path.id === "blue")!} />
      </g>

      <g>
        {activeRouteSegments.map((segment) => (
          <ActiveRoutePath key={segment.id} {...segment} />
        ))}
      </g>

      <path
        d={activeRoute.path}
        fill="none"
        id={activeRoutePathId}
        stroke="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
      />

      <g>
        {dots.map((dot) => {
          const isStartDot = isNearPoint(dot, activeRoute.start, 12);
          const isDestinationDot = dot.stationKey === DESTINATION_STATION_KEY && isNearPoint(dot, SEC_DISTRICT_POINT, 12);
          const routeActive = Boolean(dot.stationKey && activeStationKeys.has(dot.stationKey));
          const usesVisibleRouteLine = dot.color !== COLORS.green || routeUsesGreen || dot.stationKey === "bankhead";
          const pointActive = isStartDot || isDestinationDot || (routeActive && usesVisibleRouteLine);

          return (
            <StationDot
              key={`${dot.color}-${dot.x}-${dot.y}`}
              muted={!pointActive}
              pulse={isStartDot ? "start" : isDestinationDot ? "destination" : undefined}
              {...dot}
            />
          );
        })}
        <FivePointsHub muted={!activeStationKeys.has("five-points")} />
      </g>

      <g>
        {labels.map((label) => {
          const isStartLabel = label.stationKey === activeRoute.key;
          const isDestinationLabel = label.stationKey === DESTINATION_STATION_KEY;
          const routeActive = Boolean(label.stationKey && activeStationKeys.has(label.stationKey));

          return (
            <StationLabel
              key={`${label.text}-${label.x}-${label.y}`}
              active={isStartLabel || isDestinationLabel}
              muted={!routeActive}
              pulse={isStartLabel ? "start" : isDestinationLabel ? "destination" : undefined}
              routeActive={routeActive}
              {...label}
            />
          );
        })}
      </g>

      <g fill={COLORS.text} filter="url(#clone-text-shadow)" transform="translate(547 1353) scale(0.56)">
        <path d="M0 -22 C3 -22 4 -19 4 -15 L4 -4 L22 6 L22 12 L4 7 L4 22 L-4 22 L-4 7 L-22 12 L-22 6 L-4 -4 L-4 -15 C-4 -19 -3 -22 0 -22 Z" />
      </g>

      <g opacity={0.78}>
        <rect fill="rgba(7, 15, 24, 0.86)" height="220" rx="20" stroke="#303b49" strokeWidth="2" width="216" x="54" y="1143" />
        <LegendLine color={COLORS.red} label="Red Line" y={1181} />
        <LegendLine color={COLORS.gold} label="Gold Line" y={1228} />
        <LegendLine color={COLORS.green} label="Green Line" y={1277} />
        <LegendLine color={COLORS.blue} label="Blue Line" y={1326} />
      </g>

      {!isDestinationOnly ? (
        <g className="motion-reduce:hidden" filter="url(#clone-ball-shadow)">
          <SoccerBallMarker />
          <animateMotion dur="8s" repeatCount="indefinite" rotate="0">
            <mpath href={`#${activeRoutePathId}`} />
          </animateMotion>
        </g>
      ) : null}

      <g
        className={isDestinationOnly ? undefined : "motion-safe:hidden"}
        filter="url(#clone-ball-shadow)"
        transform={`translate(${SEC_DISTRICT_POINT.x} ${SEC_DISTRICT_POINT.y})`}
      >
        <SoccerBallMarker />
      </g>
    </svg>
  );
}
