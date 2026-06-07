"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SceneHotspot } from "./scene-config";

interface HotspotProps {
  hotspot: SceneHotspot;
  /** use the portrait position overrides */
  isMobile: boolean;
  /** disable idle-float + smooth scroll */
  reduced: boolean;
  /** base object width in px (before per-object scale) */
  baseSize: number;
}

export function Hotspot({ hotspot, isMobile, reduced, baseSize }: HotspotProps) {
  const { label, sublabel, targetId, x, y, xMobile, yMobile, scale, Object } =
    hotspot;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = hovered || focused;

  const left = isMobile && xMobile != null ? xMobile : x;
  const top = isMobile && yMobile != null ? yMobile : y;
  const size = baseSize * scale;

  const navigate = () => {
    const target = document.querySelector(targetId);
    if (!target) return;
    target.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    history.pushState(null, "", targetId);
  };

  return (
    <button
      type="button"
      aria-label={`${label} — ${sublabel}`}
      onClick={navigate}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "group pointer-events-auto absolute flex min-h-[48px] min-w-[48px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
    >
      {/* label tooltip */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card/90 px-3 py-1 text-center backdrop-blur transition duration-200",
          active ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-[11px] text-muted-foreground">{sublabel}</span>
      </span>

      {/* idle-float + hover scale (transform owned by framer) */}
      <motion.span
        className="block h-full w-full"
        animate={{
          y: reduced ? 0 : [0, -6, 0],
          scale: active ? 1.09 : 1,
        }}
        transition={{
          y: {
            duration: hotspot.floatDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: hotspot.floatDelay,
          },
          scale: { duration: 0.25, ease: "easeOut" },
        }}
      >
        {/* glow (filter kept separate so it doesn't fight framer transforms) */}
        <span
          className="block h-full w-full transition-[filter] duration-200"
          style={{
            filter: active
              ? "drop-shadow(0 6px 20px rgba(255,226,150,0.6))"
              : "drop-shadow(0 5px 10px rgba(0,0,0,0.28))",
          }}
        >
          <Object />
        </span>
      </motion.span>
    </button>
  );
}
