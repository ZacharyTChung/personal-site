"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface InterestsOrbitProps {
  className?: string;
}

const orbits = [
  { label: "Soccer", radius: 28, duration: 28, phase: 0, Icon: SoccerBall },
  { label: "Travel", radius: 36, duration: 38, phase: 1.1, Icon: Plane },
  { label: "Nature", radius: 44, duration: 50, phase: 2.4, Icon: Leaf },
  { label: "Hiking", radius: 50, duration: 64, phase: 3.6, Icon: Mountains },
  { label: "Running", radius: 38, duration: 22, phase: 4.7, Icon: Runner },
];

export function InterestsOrbit({ className }: InterestsOrbitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const tiltX = useTransform(sy, (v) => v * -8);
  const tiltY = useTransform(sx, (v) => v * 8);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - (r.left + r.width / 2)) / r.width);
      my.set((e.clientY - (r.top + r.height / 2)) / r.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* warm halo behind */}
        <div
          className="absolute h-[70%] w-[70%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--c-warm-1) / 0.35), transparent 70%)",
          }}
        />

        {/* orbit guide rings */}
        <svg
          viewBox="-60 -60 120 120"
          className="absolute h-[92%] w-[92%]"
        >
          {orbits.map((o, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="0"
              rx={o.radius}
              ry={o.radius * 0.62}
              fill="none"
              stroke="rgb(var(--c-fg) / 0.12)"
              strokeWidth="0.25"
              strokeDasharray="0.6 1.4"
              transform={`rotate(${(i * 12) - 24})`}
            />
          ))}
        </svg>

        {/* central sun */}
        <motion.div
          className="relative h-[16%] w-[16%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, rgb(var(--c-warm-1)) 0%, rgb(var(--c-warm-2)) 55%, rgb(var(--c-warm-3)) 100%)",
            boxShadow:
              "0 0 50px rgb(var(--c-warm-1) / 0.55), 0 0 100px rgb(var(--c-warm-2) / 0.3)",
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* orbiting interest icons */}
        {orbits.map((o, i) => (
          <Orbiter key={o.label} orbit={o} index={i} />
        ))}

        {/* drifting motes */}
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full"
            style={{
              left: `${20 + ((i * 13) % 60)}%`,
              top: `${15 + ((i * 17) % 70)}%`,
              background: "rgb(var(--c-warm-1) / 0.55)",
            }}
            animate={{ opacity: [0, 0.7, 0], y: [0, -14, 0] }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function Orbiter({
  orbit,
  index,
}: {
  orbit: (typeof orbits)[number];
  index: number;
}) {
  const Icon = orbit.Icon;
  const reverse = index % 2 === 1;
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ rotate: orbit.phase * 60 }}
      animate={{ rotate: (reverse ? -360 : 360) + orbit.phase * 60 }}
      transition={{
        duration: orbit.duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transform: `translate(-50%, -50%) translateX(${orbit.radius * 1.5}%) rotate(${(index * 12) - 24}deg)`,
        }}
      >
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-sm md:h-14 md:w-14"
          style={{
            background: "rgb(var(--c-bg-2) / 0.85)",
            borderColor: "rgb(var(--c-accent-2) / 0.45)",
            boxShadow: "0 6px 24px rgb(0 0 0 / 0.25)",
          }}
          animate={{ rotate: reverse ? 360 : -360 }}
          transition={{
            duration: orbit.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          whileHover={{ scale: 1.15 }}
        >
          <Icon />
          <span className="sr-only">{orbit.label}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SoccerBall() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="rgb(var(--c-fg))"
        strokeWidth="1.4"
      />
      <path
        d="M12 5 L15.5 8 L14 12 L10 12 L8.5 8 Z"
        fill="rgb(var(--c-fg))"
      />
      <path
        d="M15.5 8 L20 9.5 M14 12 L17 16 M10 12 L7 16 M8.5 8 L4 9.5"
        stroke="rgb(var(--c-fg))"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function Plane() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 14 L22 7 L20 11 L11 14 L9 21 L7 21 L8 14 L4 12 Z"
        fill="rgb(var(--c-fg))"
        stroke="rgb(var(--c-fg))"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Leaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 19 C 5 9, 13 4, 20 4 C 20 12, 15 19, 5 19 Z"
        fill="rgb(var(--c-fg) / 0.9)"
      />
      <path
        d="M5 19 C 9 14, 14 9, 19 5"
        stroke="rgb(var(--c-bg-1))"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Mountains() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 19 L8 9 L12 14 L16 6 L22 19 Z"
        fill="rgb(var(--c-fg))"
      />
      <path
        d="M14 11 L16 9 L18 11"
        stroke="rgb(var(--c-bg-1))"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Runner() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="15" cy="5" r="2" fill="rgb(var(--c-fg))" />
      <path
        d="M15 8 L11 13 L14 14 L13 19"
        stroke="rgb(var(--c-fg))"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M14 10 L18 11"
        stroke="rgb(var(--c-fg))"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M11 13 L7 11"
        stroke="rgb(var(--c-fg))"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 14 L18 19"
        stroke="rgb(var(--c-fg))"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
