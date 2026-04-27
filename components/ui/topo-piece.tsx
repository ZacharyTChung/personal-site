"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface TopoPieceProps {
  className?: string;
}

export function TopoPiece({ className }: TopoPieceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const tiltX = useTransform(sy, (v) => v * -10);
  const tiltY = useTransform(sx, (v) => v * 10);

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

  // contour ring config — concentric organic ellipses
  const rings = Array.from({ length: 12 }, (_, i) => i);

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
        {/* soft halo */}
        <div
          className="absolute h-[70%] w-[70%] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--c-fg) / 0.18), transparent 70%)",
          }}
        />

        {/* outer slow-rotating ring (cardinal markers) */}
        <motion.svg
          viewBox="-200 -200 400 400"
          className="absolute h-[95%] w-[95%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <circle
            cx="0"
            cy="0"
            r="185"
            fill="none"
            stroke="rgb(var(--c-fg) / 0.18)"
            strokeWidth="0.6"
            strokeDasharray="1 7"
          />
          {Array.from({ length: 4 }).map((_, i) => {
            const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
            return (
              <g
                key={i}
                transform={`translate(${Math.cos(a) * 192} ${Math.sin(a) * 192})`}
              >
                <circle r="1.6" fill="rgb(var(--c-fg) / 0.5)" />
              </g>
            );
          })}
        </motion.svg>

        {/* breathing topographic contours */}
        <svg
          viewBox="-200 -200 400 400"
          className="absolute h-[88%] w-[88%]"
        >
          {rings.map((i) => {
            const baseRx = 18 + i * 13;
            const baseRy = 12 + i * 8;
            const opacity = 0.55 - i * 0.035;
            const stroke = `rgb(var(--c-fg) / ${opacity})`;
            const dur = 8 + (i % 4) * 1.5;
            const delay = i * 0.25;
            return (
              <motion.ellipse
                key={i}
                cx="0"
                cy={i * 1.2}
                rx={baseRx}
                ry={baseRy}
                fill="none"
                stroke={stroke}
                strokeWidth={i === 0 ? 1.4 : 0.8}
                animate={{
                  rx: [baseRx, baseRx + 4, baseRx],
                  ry: [baseRy, baseRy + 2.5, baseRy],
                }}
                transition={{
                  duration: dur,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </svg>

        {/* slow counter-rotating fine contour */}
        <motion.svg
          viewBox="-200 -200 400 400"
          className="absolute h-[82%] w-[82%]"
          animate={{ rotate: -360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          {[0.6, 0.75, 0.9].map((s, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="0"
              rx={150 * s}
              ry={95 * s}
              fill="none"
              stroke="rgb(var(--c-fg) / 0.08)"
              strokeWidth="0.5"
              strokeDasharray="3 5"
              transform={`rotate(${i * 15})`}
            />
          ))}
        </motion.svg>

        {/* center peak marker */}
        <motion.div
          className="relative h-3 w-3 rounded-full"
          style={{ background: "rgb(var(--c-fg) / 0.85)" }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute h-8 w-8 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--c-fg) / 0.4), transparent 70%)",
          }}
        />

        {/* drifting dust */}
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full"
            style={{
              left: `${15 + ((i * 13) % 70)}%`,
              top: `${15 + ((i * 17) % 70)}%`,
              background: "rgb(var(--c-fg) / 0.5)",
            }}
            animate={{
              opacity: [0, 0.7, 0],
              y: [0, -16, 0],
            }}
            transition={{
              duration: 5 + (i % 5),
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
