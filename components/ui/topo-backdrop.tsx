/**
 * Faint topographic contour texture shared across the whole page. Fixed behind
 * the (now transparent) content sections so the dark site reads as one
 * continuous outdoor canvas tying back to the forest hero.
 */
export function TopoBackdrop() {
  const clusters = [
    { cx: 220, cy: 180, n: 6, rot: -18 },
    { cx: 1000, cy: 660, n: 7, rot: 14 },
    { cx: 640, cy: 400, n: 5, rot: 4 },
  ];
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05]"
    >
      <svg
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        {clusters.map((c) =>
          Array.from({ length: c.n }).map((_, i) => (
            <ellipse
              key={`${c.cx}-${i}`}
              cx={c.cx}
              cy={c.cy}
              rx={30 + i * 44}
              ry={20 + i * 30}
              fill="none"
              stroke="rgb(var(--c-fg))"
              strokeWidth="1.2"
              transform={`rotate(${c.rot} ${c.cx} ${c.cy})`}
            />
          )),
        )}
      </svg>
    </div>
  );
}
