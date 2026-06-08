export type MartaLineId = "red" | "gold" | "blue" | "green";

export type TextAnchor = "start" | "middle" | "end";

export type MartaSchematicStation = {
  id: string;
  name: string;
  x: number;
  y: number;
  lines: MartaLineId[];
  major?: boolean;
  isTransfer?: boolean;
  dotSize?: number;
  labelX: number;
  labelY: number;
  labelAnchor?: TextAnchor;
  labelRotate?: number;
  labelVisible?: boolean;
  labelPriority?: 1 | 2 | 3;
  labelSize?: number;
  labelWeight?: number;
  labelLines?: string[];
};

export type MartaSchematicSegment = {
  id: string;
  line: MartaLineId;
  d: string;
};

export type MartaLineLabel = {
  line: MartaLineId;
  x: number;
  y: number;
  anchor?: TextAnchor;
};

export type MartaBackgroundPath = {
  id: string;
  d: string;
  label?: {
    text: string;
    x: number;
    y: number;
    rotate?: number;
  };
};

export const MARTA_SCHEMATIC_VIEWBOX = "135 20 805 940";

export const MARTA_LINE_COLORS: Record<MartaLineId, string> = {
  red: "#E31837",
  gold: "#FDB913",
  blue: "#0072CE",
  green: "#009A44"
};

export const MARTA_LINE_LABELS: Record<MartaLineId, string> = {
  red: "Red Line",
  gold: "Gold Line",
  blue: "Blue Line",
  green: "Green Line"
};

export const MARTA_LINE_DRAW_ORDER: MartaLineId[] = ["blue", "green", "gold", "red"];

export const MARTA_LINE_LABEL_POSITIONS: MartaLineLabel[] = [
  { line: "red", x: 504, y: 38, anchor: "end" },
  { line: "gold", x: 704, y: 194, anchor: "start" },
  { line: "green", x: 348, y: 552, anchor: "start" },
  { line: "blue", x: 160, y: 584, anchor: "start" }
];

export const MARTA_BACKGROUND_PATHS: MartaBackgroundPath[] = [
  {
    id: "ga-400",
    d: "M495 0 L495 230",
    label: { text: "GA-400", x: 482, y: 116, rotate: -90 }
  },
  {
    id: "i-85",
    d: "M980 55 C880 160 780 260 665 395",
    label: { text: "I-85", x: 855, y: 180, rotate: -47 }
  },
  {
    id: "i-75-north",
    d: "M130 120 C235 220 332 330 430 472 C460 512 472 550 472 600",
    label: { text: "I-75", x: 395, y: 430, rotate: 54 }
  },
  {
    id: "i-20-west",
    d: "M20 600 L980 600",
    label: { text: "I-20", x: 36, y: 591 }
  },
  {
    id: "i-20-east",
    d: "M530 646 C628 646 690 642 738 690 C778 728 788 760 842 760 L990 760",
    label: { text: "I-20", x: 760, y: 687, rotate: 45 }
  },
  {
    id: "i-166",
    d: "M25 865 L135 865 C180 865 182 812 232 812 L500 812",
    label: { text: "I-166", x: 145, y: 838, rotate: -45 }
  },
  {
    id: "i-75-south",
    d: "M720 960 C690 872 632 828 572 798",
    label: { text: "I-75", x: 700, y: 908, rotate: -86 }
  }
];

export const MARTA_STATIONS: MartaSchematicStation[] = [
  {
    id: "north-springs",
    name: "North Springs",
    x: 530,
    y: 40,
    lines: ["red"],
    major: true,
    dotSize: 8.8,
    labelX: 558,
    labelY: 45,
    labelVisible: true,
    labelPriority: 1,
    labelSize: 14,
    labelWeight: 800
  },
  {
    id: "sandy-springs",
    name: "Sandy Springs",
    x: 530,
    y: 95,
    lines: ["red"],
    labelX: 554,
    labelY: 101,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "dunwoody",
    name: "Dunwoody",
    x: 530,
    y: 145,
    lines: ["red"],
    labelX: 554,
    labelY: 151,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "medical-center",
    name: "Medical Center",
    x: 530,
    y: 210,
    lines: ["red"],
    major: true,
    dotSize: 8.6,
    labelX: 500,
    labelY: 215,
    labelAnchor: "end",
    labelVisible: true,
    labelPriority: 2,
    labelSize: 10.5,
    labelWeight: 700
  },
  {
    id: "buckhead",
    name: "Buckhead",
    x: 530,
    y: 285,
    lines: ["red"],
    major: true,
    dotSize: 8.6,
    labelX: 500,
    labelY: 290,
    labelAnchor: "end",
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "doraville",
    name: "Doraville",
    x: 700,
    y: 210,
    lines: ["gold"],
    major: true,
    dotSize: 8.8,
    labelX: 726,
    labelY: 214,
    labelVisible: true,
    labelPriority: 1,
    labelSize: 14,
    labelWeight: 800
  },
  {
    id: "chamblee",
    name: "Chamblee",
    x: 670,
    y: 245,
    lines: ["gold"],
    labelX: 694,
    labelY: 249,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "brookhaven-oglethorpe",
    name: "Brookhaven/Oglethorpe",
    x: 645,
    y: 280,
    lines: ["gold"],
    labelX: 671,
    labelY: 284,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "lenox",
    name: "Lenox",
    x: 620,
    y: 315,
    lines: ["gold"],
    labelX: 644,
    labelY: 319,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "lindbergh-center",
    name: "Lindbergh Center",
    x: 580,
    y: 365,
    lines: ["red", "gold"],
    major: true,
    isTransfer: true,
    dotSize: 9.6,
    labelX: 615,
    labelY: 368,
    labelVisible: true,
    labelPriority: 1,
    labelSize: 14,
    labelWeight: 800
  },
  {
    id: "arts-center",
    name: "Arts Center",
    x: 530,
    y: 430,
    lines: ["red", "gold"],
    labelX: 496,
    labelY: 434,
    labelAnchor: "end",
    labelVisible: true,
    labelPriority: 1,
    labelSize: 13,
    labelWeight: 800
  },
  {
    id: "midtown",
    name: "Midtown",
    x: 530,
    y: 470,
    lines: ["red", "gold"],
    labelX: 496,
    labelY: 474,
    labelAnchor: "end",
    labelVisible: true,
    labelPriority: 1,
    labelSize: 13,
    labelWeight: 800
  },
  {
    id: "north-avenue",
    name: "North Avenue",
    x: 530,
    y: 510,
    lines: ["red", "gold"],
    labelX: 496,
    labelY: 514,
    labelAnchor: "end",
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "civic-center",
    name: "Civic Center",
    x: 530,
    y: 538,
    lines: ["red", "gold"],
    labelX: 496,
    labelY: 542,
    labelAnchor: "end",
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "peachtree-center",
    name: "Peachtree Center",
    x: 530,
    y: 565,
    lines: ["red", "gold"],
    dotSize: 7.8,
    labelX: 492,
    labelY: 563,
    labelAnchor: "end",
    labelVisible: true,
    labelPriority: 1,
    labelSize: 13,
    labelWeight: 800
  },
  {
    id: "five-points",
    name: "Five Points",
    x: 530,
    y: 600,
    lines: ["red", "gold", "blue", "green"],
    isTransfer: true,
    dotSize: 21,
    labelX: 592,
    labelY: 642,
    labelVisible: true,
    labelPriority: 1,
    labelSize: 14,
    labelWeight: 850
  },
  {
    id: "garnett",
    name: "Garnett",
    x: 530,
    y: 670,
    lines: ["red", "gold"],
    labelX: 576,
    labelY: 690,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "west-end",
    name: "West End",
    x: 530,
    y: 710,
    lines: ["red", "gold"],
    labelX: 568,
    labelY: 714,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "oakland-city",
    name: "Oakland City",
    x: 530,
    y: 750,
    lines: ["red", "gold"],
    labelX: 568,
    labelY: 754,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "lakewood-ft-mcpherson",
    name: "Lakewood/Ft. McPherson",
    x: 530,
    y: 790,
    lines: ["red", "gold"],
    labelX: 568,
    labelY: 794,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10,
    labelLines: ["Lakewood/", "Ft. McPherson"]
  },
  {
    id: "east-point",
    name: "East Point",
    x: 530,
    y: 830,
    lines: ["red", "gold"],
    labelX: 568,
    labelY: 834,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "college-park",
    name: "College Park",
    x: 530,
    y: 870,
    lines: ["red", "gold"],
    labelX: 568,
    labelY: 874,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10.5
  },
  {
    id: "airport",
    name: "Airport",
    x: 530,
    y: 920,
    lines: ["red", "gold"],
    major: true,
    dotSize: 9.2,
    labelX: 562,
    labelY: 926,
    labelVisible: true,
    labelPriority: 1,
    labelSize: 14,
    labelWeight: 800
  },
  {
    id: "hamilton-e-holmes",
    name: "Hamilton E. Holmes",
    x: 160,
    y: 600,
    lines: ["blue"],
    dotSize: 8.5,
    labelX: 174,
    labelY: 650,
    labelAnchor: "start",
    labelRotate: -47,
    labelVisible: true,
    labelPriority: 1,
    labelSize: 13,
    labelWeight: 800
  },
  {
    id: "west-lake",
    name: "West Lake",
    x: 230,
    y: 600,
    lines: ["blue"],
    labelX: 230,
    labelY: 636,
    labelAnchor: "middle",
    labelRotate: -47,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "ashby",
    name: "Ashby",
    x: 300,
    y: 600,
    lines: ["blue", "green"],
    labelX: 300,
    labelY: 636,
    labelAnchor: "middle",
    labelRotate: -47,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "vine-city",
    name: "Vine City",
    x: 400,
    y: 600,
    lines: ["blue", "green"],
    labelX: 386,
    labelY: 578,
    labelAnchor: "end",
    labelVisible: true,
    labelPriority: 1,
    labelSize: 13,
    labelWeight: 800
  },
  {
    id: "sec-district",
    name: "SEC District",
    x: 460,
    y: 600,
    lines: ["blue", "green"],
    major: true,
    dotSize: 8.8,
    labelX: 444,
    labelY: 656,
    labelAnchor: "middle",
    labelVisible: true,
    labelPriority: 1,
    labelSize: 14,
    labelWeight: 850,
    labelLines: ["SEC District", "Stadium access"]
  },
  {
    id: "georgia-state",
    name: "Georgia State",
    x: 585,
    y: 600,
    lines: ["blue", "green"],
    labelX: 604,
    labelY: 536,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "king-memorial",
    name: "King Memorial",
    x: 645,
    y: 600,
    lines: ["blue", "green"],
    labelX: 670,
    labelY: 536,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "inman-park-reynoldstown",
    name: "Inman Park/Reynoldstown",
    x: 705,
    y: 600,
    lines: ["blue", "green"],
    labelX: 736,
    labelY: 536,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 9.5
  },
  {
    id: "edgewood-candler-park",
    name: "Edgewood/Candler Park",
    x: 765,
    y: 600,
    lines: ["blue", "green"],
    labelX: 835,
    labelY: 536,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 9.5
  },
  {
    id: "east-lake",
    name: "East Lake",
    x: 805,
    y: 600,
    lines: ["blue"],
    labelX: 820,
    labelY: 682,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "decatur",
    name: "Decatur",
    x: 845,
    y: 600,
    lines: ["blue"],
    labelX: 865,
    labelY: 682,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "avondale",
    name: "Avondale",
    x: 875,
    y: 600,
    lines: ["blue"],
    labelX: 905,
    labelY: 682,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "kensington",
    name: "Kensington",
    x: 905,
    y: 600,
    lines: ["blue"],
    labelX: 920,
    labelY: 682,
    labelAnchor: "start",
    labelRotate: -50,
    labelVisible: false,
    labelPriority: 3,
    labelSize: 10
  },
  {
    id: "indian-creek",
    name: "Indian Creek",
    x: 930,
    y: 600,
    lines: ["blue"],
    major: true,
    dotSize: 8.5,
    labelX: 924,
    labelY: 580,
    labelAnchor: "end",
    labelVisible: true,
    labelPriority: 1,
    labelSize: 13,
    labelWeight: 800
  },
  {
    id: "bankhead",
    name: "Bankhead",
    x: 330,
    y: 570,
    lines: ["green"],
    dotSize: 8.5,
    labelX: 310,
    labelY: 554,
    labelAnchor: "end",
    labelVisible: true,
    labelPriority: 1,
    labelSize: 13,
    labelWeight: 800
  }
];

export const MARTA_SEGMENTS: MartaSchematicSegment[] = [
  {
    id: "blue-main",
    line: "blue",
    d: "M160 600 L230 600 L300 600 L400 600 L460 600 L530 600 L585 600 L645 600 L705 600 L765 600 L805 600 L845 600 L875 600 L905 600 L930 600"
  },
  {
    id: "green-bankhead-east",
    line: "green",
    d: "M330 570 L400 590 L460 590 L530 590 L585 590 L645 590 L705 590 L765 590"
  },
  {
    id: "gold-north-branch",
    line: "gold",
    d: "M700 210 L670 245 L645 280 L620 315 L580 365 C556 392 544 410 544 430 L544 570 C544 584 538 594 530 600 C538 616 544 642 544 670 L544 870 C544 890 552 904 530 920"
  },
  {
    id: "red-north-south",
    line: "red",
    d: "M530 40 L530 95 L530 145 C530 172 530 190 530 210 L530 285 C530 330 516 350 516 405 L516 570 C516 584 522 594 530 600 C522 616 516 642 516 670 L516 870 C516 892 508 906 530 920"
  }
];
