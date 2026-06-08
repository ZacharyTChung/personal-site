"use client";

import { useEffect, useState } from "react";

/**
 * One continuous landscape behind the whole page: a big winding dirt trail
 * that runs from the hero all the way down, with real terrain along it
 * (trees, cacti, rocks, rivers, snow) that changes as you descend. Sections
 * sit on top transparently so the trail/terrain shows through and everything
 * blends into a single scene. Decorative + non-interactive.
 *
 * Drawn in real pixel coordinates (viewBox = measured page size, no scaling
 * distortion). Terrain is desktop-only to keep small screens clean.
 */

const INK = "rgb(var(--c-fg))";

function pine(x: number, b: number, s: number, key: string) {
  const H = 160 * s;
  const W = 92 * s;
  return (
    <g key={key} stroke={INK} strokeWidth={2.2} strokeLinejoin="round">
      <rect x={x - 6 * s} y={b - 30 * s} width={12 * s} height={32 * s} fill="#6b4a2e" />
      <path d={`M${x} ${b - H} L${x - W * 0.42} ${b - H * 0.58} L${x + W * 0.42} ${b - H * 0.58} Z`} fill="rgb(var(--s-pine-mid))" />
      <path d={`M${x} ${b - H * 0.78} L${x - W * 0.55} ${b - H * 0.3} L${x + W * 0.55} ${b - H * 0.3} Z`} fill="rgb(var(--s-pine-near))" />
      <path d={`M${x} ${b - H * 0.5} L${x - W * 0.62} ${b - 26 * s} L${x + W * 0.62} ${b - 26 * s} Z`} fill="rgb(var(--s-pine-near))" />
    </g>
  );
}

function snowyPine(x: number, b: number, s: number, key: string) {
  const H = 170 * s;
  const W = 96 * s;
  return (
    <g key={key} stroke={INK} strokeWidth={2.2} strokeLinejoin="round">
      <rect x={x - 6 * s} y={b - 30 * s} width={12 * s} height={32 * s} fill="#6b4a2e" />
      <path d={`M${x} ${b - H} L${x - W * 0.42} ${b - H * 0.58} L${x + W * 0.42} ${b - H * 0.58} Z`} fill="rgb(var(--s-water-deep))" />
      <path d={`M${x} ${b - H * 0.78} L${x - W * 0.55} ${b - H * 0.3} L${x + W * 0.55} ${b - H * 0.3} Z`} fill="rgb(var(--s-water-deep))" />
      <path d={`M${x} ${b - H} L${x - W * 0.18} ${b - H * 0.78} L${x} ${b - H * 0.72} L${x + W * 0.16} ${b - H * 0.8} Z`} fill="#ffffff" stroke="none" />
    </g>
  );
}

function leafy(x: number, b: number, s: number, key: string, color: string) {
  return (
    <g key={key} stroke={INK} strokeWidth={2.2} strokeLinejoin="round">
      <rect x={x - 7 * s} y={b - 54 * s} width={14 * s} height={56 * s} fill="#6b4a2e" />
      <circle cx={x} cy={b - 78 * s} r={44 * s} fill={`rgb(var(${color}))`} />
      <circle cx={x - 30 * s} cy={b - 56 * s} r={26 * s} fill={`rgb(var(${color}))`} />
      <circle cx={x + 30 * s} cy={b - 56 * s} r={26 * s} fill={`rgb(var(${color}))`} />
    </g>
  );
}

function cactus(x: number, b: number, s: number, key: string) {
  return (
    <g key={key}>
      <path
        d={`M${x} ${b} L${x} ${b - 110 * s} M${x} ${b - 64 * s} L${x - 30 * s} ${b - 64 * s} L${x - 30 * s} ${b - 96 * s} M${x} ${b - 50 * s} L${x + 30 * s} ${b - 50 * s} L${x + 30 * s} ${b - 92 * s}`}
        fill="none"
        stroke="rgb(var(--s-pine-near))"
        strokeWidth={22 * s}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${x} ${b} L${x} ${b - 110 * s} M${x} ${b - 64 * s} L${x - 30 * s} ${b - 64 * s} L${x - 30 * s} ${b - 96 * s} M${x} ${b - 50 * s} L${x + 30 * s} ${b - 50 * s} L${x + 30 * s} ${b - 92 * s}`}
        fill="none"
        stroke={INK}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function rocks(x: number, b: number, s: number, key: string) {
  return (
    <g key={key} stroke={INK} strokeWidth={2.2}>
      <ellipse cx={x} cy={b - 14 * s} rx={42 * s} ry={26 * s} fill="rgb(var(--s-ground-shadow))" />
      <ellipse cx={x + 44 * s} cy={b - 8 * s} rx={26 * s} ry={16 * s} fill="rgb(var(--s-ground-shadow))" />
    </g>
  );
}

function bush(x: number, b: number, s: number, key: string) {
  return (
    <g key={key} stroke={INK} strokeWidth={2.2}>
      <circle cx={x} cy={b - 22 * s} r={26 * s} fill="rgb(var(--s-pine-mid))" />
      <circle cx={x - 26 * s} cy={b - 12 * s} r={18 * s} fill="rgb(var(--s-pine-mid))" />
      <circle cx={x + 26 * s} cy={b - 12 * s} r={18 * s} fill="rgb(var(--s-pine-mid))" />
    </g>
  );
}

function river(w: number, y: number, key: string) {
  const u = w * 0.14;
  let top = `M0 ${y}`;
  for (let i = 0; i < 8; i++) top += ` q ${u / 2} -22 ${u} 0`;
  return (
    <g key={key}>
      <path
        d={`${top} L${w} ${y + 64} L0 ${y + 64} Z`}
        fill="rgb(var(--s-water) / 0.38)"
        stroke="rgb(var(--s-water) / 0.55)"
        strokeWidth="2"
      />
      <path
        d={`M0 ${y + 30} q ${u * 0.6} -14 ${u * 1.2} 0 t ${u * 1.2} 0 t ${u * 1.2} 0 t ${u * 1.2} 0`}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  );
}

function feature(frac: number, x: number, y: number, s: number, n: number, key: string) {
  if (frac < 0.4) {
    if (n % 3 === 0) return leafy(x, y, s, key, "--c-pop-lime");
    if (n % 3 === 1) return pine(x, y, s, key);
    return bush(x, y, s * 1.2, key);
  }
  if (frac < 0.66) {
    if (n % 2 === 0) return cactus(x, y, s, key);
    return rocks(x, y, s, key);
  }
  if (n % 2 === 0) return snowyPine(x, y, s, key);
  return rocks(x, y, s, key);
}

export function TrailScape() {
  const [{ w, h }, setSize] = useState({ w: 1280, h: 4200 });

  useEffect(() => {
    const update = () =>
      setSize({
        w: window.innerWidth,
        h: Math.max(document.documentElement.scrollHeight, window.innerHeight),
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

  // winding trail, starting just past the hero
  const startY = Math.min(h * 0.16, 720);
  let d = `M${w * 0.5} ${startY}`;
  let x = w * 0.5;
  let y = startY;
  let dir = 1;
  while (y < h - 60) {
    const ny = Math.min(y + 540, h - 30);
    const nx = dir > 0 ? w * 0.72 : w * 0.28;
    const my = (y + ny) / 2;
    d += ` C ${x} ${my}, ${nx} ${my}, ${nx} ${ny}`;
    x = nx;
    y = ny;
    dir *= -1;
  }

  const path = Math.max(48, w * 0.05);
  const wide = w >= 768;
  const feats: React.ReactNode[] = [];
  if (wide) {
    let yy = startY + 70;
    let k = 0;
    while (yy < h - 140) {
      const frac = yy / h;
      const side = k % 2 === 0 ? 1 : -1;
      const fx =
        side > 0
          ? w * (0.85 - ((k * 3) % 6) / 100)
          : w * (0.15 + ((k * 3) % 6) / 100);
      const s = 1 + ((k * 7) % 6) / 10;
      feats.push(feature(frac, fx, yy + 40, s, k, `f${k}`));
      yy += 270 + ((k * 53) % 150);
      k++;
    }
    feats.push(river(w, h * 0.52, "river-a"));
    feats.push(river(w, h * 0.83, "river-b"));
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* soft halo under the whole trail */}
        <path
          d={d}
          fill="none"
          stroke="rgb(var(--c-trail) / 0.18)"
          strokeWidth={path + 16}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* the dirt path */}
        <path
          d={d}
          fill="none"
          stroke="rgb(var(--c-trail) / 0.5)"
          strokeWidth={path}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* dashed centerline */}
        <path
          d={d}
          fill="none"
          stroke="rgb(var(--c-fg) / 0.3)"
          strokeWidth="3"
          strokeDasharray="3 26"
          strokeLinecap="round"
        />
        {feats}
      </svg>
    </div>
  );
}
