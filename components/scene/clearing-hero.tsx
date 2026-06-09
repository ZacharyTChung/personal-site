"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { ClearingScene } from "./clearing-scene";
import { Sparkle, Squiggle, Burst } from "@/components/ui/doodles";

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

export function ClearingHero() {
  const reduced = useReducedMotionSafe();
  const [mounted, setMounted] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [night, setNight] = useState(false);

  useEffect(() => {
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

  // SSR + small screens + reduced-motion + no WebGL → the illustrated 2D scene
  if (!mounted || !use3D) {
    return <ClearingScene />;
  }

  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Clearing3D night={night} />
      </div>

      {/* headline overlay (non-interactive so clicks reach the 3D objects) */}
      <div className="pointer-events-none absolute inset-x-5 top-[9%] z-10 flex justify-center md:inset-x-auto md:left-[6%] md:top-[16%] md:justify-start">
        <div className="relative inline-block max-w-[19rem] rounded-[1.6rem] bg-[rgb(var(--c-bg-2)/0.5)] px-5 py-4 text-center shadow-[0_6px_28px_rgba(0,0,0,0.14)] ring-1 ring-[rgb(var(--c-fg)/0.08)] backdrop-blur-lg md:text-left">
          {/* a couple of little bubbles */}
          <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-[rgb(var(--c-bg-2)/0.5)] ring-1 ring-[rgb(var(--c-fg)/0.08)] backdrop-blur-lg" />
          <span className="absolute -bottom-2.5 right-8 h-3.5 w-3.5 rounded-full bg-[rgb(var(--c-bg-2)/0.5)] ring-1 ring-[rgb(var(--c-fg)/0.08)] backdrop-blur-lg" />

          <p className="flex items-center justify-center gap-1.5 font-hand text-xl text-[rgb(var(--c-warm-3))] md:justify-start md:text-2xl">
            <Sparkle className="h-4 w-4" /> hi, i&apos;m
          </p>
          <h1 className="relative mt-0 inline-block font-display text-4xl font-extrabold leading-[0.9] text-foreground md:text-6xl">
            Zachary
            <br />
            Chung
            <Squiggle className="mt-1 h-3 w-36 text-[rgb(var(--c-pop-coral))] md:w-52" />
            <Burst className="absolute -right-6 -top-2 h-7 w-7 text-[rgb(var(--c-pop-gold))]" />
          </h1>
          <p className="mt-3 text-sm font-medium text-foreground/75 md:text-base">
            Software engineer in LA. Click anything in the clearing to explore.
          </p>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#about"
        aria-label="Skip the scene and read on"
        className="absolute bottom-5 right-5 z-20 hidden items-center gap-1.5 font-hand text-xl text-[#0f3b34] transition-opacity hover:opacity-70 dark:text-[#dccdb4] md:flex"
      >
        scroll!
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
