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
      <div className="pointer-events-none absolute inset-x-5 top-[8%] z-10 text-center [text-shadow:0_1px_10px_rgba(0,0,0,0.25)] md:inset-x-auto md:left-[7%] md:top-[14%] md:max-w-lg md:text-left">
        <p className="flex items-center justify-center gap-1.5 font-hand text-2xl text-[rgb(var(--c-warm-3))] md:justify-start md:text-3xl">
          <Sparkle className="h-4 w-4" /> hi, i&apos;m
        </p>
        <h1 className="relative mt-0 inline-block font-display text-5xl font-extrabold leading-[0.9] text-[#0f3b34] dark:text-[#f7eede] md:text-7xl">
          Zachary
          <br />
          Chung
          <Squiggle className="mt-1 h-3 w-44 text-[rgb(var(--c-pop-coral))] md:w-64" />
          <Burst className="absolute -right-7 -top-3 h-8 w-8 text-[rgb(var(--c-pop-gold))]" />
        </h1>
        <p className="mx-auto mt-5 max-w-xs font-medium text-[#1f4a42] dark:text-[#dccdb4] md:mx-0 md:max-w-md md:text-lg">
          I&apos;m a software engineer based in LA. Drag to look around the
          clearing, and click the tent or the fire to dig in.
        </p>
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
