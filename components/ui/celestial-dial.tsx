"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface CelestialDialProps {
  className?: string;
}

export function CelestialDial({ className }: CelestialDialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sx = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const sy = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const tiltX = useTransform(sy, (v) => v * -8);
  const tiltY = useTransform(sx, (v) => v * 8);
  const driftX = useTransform(sx, (v) => v * 12);
  const driftY = useTransform(sy, (v) => v * 12);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mouseX.set((e.clientX - cx) / r.width);
      mouseY.set((e.clientY - cy) / r.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  // generate concentric topographic ellipses
  const rings = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const rx = 40 + t * 150;
    const ry = 24 + t * 92;
    return { rx, ry, opacity: 0.55 - t * 0.45 };
  });

  return (
    <div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{ perspective: "900px" }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      >
        {/* warm sun glow behind */}
        <motion.div
          className="absolute h-[55%] w-[55%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 60%, rgba(232,196,160,0.55), rgba(212,164,138,0.25) 45%, transparent 75%)",
            x: driftX,
            y: driftY,
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* outer rotating compass ring */}
        <motion.svg
          viewBox="-200 -200 400 400"
          className="absolute h-[92%] w-[92%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="ringStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(168,184,173,0.5)" />
              <stop offset="1" stopColor="rgba(212,164,138,0.4)" />
            </linearGradient>
          </defs>
          <circle
            cx="0"
            cy="0"
            r="180"
            fill="none"
            stroke="url(#ringStroke)"
            strokeWidth="0.6"
            strokeDasharray="2 6"
          />
          {Array.from({ length: 36 }).map((_, i) => {
            const a = (i / 36) * Math.PI * 2;
            const long = i % 9 === 0;
            const r1 = 174;
            const r2 = long ? 166 : 170;
            return (
              <line
                key={i}
                x1={Math.cos(a) * r1}
                y1={Math.sin(a) * r1}
                x2={Math.cos(a) * r2}
                y2={Math.sin(a) * r2}
                stroke="rgba(168,184,173,0.55)"
                strokeWidth={long ? 1.2 : 0.5}
              />
            );
          })}
        </motion.svg>

        {/* inner counter-rotating topographic contour */}
        <motion.svg
          viewBox="-200 -200 400 400"
          className="absolute h-[80%] w-[80%]"
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <radialGradient id="topoFill" cx="50%" cy="55%" r="60%">
              <stop offset="0%" stopColor="rgba(232,196,160,0.18)" />
              <stop offset="60%" stopColor="rgba(168,184,173,0.06)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="155" fill="url(#topoFill)" />
          {rings.map((r, i) => (
            <ellipse
              key={i}
              cx="0"
              cy={i * 1.5}
              rx={r.rx}
              ry={r.ry}
              fill="none"
              stroke={`rgba(168,184,173,${r.opacity})`}
              strokeWidth="0.7"
            />
          ))}
        </motion.svg>

        {/* soft sun disc */}
        <motion.div
          className="absolute h-[34%] w-[34%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 45% 35%, #f4dcb8 0%, #d8a774 50%, #8e6849 100%)",
            boxShadow:
              "0 0 60px rgba(232,196,160,0.45), inset 0 -10px 30px rgba(0,0,0,0.35)",
            x: driftX,
            y: driftY,
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* mountain silhouette layered in front, slow drift */}
        <motion.svg
          viewBox="0 0 400 200"
          className="absolute bottom-[18%] h-[28%] w-[78%]"
          style={{ x: driftX }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(77,91,83,0.85)" />
              <stop offset="1" stopColor="rgba(40,49,44,0.95)" />
            </linearGradient>
            <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(31,39,34,1)" />
              <stop offset="1" stopColor="rgba(23,30,26,1)" />
            </linearGradient>
          </defs>
          <path
            d="M0 130 L40 90 L80 110 L130 60 L180 100 L230 70 L280 105 L330 80 L400 120 L400 200 L0 200 Z"
            fill="url(#mtnFar)"
          />
          <path
            d="M0 165 L50 130 L95 155 L150 110 L210 145 L260 120 L310 150 L360 130 L400 160 L400 200 L0 200 Z"
            fill="url(#mtnNear)"
          />
        </motion.svg>

        {/* drifting fireflies / stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[3px] w-[3px] rounded-full bg-amber-100"
            style={{
              left: `${15 + ((i * 13) % 70)}%`,
              top: `${10 + ((i * 17) % 50)}%`,
              boxShadow: "0 0 8px rgba(244,220,184,0.8)",
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -20, 0],
            }}
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
