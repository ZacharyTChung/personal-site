"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface HorizonSceneProps {
  className?: string;
}

export function HorizonScene({ className }: HorizonSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });

  const skyX = useTransform(sx, (v) => v * 6);
  const farX = useTransform(sx, (v) => v * 12);
  const midX = useTransform(sx, (v) => v * 22);
  const nearX = useTransform(sx, (v) => v * 32);
  const sunY = useTransform(sy, (v) => v * 8);

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
      className={`relative overflow-hidden rounded-[28px] ${className ?? ""}`}
    >
      {/* sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0d1530 0%, #1d2a4a 35%, #4a3a5a 60%, #b6803c 85%, #f4cf8a 100%)",
        }}
      />

      {/* stars */}
      <motion.div className="absolute inset-0" style={{ x: skyX }}>
        {[...Array(40)].map((_, i) => {
          const x = (i * 37) % 100;
          const y = (i * 19) % 55;
          const size = (i % 3) + 1;
          return (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                boxShadow: "0 0 4px rgba(255,255,255,0.7)",
              }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                delay: (i % 7) * 0.4,
              }}
            />
          );
        })}
      </motion.div>

      {/* sun */}
      <motion.div
        className="absolute left-1/2 top-[58%] h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 45% 40%, #fde6b3 0%, #f4cf8a 35%, #e0a85b 70%, #b6803c 100%)",
          boxShadow:
            "0 0 80px rgba(244,207,138,0.7), 0 0 140px rgba(224,168,91,0.4)",
          y: sunY,
        }}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* sun reflection / atmospheric band */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 30%, rgba(244,207,138,0.35), transparent 70%)",
        }}
      />

      {/* drifting clouds */}
      <motion.svg
        viewBox="0 0 600 200"
        className="absolute left-0 top-[35%] h-[10%] w-[140%]"
        style={{ x: farX }}
        animate={{ x: ["-10%", "5%", "-10%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
      >
        <g fill="rgba(244,207,138,0.18)">
          <ellipse cx="80" cy="100" rx="60" ry="10" />
          <ellipse cx="280" cy="120" rx="80" ry="9" />
          <ellipse cx="450" cy="95" rx="50" ry="8" />
        </g>
      </motion.svg>

      {/* far mountains */}
      <motion.svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[28%] h-[35%] w-full"
        style={{ x: farX }}
      >
        <defs>
          <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(74,90,110,0.85)" />
            <stop offset="1" stopColor="rgba(40,50,75,0.95)" />
          </linearGradient>
        </defs>
        <path
          d="M0 140 L60 90 L120 110 L180 70 L240 95 L300 60 L360 100 L420 75 L480 110 L540 85 L600 120 L600 200 L0 200 Z"
          fill="url(#far)"
        />
      </motion.svg>

      {/* mid mountains */}
      <motion.svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[14%] h-[36%] w-full"
        style={{ x: midX }}
      >
        <defs>
          <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(36,46,68,0.95)" />
            <stop offset="1" stopColor="rgba(20,30,58,1)" />
          </linearGradient>
        </defs>
        <path
          d="M0 160 L40 110 L100 140 L160 80 L220 130 L300 90 L380 135 L460 100 L520 130 L600 105 L600 200 L0 200 Z"
          fill="url(#mid)"
        />
      </motion.svg>

      {/* near foreground ridge */}
      <motion.svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[28%] w-full"
        style={{ x: nearX }}
      >
        <defs>
          <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(13,21,48,1)" />
            <stop offset="1" stopColor="rgba(8,14,32,1)" />
          </linearGradient>
        </defs>
        <path
          d="M0 100 L80 60 L180 90 L260 50 L340 75 L420 45 L500 80 L600 60 L600 200 L0 200 Z"
          fill="url(#near)"
        />
      </motion.svg>

      {/* runner silhouette traversing the foreground ridge */}
      <motion.div
        className="absolute bottom-[18%]"
        animate={{ left: ["-6%", "104%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <Runner />
      </motion.div>

      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_80px_rgba(0,0,0,0.45)]" />
    </div>
  );
}

function Runner() {
  return (
    <motion.svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      animate={{ y: [0, -1.5, 0, -1.5, 0] }}
      transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* head */}
      <circle cx="20" cy="6" r="2.4" fill="#0a1024" />
      {/* torso */}
      <path
        d="M20 8.5 L17.5 18 L21 19"
        stroke="#0a1024"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* front arm */}
      <path
        d="M19 11 L24 14"
        stroke="#0a1024"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* back arm */}
      <path
        d="M18 11 L13 13.5"
        stroke="#0a1024"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* front leg */}
      <path
        d="M20 18 L25 25"
        stroke="#0a1024"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* back leg */}
      <path
        d="M19 18 L14 24"
        stroke="#0a1024"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
