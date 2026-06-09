import { cn } from "@/lib/utils";

/**
 * Six flat-vector "national-park-poster" objects for the clearing.
 * All share a 0 0 100 100 viewBox and a soft ground shadow so they read as
 * sitting on the grass. Every <linearGradient>/<radialGradient> id is
 * namespaced per object (e.g. `tent-roof`) because all six render on one page
 * — unprefixed ids would collide and break fills.
 *
 * Decorative only: each <svg> is aria-hidden; the accessible name comes from
 * the wrapping <button> in hotspot.tsx.
 */

type ObjProps = { className?: string };

const SVG_BASE = "h-full w-full overflow-visible";

function GroundShadow({ rx = 30 }: { rx?: number }) {
  return (
    <ellipse
      cx="50"
      cy="92"
      rx={rx}
      ry="5"
      fill="rgb(var(--s-ground-shadow))"
      stroke="none"
      opacity="0.4"
    />
  );
}

export function TentSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="tent-fabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e29a68" />
          <stop offset="1" stopColor="#c9743f" />
        </linearGradient>
      </defs>
      <GroundShadow rx={34} />
      {/* guy lines */}
      <path d="M22 82 L9 88" stroke="#8a5a3a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M78 82 L91 88" stroke="#8a5a3a" strokeWidth="1.2" strokeLinecap="round" />
      {/* main A-frame */}
      <path d="M50 20 L17 82 L83 82 Z" fill="url(#tent-fabric)" />
      {/* shaded right slope */}
      <path d="M50 20 L50 82 L83 82 Z" fill="#000000" opacity="0.12" />
      {/* center fold highlight */}
      <path d="M50 20 L50 82" stroke="#f4cf8a" strokeWidth="0.8" opacity="0.5" />
      {/* door opening */}
      <path d="M50 38 L40 82 L60 82 Z" fill="#5a3d2b" />
      <path d="M50 38 L45 82" stroke="#3a261a" strokeWidth="1" opacity="0.7" />
      {/* ridge pole tip + pennant */}
      <path d="M50 20 L50 13" stroke="#7a5436" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M50 13 L58 15 L50 18 Z" fill="rgb(var(--s-sun))" />
    </svg>
  );
}

export function LaptopLogSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="laptop-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--s-sun))" />
          <stop offset="1" stopColor="#e0a85b" />
        </linearGradient>
        <linearGradient id="laptop-log" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a6638" />
          <stop offset="1" stopColor="#74492a" />
        </linearGradient>
      </defs>
      <GroundShadow rx={36} />
      {/* log lying horizontally */}
      <rect x="14" y="62" width="72" height="20" rx="10" fill="url(#laptop-log)" />
      {/* log end cap with rings */}
      <ellipse cx="18" cy="72" rx="6" ry="10" fill="#a9744a" />
      <ellipse cx="18" cy="72" rx="3.4" ry="6" fill="none" stroke="#6b4426" strokeWidth="0.9" />
      <ellipse cx="18" cy="72" rx="1.3" ry="2.4" fill="#6b4426" />
      {/* laptop base */}
      <path d="M32 60 L72 60 L78 66 L38 66 Z" fill="#3a3f45" />
      {/* laptop screen */}
      <path d="M36 60 L39 38 L67 38 L72 60 Z" fill="#23262b" />
      <path d="M40 57 L42.5 41 L64 41 L67 57 Z" fill="url(#laptop-screen)" />
      {/* glow line on screen */}
      <path d="M44 46 L60 46 M44 50 L57 50" stroke="#fff5dd" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
    </svg>
  );
}

export function BackpackSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pack-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#479182" />
          <stop offset="1" stopColor="#356a5d" />
        </linearGradient>
      </defs>
      <GroundShadow rx={26} />
      {/* shoulder straps behind */}
      <path d="M38 30 C30 44 30 64 36 80" stroke="#2c5a4f" strokeWidth="5" strokeLinecap="round" />
      <path d="M62 30 C70 44 70 64 64 80" stroke="#2c5a4f" strokeWidth="5" strokeLinecap="round" />
      {/* body */}
      <rect x="30" y="30" width="40" height="54" rx="14" fill="url(#pack-body)" />
      {/* top lid */}
      <path d="M30 44 C30 35 37 30 50 30 C63 30 70 35 70 44 L70 47 L30 47 Z" fill="#2f6256" />
      {/* lid buckle */}
      <rect x="46" y="40" width="8" height="6" rx="1.5" fill="rgb(var(--s-sun))" />
      {/* front pocket */}
      <rect x="38" y="58" width="24" height="22" rx="6" fill="#52a08f" />
      <path d="M38 64 L62 64" stroke="#2f6256" strokeWidth="1.4" />
      {/* pocket buckle */}
      <rect x="47" y="61" width="6" height="5" rx="1.2" fill="rgb(var(--s-sun))" />
      {/* top grab handle */}
      <path d="M44 30 C44 24 56 24 56 30" stroke="#2c5a4f" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function SoccerBallSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <GroundShadow rx={22} />
      {/* ball */}
      <circle cx="50" cy="50" r="30" fill="#f6f6f1" stroke="#1f2937" strokeWidth="2" />
      {/* center pentagon */}
      <path d="M50 38 L60 45 L56 57 L44 57 L40 45 Z" fill="#1f2937" />
      {/* outer partial pentagons */}
      <path d="M50 20 L57 26 L50 38 L40 45 L31 33 Z" fill="#1f2937" opacity="0.12" />
      {/* seams radiating from the center pentagon */}
      <path
        d="M50 38 L50 26 M60 45 L71 40 M56 57 L64 68 M44 57 L36 68 M40 45 L29 40"
        stroke="#1f2937"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* small dark caps at the seam ends */}
      <circle cx="50" cy="24" r="2.4" fill="#1f2937" />
      <circle cx="72" cy="39" r="2.4" fill="#1f2937" />
      <circle cx="65" cy="69" r="2.4" fill="#1f2937" />
      <circle cx="35" cy="69" r="2.4" fill="#1f2937" />
      <circle cx="28" cy="39" r="2.4" fill="#1f2937" />
    </svg>
  );
}

export function BikeSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <GroundShadow rx={38} />
      <g transform="rotate(-4 50 64)">
        {/* wheels */}
        {[26, 74].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="64" r="16" fill="none" stroke="#1f2226" strokeWidth="3.5" />
            <circle cx={cx} cy="64" r="12.5" fill="none" stroke="#4a4f55" strokeWidth="1.2" />
            <circle cx={cx} cy="64" r="2" fill="#4a4f55" />
            <path
              d={`M${cx} 64 L${cx} 50 M${cx} 64 L${cx + 12} 64 M${cx} 64 L${cx - 12} 64 M${cx} 64 L${cx + 9} 73 M${cx} 64 L${cx - 9} 73`}
              stroke="#4a4f55"
              strokeWidth="0.8"
            />
          </g>
        ))}
        {/* frame */}
        <path
          d="M26 64 L47 62 L40 40 L26 64 M47 62 L66 40 M40 40 L66 40 M47 62 L74 64 M66 40 L74 64"
          stroke="rgb(var(--s-sun))"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        {/* seat */}
        <path d="M35 39 L45 39" stroke="#2f3338" strokeWidth="3.5" strokeLinecap="round" />
        {/* handlebar */}
        <path d="M66 40 L72 35 M70 35 L76 36" stroke="#2f3338" strokeWidth="2.6" strokeLinecap="round" />
        {/* crank */}
        <circle cx="47" cy="62" r="3" fill="#2f3338" />
        <path d="M47 62 L43 67" stroke="#2f3338" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function CampfireSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fire-outer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgb(var(--s-sun))" />
          <stop offset="1" stopColor="#e8732f" />
        </linearGradient>
      </defs>
      <GroundShadow rx={30} />
      {/* stones around the pit */}
      {[
        [30, 80],
        [42, 84],
        [56, 84],
        [70, 80],
      ].map(([cx, cy]) => (
        <ellipse key={cx} cx={cx} cy={cy} rx="6" ry="4" fill="#6b7280" />
      ))}
      {/* crossed logs */}
      <rect x="28" y="74" width="44" height="7" rx="3.5" fill="#7a4a2c" transform="rotate(12 50 78)" />
      <rect x="28" y="74" width="44" height="7" rx="3.5" fill="#93582f" transform="rotate(-12 50 78)" />
      {/* flames */}
      <path
        d="M50 34 C40 50 38 60 44 70 C40 64 40 56 44 50 C44 60 48 64 52 66 C58 60 56 50 50 34 Z"
        fill="url(#fire-outer)"
      />
      <path
        d="M50 46 C46 54 46 62 50 67 C54 62 54 54 50 46 Z"
        fill="#f6c560"
      />
      {/* mug beside the fire */}
      <rect x="74" y="72" width="13" height="12" rx="2.5" fill="#c0563b" />
      <path d="M87 75 C92 75 92 81 87 81" stroke="#c0563b" strokeWidth="2.4" fill="none" />
      <path d="M77 70 C76 67 79 66 78 63" stroke="#fff" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function FlagSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flag-pennant" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgb(var(--s-sun))" />
          <stop offset="1" stopColor="#e8a23f" />
        </linearGradient>
      </defs>
      <GroundShadow rx={16} />
      {/* small cairn the flag is planted in */}
      <ellipse cx="50" cy="86" rx="13" ry="6" fill="#5b5750" />
      <circle cx="44" cy="83" r="4" fill="#6b6760" />
      <circle cx="56" cy="83" r="4.5" fill="#56524b" />
      {/* pole */}
      <rect x="48.5" y="16" width="3" height="70" rx="1.5" fill="#6b5536" />
      <circle cx="50" cy="15" r="3" fill="rgb(var(--c-warm-1))" />
      {/* pennant */}
      <path d="M51.5 19 L82 28 L51.5 41 Z" fill="url(#flag-pennant)" />
      {/* little star */}
      <path
        d="M62 28 L63.4 31 L66.6 31 L64 33 L65 36 L62 34.2 L59 36 L60 33 L57.4 31 L60.6 31 Z"
        fill="#3a2616"
        opacity="0.7"
      />
    </svg>
  );
}

export function GuitarSVG({ className }: ObjProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(SVG_BASE, className)}
      fill="none"
      stroke="rgb(var(--c-fg))"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <GroundShadow rx={22} />
      <g transform="rotate(18 50 54)">
        {/* body */}
        <ellipse cx="50" cy="70" rx="20" ry="22" fill="#9a6638" />
        <ellipse cx="50" cy="48" rx="14" ry="15" fill="#9a6638" />
        <ellipse cx="50" cy="70" rx="20" ry="22" fill="none" stroke="#74492a" strokeWidth="1.6" />
        {/* sound hole */}
        <circle cx="50" cy="58" r="6.5" fill="#3a2616" />
        <circle cx="50" cy="58" r="6.5" fill="none" stroke="rgb(var(--s-sun))" strokeWidth="1" />
        {/* bridge */}
        <rect x="43" y="76" width="14" height="3.2" rx="1.4" fill="#3a2616" />
        {/* neck + fretboard */}
        <rect x="45.5" y="6" width="9" height="40" rx="1" fill="#5a3d28" />
        <rect x="47" y="6" width="6" height="40" fill="#3a2616" />
        {/* headstock */}
        <rect x="43.5" y="1" width="13" height="9" rx="2" fill="#5a3d28" />
        {/* strings */}
        <path d="M48 9 L48 76 M52 9 L52 76" stroke="#d8c8a8" strokeWidth="0.5" opacity="0.6" />
      </g>
    </svg>
  );
}
