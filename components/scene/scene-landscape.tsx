"use client";

import { motion, type MotionValue } from "framer-motion";

interface SceneLandscapeProps {
  skyX: MotionValue<number>;
  farX: MotionValue<number>;
  midX: MotionValue<number>;
  waterX: MotionValue<number>;
  groundX: MotionValue<number>;
  sunY: MotionValue<number>;
  /** false when reduced-motion / touch — disables ambient loops */
  animate: boolean;
}

/**
 * Non-interactive parallax backdrop for the clearing, forked in structure from
 * components/ui/horizon-scene.tsx. Layers are stacked back-to-front; each front
 * plane fills downward and occludes the lower part of the plane behind it, so
 * only the serrated top edges show — that's what builds the forest depth.
 *
 * The whole subtree is aria-hidden + pointer-events-none; only the hotspot
 * buttons (rendered by the parent) are interactive.
 */
export function SceneLandscape({
  skyX,
  farX,
  midX,
  waterX,
  groundX,
  sunY,
  animate,
}: SceneLandscapeProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(var(--s-sky-top)) 0%, rgb(var(--s-sky-bottom)) 70%)",
        }}
      />

      {/* SUN (light mode) — disc + rays in one SVG, always concentric */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute left-[74%] top-[15%] h-[26vw] w-[26vw] max-h-[290px] max-w-[290px] -translate-x-1/2 -translate-y-1/2 dark:hidden"
        style={{ x: skyX, y: sunY }}
        animate={animate ? { rotate: 360 } : undefined}
        transition={{ duration: 170, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <radialGradient id="sun-disc" cx="42%" cy="38%" r="65%">
            <stop offset="0" stopColor="#fff6da" />
            <stop offset="0.55" stopColor="rgb(var(--s-sun))" />
            <stop offset="1" stopColor="#f1b657" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="30" fill="rgb(var(--s-sun))" opacity="0.16" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 25}
              y1={50 + Math.sin(a) * 25}
              x2={50 + Math.cos(a) * 33}
              y2={50 + Math.sin(a) * 33}
              stroke="rgb(var(--s-sun))"
              strokeWidth="2.1"
              strokeLinecap="round"
              opacity="0.6"
            />
          );
        })}
        <circle cx="50" cy="50" r="17" fill="url(#sun-disc)" />
      </motion.svg>

      {/* MOON (dark mode) */}
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute left-[74%] top-[15%] hidden h-[22vw] w-[22vw] max-h-[230px] max-w-[230px] -translate-x-1/2 -translate-y-1/2 dark:block"
        style={{ x: skyX, y: sunY }}
      >
        <circle cx="50" cy="50" r="30" fill="rgba(214,226,242,0.22)" />
        <circle cx="50" cy="50" r="18" fill="#e9eef6" />
        <circle cx="44" cy="45" r="2.6" fill="#0d1426" opacity="0.1" />
        <circle cx="56" cy="52" r="3.4" fill="#0d1426" opacity="0.1" />
        <circle cx="49" cy="59" r="2" fill="#0d1426" opacity="0.1" />
      </motion.svg>

      {/* drifting clouds */}
      <motion.svg
        viewBox="0 0 600 200"
        className="absolute left-0 top-[12%] h-[14%] w-[160%]"
        style={{ x: farX }}
        animate={animate ? { translateX: ["-6%", "5%", "-6%"] } : undefined}
        transition={{ duration: 75, repeat: Infinity, ease: "easeInOut" }}
      >
        <g fill="#ffffff">
          <ellipse cx="90" cy="120" rx="60" ry="24" />
          <ellipse cx="140" cy="128" rx="48" ry="20" />
          <ellipse cx="320" cy="100" rx="70" ry="26" />
          <ellipse cx="375" cy="110" rx="52" ry="20" />
          <ellipse cx="520" cy="125" rx="46" ry="18" />
        </g>
      </motion.svg>

      {/* a couple of birds */}
      <motion.svg
        viewBox="0 0 100 40"
        className="absolute left-[22%] top-[19%] h-[5%] w-[14%]"
        style={{ x: skyX }}
        animate={animate ? { y: [0, -5, 0], x: [0, 10, 0] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M6 22 Q12 13 18 22 Q24 13 30 22" stroke="#2a4a3c" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M42 15 Q47 8 52 15 Q57 8 62 15" stroke="#2a4a3c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </motion.svg>

      {/* far treeline */}
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ x: farX }}
      >
        <path
          d="M0 50 L5 40 L10 50 L16 38 L22 50 L28 42 L34 50 L41 37 L47 50 L53 41 L60 50 L66 39 L72 50 L79 42 L85 50 L91 38 L97 50 L100 45 L100 100 L0 100 Z"
          fill="rgb(var(--s-pine-far))"
          opacity="0.82"
        />
      </motion.svg>

      {/* mid forest */}
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ x: midX }}
      >
        <path
          d="M0 58 L6 47 L12 58 L19 45 L26 58 L33 48 L40 58 L48 44 L55 58 L62 47 L70 58 L77 46 L84 58 L91 48 L97 58 L100 53 L100 100 L0 100 Z"
          fill="rgb(var(--s-pine-mid))"
        />
      </motion.svg>

      {/* atmospheric haze pooling at the treeline so distant hills recede */}
      <div
        className="absolute inset-x-0 top-[40%] h-[20%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgb(var(--s-sky-bottom) / 0.6))",
        }}
      />

      {/* lake */}
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ x: waterX }}
      >
        <defs>
          <linearGradient id="lake-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--s-water))" />
            <stop offset="1" stopColor="rgb(var(--s-water-deep))" />
          </linearGradient>
        </defs>
        <rect x="0" y="56" width="100" height="44" fill="url(#lake-water)" />
        {/* ripples */}
        {[
          [58, 22, 60],
          [60, 40, 30],
          [61, 12, 40],
        ].map(([y, x, w], i) => (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={w}
            height="0.6"
            rx="0.3"
            fill="rgba(255,255,255,0.5)"
            animate={animate ? { opacity: [0.15, 0.5, 0.15] } : undefined}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
        {/* bright shoreline */}
        <rect x="0" y="56" width="100" height="2" fill="rgba(255,255,255,0.16)" />
        {/* sun / moon reflection shimmer */}
        {[
          [59, 7],
          [61, 5],
          [63, 3.4],
          [65, 2],
        ].map(([cy, rx], i) => (
          <ellipse
            key={`refl${i}`}
            cx="74"
            cy={cy}
            rx={rx}
            ry="0.7"
            fill="rgba(255,255,255,0.4)"
          />
        ))}
      </motion.svg>

      {/* near framing pines (left + right), parallax with the ground */}
      <motion.div
        className="absolute bottom-[8%] left-[-2%] h-[55%] w-[18%]"
        style={{ x: groundX }}
      >
        <NearPine />
      </motion.div>
      <motion.div
        className="absolute bottom-[6%] right-[-3%] h-[62%] w-[20%] scale-x-[-1]"
        style={{ x: groundX }}
      >
        <NearPine />
      </motion.div>

      {/* foreground grass bank */}
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ x: groundX }}
      >
        <defs>
          <linearGradient id="ground-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--s-ground))" />
            <stop offset="1" stopColor="rgb(var(--s-ground-shadow))" />
          </linearGradient>
        </defs>
        <path
          d="M0 66 C20 62 38 64 50 63 C66 62 82 65 100 63 L100 100 L0 100 Z"
          fill="url(#ground-g)"
        />
        {/* sunlit grass rim */}
        <path
          d="M0 66 C20 62 38 64 50 63 C66 62 82 65 100 63"
          fill="none"
          stroke="#dcffe4"
          strokeWidth="0.8"
          opacity="0.5"
        />
      </motion.svg>

      {/* foreground doodles — grass tufts, little flowers, a winding trail */}
      <motion.svg
        viewBox="0 0 1200 240"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[44%] w-full"
        style={{ x: groundX }}
      >
        {/* trail heading down out of the clearing — starts on the grass
            (below the water) and connects to the page trail */}
        <path
          d="M600 96 C 556 150, 660 200, 600 252"
          fill="none"
          stroke="rgb(var(--c-trail) / 0.5)"
          strokeWidth="34"
          strokeLinecap="round"
        />
        <path
          d="M600 96 C 556 150, 660 200, 600 252"
          fill="none"
          stroke="rgb(var(--c-fg) / 0.26)"
          strokeWidth="3"
          strokeDasharray="4 22"
          strokeLinecap="round"
        />
        {/* grass tufts */}
        {Array.from({ length: 26 }).map((_, i) => {
          const x = 20 + i * 46 + ((i * 37) % 26);
          const y = 150 + ((i * 53) % 72);
          return (
            <g
              key={`g${i}`}
              stroke="rgb(var(--s-ground-shadow))"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.6"
            >
              <path d={`M${x} ${y} q -3 -10 -5 -15`} />
              <path d={`M${x} ${y} q 0 -12 0 -17`} />
              <path d={`M${x} ${y} q 3 -10 5 -15`} />
            </g>
          );
        })}
      </motion.svg>

      {/* paper-grain texture over the whole scene */}
      <div className="grain-tex pointer-events-none absolute inset-0 opacity-50 mix-blend-soft-light" />

      {/* fade the scene into the section color-wash below (light green in
          light mode, dark green at night) so the seam blends */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-transparent to-[#cfe0c8] dark:to-[#1c2620]" />
    </div>
  );
}

function NearPine() {
  return (
    <svg
      viewBox="0 0 100 200"
      preserveAspectRatio="xMidYMax meet"
      className="h-full w-full overflow-visible"
      aria-hidden="true"
    >
      {/* trunk */}
      <rect x="44" y="150" width="12" height="50" fill="#3a2a1c" />
      {/* stacked canopy tiers */}
      <path d="M50 18 L20 78 L80 78 Z" fill="rgb(var(--s-pine-near))" />
      <path d="M50 50 L14 116 L86 116 Z" fill="rgb(var(--s-pine-near))" />
      <path d="M50 86 L8 158 L92 158 Z" fill="rgb(var(--s-pine-near))" />
    </svg>
  );
}
