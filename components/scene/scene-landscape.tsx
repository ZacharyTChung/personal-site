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

      {/* sun + glow */}
      <motion.div
        className="absolute left-[72%] top-[15%] h-[12vw] w-[12vw] max-h-[150px] max-w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: skyX,
          y: sunY,
          background:
            "radial-gradient(circle at 45% 40%, #fff3d0 0%, rgb(var(--s-sun)) 45%, rgba(255,226,150,0.2) 75%, transparent 100%)",
          boxShadow: "0 0 90px rgba(255,226,150,0.55)",
        }}
        animate={animate ? { scale: [1, 1.04, 1] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* stars */}
      <motion.div className="absolute inset-x-0 top-0 h-[50%]" style={{ x: skyX }}>
        {[...Array(36)].map((_, i) => {
          const x = (i * 53) % 100;
          const y = (i * 29) % 48;
          const s = (i % 3) + 1;
          return (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: s,
                height: s,
                background: "rgba(255,244,214,0.9)",
              }}
              animate={animate ? { opacity: [0.2, 0.9, 0.2] } : undefined}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: (i % 7) * 0.4,
              }}
            />
          );
        })}
      </motion.div>

      {/* warm firelight / last-light glow on the horizon */}
      <div
        className="absolute inset-x-0 top-[40%] h-[30%]"
        style={{
          background:
            "radial-gradient(ellipse 65% 100% at 50% 100%, rgb(var(--s-sun) / 0.30), transparent 72%)",
        }}
      />

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
        {/* warm sun reflection on the water */}
        <rect
          x="69"
          y="56"
          width="6"
          height="8"
          fill="rgb(var(--s-sun))"
          opacity="0.4"
        />
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
        <path
          d="M0 66 C20 62 38 64 50 63 C66 62 82 65 100 63 L100 100 L0 100 Z"
          fill="rgb(var(--s-ground))"
        />
        {/* faint firelight rim on the bank */}
        <path
          d="M0 66 C20 62 38 64 50 63 C66 62 82 65 100 63"
          fill="none"
          stroke="rgb(var(--s-sun))"
          strokeWidth="0.8"
          opacity="0.18"
        />
        {/* soft contour shadow */}
        <path
          d="M0 80 C28 76 60 82 100 78 L100 100 L0 100 Z"
          fill="rgb(var(--s-ground-shadow))"
          opacity="0.45"
        />
      </motion.svg>

      {/* dissolve the bright scene into the dark site below */}
      <div className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-transparent to-background" />
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
