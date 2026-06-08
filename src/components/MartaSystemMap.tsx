"use client";

import {
  MARTA_BACKGROUND_PATHS,
  MARTA_LINE_COLORS,
  MARTA_LINE_DRAW_ORDER,
  MARTA_LINE_LABELS,
  MARTA_LINE_LABEL_POSITIONS,
  MARTA_SCHEMATIC_VIEWBOX,
  MARTA_SEGMENTS,
  MARTA_STATIONS,
  type MartaSchematicStation
} from "@/data/martaSchematic";

type MartaSystemMapProps = {
  embedded?: boolean;
};

function stationPoint(station: MartaSchematicStation) {
  const radius = station.dotSize ?? (station.isTransfer ? 9.5 : station.major ? 8.4 : 6.2);
  const strokeWidth = station.isTransfer && radius > 12 ? 5 : station.isTransfer || station.major ? 3.4 : 2.2;

  return (
    <circle
      key={`station-${station.id}`}
      cx={station.x}
      cy={station.y}
      r={radius}
      fill="#f4f5f6"
      stroke="#111827"
      strokeWidth={strokeWidth}
    />
  );
}

function stationLabel(station: MartaSchematicStation) {
  if (station.labelVisible === false) return null;

  const x = station.labelX;
  const y = station.labelY;
  const fontSize = station.labelSize ?? 13;
  const lines = station.labelLines ?? [station.name];
  const fontWeight = station.labelWeight ?? (station.labelPriority === 1 ? 800 : 700);

  return (
    <text
      key={`label-${station.id}`}
      x={x}
      y={y}
      fill="#111827"
      fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      fontSize={fontSize}
      fontWeight={fontWeight}
      paintOrder="stroke fill"
      stroke="#f4f5f6"
      strokeLinejoin="round"
      strokeWidth={station.labelPriority === 1 ? 5 : 4}
      textAnchor={station.labelAnchor ?? "start"}
      transform={station.labelRotate ? `rotate(${station.labelRotate} ${x} ${y})` : undefined}
    >
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 0 : fontSize + 3}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function lineLabel({ anchor = "start", line, x, y }: (typeof MARTA_LINE_LABEL_POSITIONS)[number]) {
  return (
    <text
      key={`line-label-${line}`}
      x={x}
      y={y}
      fill={MARTA_LINE_COLORS[line]}
      fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      fontSize={11.5}
      fontWeight={900}
      paintOrder="stroke fill"
      stroke="#f4f5f6"
      strokeLinejoin="round"
      strokeWidth={4}
      textAnchor={anchor}
    >
      {MARTA_LINE_LABELS[line]}
    </text>
  );
}

function StaticMartaSvg() {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-black/10 bg-[#f4f5f6] p-1.5 shadow-inner sm:p-2">
      <div className="mx-auto aspect-[9/12] w-full bg-[#f4f5f6]">
        <svg
          aria-label="Static full MARTA rail map skeleton"
          className="block h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          viewBox={MARTA_SCHEMATIC_VIEWBOX}
        >
          <rect x="135" y="20" width="805" height="940" fill="#f4f5f6" rx="28" />

          {MARTA_BACKGROUND_PATHS.map((path) => (
            <g key={path.id}>
              <path d={path.d} fill="none" stroke="#d1d5db" strokeLinecap="round" strokeLinejoin="round" strokeWidth={8} opacity={0.48} />
              {path.label ? (
                <text
                  x={path.label.x}
                  y={path.label.y}
                  fill="#9ca3af"
                  fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
                  fontSize={13}
                  fontWeight={600}
                  opacity={0.75}
                  textAnchor="middle"
                  transform={path.label.rotate ? `rotate(${path.label.rotate} ${path.label.x} ${path.label.y})` : undefined}
                >
                  {path.label.text}
                </text>
              ) : null}
            </g>
          ))}

          {MARTA_LINE_LABEL_POSITIONS.map(lineLabel)}

          {MARTA_LINE_DRAW_ORDER.flatMap((line) =>
            MARTA_SEGMENTS.filter((segment) => segment.line === line).map((segment) => (
              <path
                key={segment.id}
                d={segment.d}
                fill="none"
                stroke={MARTA_LINE_COLORS[segment.line]}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={9}
              />
            ))
          )}

          {MARTA_STATIONS.map(stationPoint)}
          {MARTA_STATIONS.map(stationLabel)}
        </svg>
      </div>
    </div>
  );
}

export function MartaSystemMap({ embedded = false }: MartaSystemMapProps) {
  const content = (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-[#f0f6fc]">Rail Map</h2>
      </div>
      <StaticMartaSvg />
    </>
  );

  if (embedded) {
    return (
      <section aria-label="Rail map" className="mt-4 border-t border-white/10 pt-4" id="full-rail-map">
        {content}
      </section>
    );
  }

  return (
    <section aria-label="Rail map" className="rounded-[1.75rem] border border-white/10 bg-[#161b27] p-4 shadow-sm" id="full-rail-map">
      {content}
    </section>
  );
}
