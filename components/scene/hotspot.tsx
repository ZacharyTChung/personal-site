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

const BRACKETS = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "left-0 bottom-0 border-l-2 border-b-2",
  "right-0 bottom-0 border-r-2 border-b-2",
];

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
      aria-label={`${label}, ${sublabel}`}
      onClick={navigate}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        "group pointer-events-auto absolute flex min-h-[48px] min-w-[48px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-2xl",
        "focus-visible:outline-none",
      )}
      style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
    >
      {/* targeting reticle */}
      {BRACKETS.map((b) => (
        <span
          key={b}
          aria-hidden="true"
          className={cn(
            "absolute h-3 w-3 rounded-[2px] border-[rgb(var(--c-warm-1))] transition-all duration-200",
            b,
            active ? "scale-100 opacity-90" : "scale-75 opacity-0",
          )}
        />
      ))}

      {/* examine prompt */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 mb-3 w-max max-w-[200px] -translate-x-1/2 rounded-lg border border-[rgb(var(--c-warm-1)/0.4)] bg-[rgb(var(--c-bg-2)/0.95)] px-3 py-2 text-center shadow-lg backdrop-blur transition duration-200",
          active ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        )}
      >
        <span className="flex items-center justify-center gap-1.5 font-hud text-[8px] uppercase tracking-[0.15em] text-[rgb(var(--c-warm-1))]">
          ▸ Examine
        </span>
        <span className="mt-1 block text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="block text-[11px] text-muted-foreground">{sublabel}</span>
        <span className="mt-1.5 inline-block rounded border border-border bg-background/60 px-1.5 font-hud text-[8px] text-muted-foreground">
          ENTER
        </span>
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
              ? "drop-shadow(0 6px 20px rgba(255,214,138,0.6))"
              : "drop-shadow(0 5px 10px rgba(0,0,0,0.45))",
          }}
        >
          <Object />
        </span>
      </motion.span>
    </button>
  );
}
