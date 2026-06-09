"use client";

import { useEffect, useState } from "react";

/**
 * One continuous winding trail behind the whole page, from the hero to the
 * bottom, so the sections read as a single landscape rather than stacked
 * blocks. Drawn once in real pixel coordinates (viewBox = measured page size),
 * static and lightweight — just a soft dirt band + a dashed centerline.
 */
export function TrailScape() {
  const [{ w, h, vh }, setSize] = useState({ w: 1280, h: 4200, vh: 800 });

  useEffect(() => {
    const update = () =>
      setSize({
        w: window.innerWidth,
        h: Math.max(document.documentElement.scrollHeight, window.innerHeight),
        vh: window.innerHeight,
      });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener("resize", update);
    const t1 = setTimeout(update, 800);
    const t2 = setTimeout(update, 2200);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // start at the bottom of the hero so it links up with the clearing's trail
  const startY = Math.max(40, vh - 90);
  let d = `M${w * 0.5} ${startY}`;
  let x = w * 0.5;
  let y = startY;
  let dir = 1;
  while (y < h - 60) {
    const ny = Math.min(y + 560, h - 30);
    const nx = dir > 0 ? w * 0.7 : w * 0.3;
    const my = (y + ny) / 2;
    d += ` C ${x} ${my}, ${nx} ${my}, ${nx} ${ny}`;
    x = nx;
    y = ny;
    dir *= -1;
  }
  const band = Math.max(32, w * 0.03);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* color wash that carries the clearing's ground color into the
          sections below, fading to the page background */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: Math.round(vh * 2.2),
          background: `linear-gradient(to bottom, rgb(var(--s-ground) / 0.45) 0px, rgb(var(--s-ground) / 0.45) ${Math.round(vh)}px, rgb(var(--s-ground) / 0) ${Math.round(vh * 2.2)}px)`,
        }}
      />
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={d}
          fill="none"
          stroke="rgb(var(--c-trail) / 0.14)"
          strokeWidth={band + 10}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={d}
          fill="none"
          stroke="rgb(var(--c-trail) / 0.28)"
          strokeWidth={band}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={d}
          fill="none"
          stroke="rgb(var(--c-fg) / 0.26)"
          strokeWidth="3"
          strokeDasharray="4 22"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
