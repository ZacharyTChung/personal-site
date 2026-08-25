"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { ClearingScene } from "./clearing-scene";
import { Sparkle, Squiggle, Burst } from "@/components/ui/doodles";
import type { SectionKey } from "./section-keys";

const Clearing3D = dynamic(() => import("./clearing-3d"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// number of camera stops along the journey (matches WAYPOINTS in clearing-3d)
const STOPS = 7;
// scroll height (in svh) allotted to each stop
const STOP_VH = 62;

export function ClearingHero({
  onSelect,
}: {
  onSelect?: (k: SectionKey) => void;
}) {
  const reduced = useReducedMotionSafe();
  const [mounted, setMounted] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [night, setNight] = useState(false);

  useEffect(() => {
    // capability check has to wait for the client; the server can't probe WebGL
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const small =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    setUse3D(!small && !reduced && hasWebGL());

    const update = () =>
      setNight(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, [reduced]);

  // First paint (before we know the device) shows a neutral sky placeholder
  // that matches the 3D sky + headline, so desktop never flashes the old 2D
  // scene before the 3D world mounts.
  if (!mounted) {
    return <HeroPlaceholder />;
  }
  // small screens / reduced-motion / no WebGL → the illustrated 2D scene
  if (!use3D) {
    return <ClearingScene onSelect={onSelect} />;
  }
  return <Journey night={night} onSelect={onSelect} />;
}

/** Matches the 3D scene's sky colour and headline so the swap is seamless. */
function HeroPlaceholder() {
  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-[#bfe6f3] dark:bg-[#1a2347]"
    >
      <div className="absolute inset-x-5 top-[10%] z-10 text-center md:inset-x-auto md:left-[6%] md:top-[16%] md:max-w-xl md:text-left">
        <p className="flex items-center justify-center gap-1.5 font-hand text-2xl text-[rgb(var(--c-warm-3))] md:justify-start md:text-3xl">
          <Sparkle className="h-4 w-4" /> hi, i&apos;m
        </p>
        <h1 className="relative mt-0 inline-block font-display text-5xl font-extrabold leading-[0.9] text-foreground [text-shadow:0_2px_22px_rgb(var(--c-bg-1)/0.5)] md:text-7xl">
          Zachary
          <br />
          Chung
          <Squiggle className="mt-1 h-3 w-44 text-[rgb(var(--c-pop-coral))] md:w-64" />
          <Burst className="absolute -right-7 -top-3 h-8 w-8 text-[rgb(var(--c-pop-gold))]" />
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-base font-medium text-foreground/80 [text-shadow:0_1px_10px_rgb(var(--c-bg-1)/0.5)] md:mx-0 md:max-w-md md:text-lg">
          Software engineer in LA, working across engineering and product.
          Scroll to move through the clearing, or click an object to open
          that section.
        </p>
      </div>
    </section>
  );
}

function Journey({
  night,
  onSelect,
}: {
  night: boolean;
  onSelect?: (k: SectionKey) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useEffect(
    () =>
      scrollYProgress.on("change", (v) =>
        setActive(Math.round(clamp01(v) * (STOPS - 1))),
      ),
    [scrollYProgress],
  );

  // the intro headline + hint only live at the very top of the journey
  const introOpacity = useTransform(scrollYProgress, [0, 0.07, 0.13], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.13], [0, -40]);

  // jump straight to a stop when its rail dot is clicked
  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (STOPS - 1)) * range, behavior: "smooth" });
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative"
      style={{ height: `${STOPS * STOP_VH}svh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <Clearing3D night={night} progress={scrollYProgress} onSelect={onSelect} />

        {/* gentle scrim keeps the headline legible over the world */}
        <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-b from-[rgb(var(--c-bg-1)/0.22)] via-transparent to-[rgb(var(--c-bg-1)/0.28)]" />

        {/* intro headline */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-x-5 top-[10%] z-10 text-center md:inset-x-auto md:left-[6%] md:top-[16%] md:max-w-xl md:text-left"
        >
          <p className="flex items-center justify-center gap-1.5 font-hand text-2xl text-[rgb(var(--c-warm-3))] md:justify-start md:text-3xl">
            <Sparkle className="h-4 w-4" /> hi, i&apos;m
          </p>
          <h1 className="relative mt-0 inline-block font-display text-5xl font-extrabold leading-[0.9] text-foreground [text-shadow:0_2px_22px_rgb(var(--c-bg-1)/0.5)] md:text-7xl">
            Zachary
            <br />
            Chung
            <Squiggle className="mt-1 h-3 w-44 text-[rgb(var(--c-pop-coral))] md:w-64" />
            <Burst className="absolute -right-7 -top-3 h-8 w-8 text-[rgb(var(--c-pop-gold))]" />
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-base font-medium text-foreground/80 [text-shadow:0_1px_10px_rgb(var(--c-bg-1)/0.5)] md:mx-0 md:max-w-md md:text-lg">
            Software engineer in LA, working across engineering and product.
            Scroll to move through the clearing, or click an object to open
            that section.
          </p>
        </motion.div>

        {/* journey progress rail */}
        <div className="pointer-events-none absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
          <div className="relative h-44 w-[3px] overflow-hidden rounded-full bg-[rgb(var(--c-fg)/0.12)]">
            <motion.div
              className="absolute inset-x-0 top-0 h-full rounded-full bg-[rgb(var(--c-warm-1))]"
              style={{ scaleY: scrollYProgress, originY: 0 }}
            />
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: STOPS }).map((_, i) => (
              <button
                key={i}
                onClick={() => jumpTo(i)}
                aria-label={`Jump to stop ${i + 1}`}
                className={`pointer-events-auto h-2 w-2 rounded-full transition-all ${
                  active === i
                    ? "scale-125 bg-[rgb(var(--c-warm-1))]"
                    : "bg-[rgb(var(--c-fg)/0.25)] hover:bg-[rgb(var(--c-fg)/0.5)]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* persistent "everything is clickable" hint */}
        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-[rgb(var(--c-fg)/0.12)] bg-[rgb(var(--c-bg-2)/0.85)] px-4 py-1.5 font-hand text-base text-foreground/80 shadow-sm backdrop-blur-sm"
        >
          Click an object to open that section
        </motion.div>

        {/* decorative scroll cue */}
        <div
          aria-hidden
          className="absolute bottom-5 right-5 z-20 hidden items-center gap-1.5 font-hand text-xl text-[#0f3b34] dark:text-[#dccdb4] md:flex"
        >
          scroll
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
