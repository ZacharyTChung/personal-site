"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { SceneLandscape } from "./scene-landscape";
import { Hotspot } from "./hotspot";
import { HOTSPOTS, DEPTH } from "./scene-config";

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

export function ClearingScene() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();
  const isTouch = useMediaQuery("(pointer: coarse)");
  const isNarrow = useMediaQuery("(max-width: 767px)");
  const [hintVisible, setHintVisible] = useState(true);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });

  const skyX = useTransform(sx, (v) => v * DEPTH.sky);
  const farX = useTransform(sx, (v) => v * DEPTH.far);
  const midX = useTransform(sx, (v) => v * DEPTH.mid);
  const waterX = useTransform(sx, (v) => v * DEPTH.water);
  const groundX = useTransform(sx, (v) => v * DEPTH.ground);
  const objectsX = useTransform(sx, (v) => v * DEPTH.objects);
  const objectsY = useTransform(sy, (v) => v * 4);
  const sunY = useTransform(sy, (v) => v * 8);

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

  const baseSize = isNarrow ? 108 : 134;

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
        <div className="absolute inset-x-5 top-[9%] z-10 text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.5)] md:inset-x-auto md:left-[7%] md:top-[16%] md:max-w-md md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] text-[#e7c79a]">
            Zachary Chung
          </p>
          <h1 className="mx-auto mt-3 max-w-[14ch] whitespace-normal break-words font-display text-3xl font-semibold leading-tight text-[#f5ecda] md:mx-0 md:max-w-none md:text-5xl">
            A clearing in the woods.
          </h1>
          <p className="mx-auto mt-4 max-w-xs text-sm text-[#dccdb4] md:max-w-md md:mx-0 md:text-base">
            I build software in LA and I&apos;m training for a half-Ironman.
            Have a look around — everything out here is clickable.
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
            />
          ))}
        </motion.div>

        {/* onboarding hint */}
        <div
          className={`pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border bg-card/85 px-4 py-2 text-xs text-muted-foreground backdrop-blur transition-opacity duration-500 ${
            hintVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {isTouch ? "Tap something to take a look" : "Move to look around · click to examine"}
        </div>

        {/* scroll cue */}
        <a
          href="#about"
          aria-label="Skip the scene and read on"
          className="absolute bottom-5 right-5 z-20 hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#dccdb4] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] transition-opacity hover:opacity-70 md:flex"
        >
          Continue
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </a>
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
              <a
                href={h.targetId}
                className="inline-block rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground"
              >
                {h.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
