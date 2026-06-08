"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * A small camp dog that sits by the fire — idle-bobs, wags its tail, and perks
 * up (scale + faster wag) when you hover it. Decorative personality, not a nav
 * target. Tail wag uses path morphing so there's no SVG transform-origin fuss.
 */
export function CampDog({ reduced }: { reduced: boolean }) {
  const [up, setUp] = useState(false);
  const tailRest = "M30 76 Q15 72 17 59";
  const tailWag = "M30 76 Q13 65 23 54";

  return (
    <motion.div
      className="h-full w-full"
      onPointerEnter={() => setUp(true)}
      onPointerLeave={() => setUp(false)}
      animate={{ y: reduced ? 0 : [0, -2, 0], scale: up ? 1.12 : 1 }}
      transition={{
        y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <ellipse
          cx="50"
          cy="92"
          rx="26"
          ry="5"
          fill="rgb(var(--s-ground-shadow))"
          opacity="0.35"
        />
        {/* tail */}
        <motion.path
          stroke="#b87a40"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          animate={
            reduced
              ? { d: tailRest }
              : { d: [tailRest, tailWag, tailRest] }
          }
          transition={{
            duration: up ? 0.45 : 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* body, sitting */}
        <path d="M30 90 Q24 58 46 56 Q66 56 64 80 L68 90 Z" fill="#c98b4f" />
        {/* front legs */}
        <rect x="49" y="74" width="8" height="18" rx="4" fill="#d8a062" />
        <rect x="59" y="74" width="8" height="18" rx="4" fill="#c98b4f" />
        {/* head */}
        <circle cx="64" cy="44" r="16" fill="#c98b4f" />
        {/* ear */}
        <motion.path
          d="M53 33 Q45 30 49 51 Q57 46 57 36 Z"
          fill="#9a6638"
          animate={{ rotate: up ? -10 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ transformBox: "fill-box", transformOrigin: "70% 10%" }}
        />
        {/* snout + nose */}
        <ellipse cx="78" cy="48" rx="10" ry="7" fill="#e0a866" />
        <circle cx="86" cy="47" r="2.6" fill="#2a1c12" />
        {/* eye */}
        <circle cx="67" cy="42" r="2.2" fill="#2a1c12" />
        {/* collar */}
        <path
          d="M52 56 Q64 64 76 55"
          stroke="rgb(var(--c-pop-coral))"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="64" cy="62" r="2.4" fill="rgb(var(--c-pop-gold))" />
      </svg>
    </motion.div>
  );
}
