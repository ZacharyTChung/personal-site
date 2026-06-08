/**
 * A little stretch of hiking trail between two sections — a winding dashed
 * path with footprints, flanked by terrain doodles that change as you descend
 * the page (forest, meadow, desert, rocky, alpine, river). Decorative.
 */

type Terrain = "forest" | "meadow" | "desert" | "rocky" | "alpine" | "river";

const INK = "rgb(var(--c-fg))";

function TerrainDoodle({ terrain }: { terrain: Terrain }) {
  switch (terrain) {
    case "meadow":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          {([["--c-pop-coral", 30], ["--c-pop-gold", 52], ["--c-pop-pink", 72]] as const).map(
            ([c, x], i) => (
              <g key={i}>
                <path d={`M${x} 96 L${x} 70`} stroke="rgb(var(--s-ground-shadow))" strokeWidth="3" strokeLinecap="round" />
                <circle cx={x} cy="64" r="8" fill={`rgb(var(${c}))`} stroke={INK} strokeWidth="2.4" />
                <circle cx={x} cy="64" r="2.5" fill="rgb(var(--s-sun))" />
              </g>
            ),
          )}
        </svg>
      );
    case "desert":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
            <path
              d="M50 96 L50 44 M50 66 L34 66 L34 50 M50 58 L66 58 L66 40"
              fill="none"
              stroke="rgb(var(--s-pine-near))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path d="M50 96 L50 44 M50 66 L34 66 L34 50 M50 58 L66 58 L66 40" fill="none" strokeWidth="2.4" />
          </g>
        </svg>
      );
    case "rocky":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <g stroke={INK} strokeWidth="2.4">
            <ellipse cx="44" cy="80" rx="30" ry="18" fill="rgb(var(--s-ground-shadow))" />
            <ellipse cx="74" cy="86" rx="20" ry="12" fill="rgb(var(--s-ground-shadow))" />
          </g>
        </svg>
      );
    case "alpine":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
            <path d="M14 96 L50 30 L86 96 Z" fill="rgb(var(--s-water-deep))" />
            <path d="M36 56 L50 30 L64 56 L55 62 L50 54 L44 62 Z" fill="#ffffff" stroke="none" />
          </g>
        </svg>
      );
    case "river":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <g stroke="rgb(var(--s-water))" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M8 64 q 12 -8 24 0 t 24 0 t 24 0 t 12 0" />
            <path d="M8 80 q 12 -8 24 0 t 24 0 t 24 0 t 12 0" opacity="0.6" />
          </g>
        </svg>
      );
    default: // forest
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
          <g stroke={INK} strokeWidth="2.6" strokeLinejoin="round">
            <rect x="46" y="78" width="8" height="18" fill="#5a3d28" />
            <path d="M50 18 L28 60 L72 60 Z" fill="rgb(var(--s-pine-mid))" />
            <path d="M50 42 L24 86 L76 86 Z" fill="rgb(var(--s-pine-near))" />
          </g>
        </svg>
      );
  }
}

const FEET: [number, number, number][] = [
  [52, 28, -24],
  [42, 70, 14],
  [72, 110, -16],
  [62, 150, 10],
  [56, 184, -22],
];

export function TrailDivider({ terrain = "forest" }: { terrain?: Terrain }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-28 w-full overflow-hidden bg-background md:h-32"
    >
      {/* winding trail down the middle (chains with the next divider) */}
      <svg
        viewBox="0 0 120 200"
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-0 h-full -translate-x-1/2"
      >
        <path
          d="M60 -12 C 18 60, 102 130, 60 212"
          fill="none"
          stroke="rgb(var(--s-ground-shadow))"
          strokeWidth="6"
          strokeDasharray="2 20"
          strokeLinecap="round"
          opacity="0.55"
        />
        {FEET.map(([x, y, r], i) => (
          <g
            key={i}
            transform={`rotate(${r} ${x} ${y})`}
            fill={INK}
            opacity="0.3"
          >
            <ellipse cx={x - 4} cy={y} rx="2.6" ry="4.4" />
            <ellipse cx={x + 4} cy={y + 6} rx="2.6" ry="4.4" />
          </g>
        ))}
      </svg>

      {/* terrain on either side */}
      <div className="absolute bottom-0 left-[10%] h-16 w-16 md:left-[16%]">
        <TerrainDoodle terrain={terrain} />
      </div>
      <div className="absolute bottom-0 right-[10%] h-16 w-16 -scale-x-100 md:right-[16%]">
        <TerrainDoodle terrain={terrain} />
      </div>
    </div>
  );
}
