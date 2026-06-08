export type MapRouteKey =
  | "airport"
  | "arts-center"
  | "avondale"
  | "bankhead"
  | "brookhaven"
  | "buckhead"
  | "chamblee"
  | "civic-center"
  | "college-park"
  | "doraville"
  | "dunwoody"
  | "east-point"
  | "hamilton-e-holmes"
  | "indian-creek"
  | "lenox"
  | "lindbergh-center"
  | "medical-center"
  | "midtown"
  | "north-avenue"
  | "north-springs"
  | "peachtree-center"
  | "sandy-springs"
  | "sec-district"
  | "vine-city";

export type MapRoutePoint = {
  x: number;
  y: number;
};

export type MapRouteLabel = MapRoutePoint & {
  text: string;
  anchor?: "start" | "middle" | "end";
  rotate?: number;
  size?: number;
};

export type MapOverlayRoute = {
  key: MapRouteKey;
  label: MapRouteLabel;
  path: string;
  start: MapRoutePoint;
};

export const MAP_OVERLAY_VIEWBOX = "0 0 1086 1448";

export const SEC_DISTRICT_POINT: MapRoutePoint = { x: 436, y: 921 };
export const SEC_DISTRICT_LABEL: MapRouteLabel = {
  text: "SEC District",
  x: 405,
  y: 990,
  anchor: "middle",
  rotate: -48,
  size: 18
};

export const MAP_ROUTE_PATHS: Record<MapRouteKey, MapOverlayRoute> = {
  "north-springs": {
    key: "north-springs",
    label: { text: "North Springs", x: 608, y: 82, anchor: "start" },
    start: { x: 583, y: 78 },
    path: "M583 78 L583 144 C586 164 627 170 629 213 C631 252 628 278 598 286 L584 286 L584 428 C584 462 542 502 506 542 C496 552 496 580 496 620 L496 921 L436 921"
  },
  "sandy-springs": {
    key: "sandy-springs",
    label: { text: "Sandy Springs", x: 623, y: 150, anchor: "start" },
    start: { x: 595, y: 148 },
    path: "M595 148 C606 160 627 171 629 213 C631 252 628 278 598 286 L584 286 L584 428 C584 462 542 502 506 542 C496 552 496 580 496 620 L496 921 L436 921"
  },
  dunwoody: {
    key: "dunwoody",
    label: { text: "Dunwoody", x: 658, y: 216, anchor: "start" },
    start: { x: 629, y: 214 },
    path: "M629 214 C631 252 628 278 598 286 L584 286 L584 428 C584 462 542 502 506 542 C496 552 496 580 496 620 L496 921 L436 921"
  },
  "medical-center": {
    key: "medical-center",
    label: { text: "Medical Center", x: 574, y: 290, anchor: "end" },
    start: { x: 598, y: 286 },
    path: "M598 286 L584 286 L584 428 C584 462 542 502 506 542 C496 552 496 580 496 620 L496 921 L436 921"
  },
  buckhead: {
    key: "buckhead",
    label: { text: "Buckhead", x: 565, y: 428, anchor: "end" },
    start: { x: 583, y: 428 },
    path: "M583 428 C583 462 542 502 506 542 C496 552 496 580 496 620 L496 921 L436 921"
  },
  doraville: {
    key: "doraville",
    label: { text: "Doraville", x: 803, y: 302, anchor: "start" },
    start: { x: 780, y: 298 },
    path: "M780 298 L760 320 L740 340 L720 362 L700 384 L680 405 L660 426 L640 449 L620 470 L600 490 L580 511 L560 532 L540 552 L520 578 C518 595 519 620 519 660 L519 921 L436 921"
  },
  chamblee: {
    key: "chamblee",
    label: { text: "Chamblee", x: 758, y: 352, anchor: "start" },
    start: { x: 736, y: 350 },
    path: "M736 350 L720 362 L700 384 L680 405 L660 426 L640 449 L620 470 L600 490 L580 511 L560 532 L540 552 L520 578 C518 595 519 620 519 660 L519 921 L436 921"
  },
  brookhaven: {
    key: "brookhaven",
    label: { text: "Brookhaven/Oglethorpe", x: 721, y: 394, anchor: "start" },
    start: { x: 696, y: 391 },
    path: "M696 391 L680 405 L660 426 L640 449 L620 470 L600 490 L580 511 L560 532 L540 552 L520 578 C518 595 519 620 519 660 L519 921 L436 921"
  },
  lenox: {
    key: "lenox",
    label: { text: "Lenox", x: 678, y: 444, anchor: "start" },
    start: { x: 651, y: 438 },
    path: "M651 438 L640 449 L620 470 L600 490 L580 511 L560 532 L540 552 L520 578 C518 595 519 620 519 660 L519 921 L436 921"
  },
  "lindbergh-center": {
    key: "lindbergh-center",
    label: { text: "Lindbergh Center", x: 600, y: 525, anchor: "start" },
    start: { x: 560, y: 532 },
    path: "M560 532 L540 552 L520 578 C518 595 519 620 519 660 L519 921 L436 921"
  },
  "arts-center": {
    key: "arts-center",
    label: { text: "Arts Center", x: 463, y: 622, anchor: "end" },
    start: { x: 497, y: 619 },
    path: "M497 619 L497 921 L436 921"
  },
  midtown: {
    key: "midtown",
    label: { text: "Midtown", x: 463, y: 663, anchor: "end" },
    start: { x: 497, y: 661 },
    path: "M497 661 L497 921 L436 921"
  },
  "north-avenue": {
    key: "north-avenue",
    label: { text: "North Avenue", x: 463, y: 707, anchor: "end" },
    start: { x: 497, y: 704 },
    path: "M497 704 L497 921 L436 921"
  },
  "civic-center": {
    key: "civic-center",
    label: { text: "Civic Center", x: 463, y: 750, anchor: "end" },
    start: { x: 497, y: 748 },
    path: "M497 748 L497 921 L436 921"
  },
  "peachtree-center": {
    key: "peachtree-center",
    label: { text: "Peachtree Center", x: 463, y: 795, anchor: "end" },
    start: { x: 497, y: 794 },
    path: "M497 794 L497 921 L436 921"
  },
  airport: {
    key: "airport",
    label: { text: "Airport", x: 521, y: 1391, anchor: "start" },
    start: { x: 492, y: 1383 },
    path: "M492 1383 C454 1346 434 1324 434 1297 L434 1028 C434 995 456 974 497 921 L436 921"
  },
  "college-park": {
    key: "college-park",
    label: { text: "College Park", x: 484, y: 1268, anchor: "start" },
    start: { x: 456, y: 1267 },
    path: "M456 1267 L456 1132 L456 1048 C456 995 474 970 497 921 L436 921"
  },
  "east-point": {
    key: "east-point",
    label: { text: "East Point", x: 484, y: 1206, anchor: "start" },
    start: { x: 456, y: 1205 },
    path: "M456 1205 L456 1048 C456 995 474 970 497 921 L436 921"
  },
  "hamilton-e-holmes": {
    key: "hamilton-e-holmes",
    label: { text: "Hamilton E. Holmes", x: 111, y: 1000, anchor: "middle", rotate: -45 },
    start: { x: 157, y: 921 },
    path: "M157 921 L231 921 L299 921 L376 921 L436 921"
  },
  "vine-city": {
    key: "vine-city",
    label: { text: "Vine City", x: 354, y: 954, anchor: "middle", rotate: -45 },
    start: { x: 376, y: 921 },
    path: "M376 921 L436 921"
  },
  bankhead: {
    key: "bankhead",
    label: { text: "Bankhead", x: 214, y: 790, anchor: "middle" },
    start: { x: 259, y: 815 },
    path: "M259 815 L330 888 C350 906 376 921 436 921"
  },
  avondale: {
    key: "avondale",
    label: { text: "Avondale", x: 922, y: 890, anchor: "middle", rotate: -45 },
    start: { x: 897, y: 921 },
    path: "M897 921 L846 921 L793 921 L732 921 L668 921 L607 921 L497 921 L436 921"
  },
  "indian-creek": {
    key: "indian-creek",
    label: { text: "Indian Creek", x: 1020, y: 885, anchor: "middle", rotate: -45 },
    start: { x: 991, y: 921 },
    path: "M991 921 L949 921 L897 921 L846 921 L793 921 L732 921 L668 921 L607 921 L497 921 L436 921"
  },
  "sec-district": {
    key: "sec-district",
    label: SEC_DISTRICT_LABEL,
    start: SEC_DISTRICT_POINT,
    path: "M436 921"
  }
};

export function getMapOverlayRoute(startStationId?: string) {
  const exactRoute = startStationId ? MAP_ROUTE_PATHS[startStationId as MapRouteKey] : undefined;

  if (exactRoute) return exactRoute;

  return MAP_ROUTE_PATHS["north-springs"];
}
