"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { SceneLandscape } from "./scene-landscape";
import { Hotspot } from "./hotspot";
import { CampDog } from "./camp-dog";
import { Sparkle, Squiggle, Burst } from "@/components/ui/doodles";
import { HOTSPOTS, DEPTH } from "./scene-config";
import type { SectionKey } from "./section-keys";

/** SSR-safe media query hook (false until mounted). */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function ClearingScene({
  onSelect,
}: {
  onSelect?: (k: SectionKey) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const isTouch = useMediaQuery("(pointer: coarse)");
  const isNarrow = useMediaQuery("(max-width: 767px)");
  const [hintVisible, setHintVisible] = useState(true);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 28 });
  const sy = useSpring(my, { stiffness: 45, damping: 28 });

  const skyX = useTransform(sx, (v) => v * DEPTH.sky);
  const farX = useTransform(sx, (v) => v * DEPTH.far);
  const midX = useTransform(sx, (v) => v * DEPTH.mid);
  const waterX = useTransform(sx, (v) => v * DEPTH.water);
  const groundX = useTransform(sx, (v) => v * DEPTH.ground);
  const objectsX = useTransform(sx, (v) => v * DEPTH.objects);
  const objectsY = useTransform(sy, (v) => v * 2);
  const sunY = useTransform(sy, (v) => v * 4);

  // single pointer source — only when parallax is wanted
  useEffect(() => {
    if (reduced || isTouch) return;
    const onMove = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - (r.left + r.width / 2)) / r.width);
      my.set((e.clientY - (r.top + r.height / 2)) / r.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduced, isTouch]);

  // auto-fade the onboarding hint
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 6000);
    return () => clearTimeout(t);
  }, []);

  const baseSize = isNarrow ? 92 : 122;

  return (
    <>
      <section
        ref={ref}
        id="top"
        className="relative h-[100svh] w-full overflow-hidden"
        onPointerDown={() => setHintVisible(false)}
      >
        <SceneLandscape
          skyX={skyX}
          farX={farX}
          midX={midX}
          waterX={waterX}
          groundX={groundX}
          sunY={sunY}
          animate={!reduced}
        />

        {/* headline */}
        <div className="absolute inset-x-5 top-[8%] z-10 text-center md:inset-x-auto md:left-[7%] md:top-[14%] md:max-w-lg md:text-left">
          <p className="flex items-center justify-center gap-1.5 font-hand text-2xl text-[rgb(var(--c-warm-3))] md:justify-start md:text-3xl">
            <Sparkle className="h-4 w-4" /> hi, i&apos;m
          </p>
          <h1 className="relative mt-0 inline-block font-display text-5xl font-extrabold leading-[0.9] text-[#0f3b34] [text-shadow:2px_2px_0_rgba(255,255,255,0.5)] dark:text-[#f7eede] dark:[text-shadow:2px_2px_0_rgba(0,0,0,0.4)] md:text-7xl">
            Zachary
            <br />
            Chung
            <Squiggle className="mt-1 h-3 w-44 text-[rgb(var(--c-pop-coral))] md:w-64" />
            <Burst className="absolute -right-7 -top-3 h-8 w-8 text-[rgb(var(--c-pop-gold))]" />
          </h1>
          <p className="mx-auto mt-5 max-w-xs font-medium text-[#1f4a42] dark:text-[#dccdb4] md:mx-0 md:max-w-md md:text-lg">
            Software engineer in LA, working across engineering and product.
            Everything in the clearing is clickable.
          </p>
        </div>

        {/* interactive objects layer (single parallax plane) */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ x: objectsX, y: objectsY }}
        >
          {HOTSPOTS.map((h) => (
            <Hotspot
              key={h.id}
              hotspot={h}
              isMobile={isNarrow}
              reduced={reduced}
              baseSize={baseSize}
              onSelect={onSelect}
            />
          ))}

          {/* camp dog hanging out by the fire (the fire sits bottom-left on
              narrow screens, bottom-right on wide ones) */}
          <div
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: isNarrow ? "18%" : "63%",
              top: isNarrow ? "91%" : "90%",
              width: baseSize * 0.62,
              height: baseSize * 0.62,
            }}
          >
            <CampDog reduced={reduced} />
          </div>

          <span
            className="pointer-events-none absolute z-20 -rotate-6 font-hand text-xl text-[rgb(var(--c-warm-3))]"
            style={{
              left: isNarrow ? "17%" : "64%",
              top: isNarrow ? "84%" : "83%",
            }}
          >
            woof!
          </span>
        </motion.div>

        {/* onboarding hint */}
        <div
          className={`pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-border bg-card px-4 py-1.5 font-hand text-lg text-foreground/70 shadow-sm transition-opacity duration-500 ${
            hintVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {isTouch ? "Tap around to explore" : "Click around to explore"}
        </div>

      </section>

      {/* mobile legend — guarantees every section is reachable (also the
          reduced-motion / no-JS fallback) */}
      <nav
        aria-label="Sections"
        className="border-b border-border bg-background px-6 py-4 md:hidden"
      >
        <ul className="flex flex-wrap justify-center gap-2">
          {HOTSPOTS.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => onSelect?.(h.id as SectionKey)}
                className="inline-block rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground"
              >
                {h.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
