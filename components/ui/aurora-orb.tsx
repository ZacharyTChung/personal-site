"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface AuroraOrbProps {
  className?: string;
}

export function AuroraOrb({ className }: AuroraOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sx = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const sy = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const blob1X = useTransform(sx, (v) => v * 30);
  const blob1Y = useTransform(sy, (v) => v * 30);
  const blob2X = useTransform(sx, (v) => v * -22);
  const blob2Y = useTransform(sy, (v) => v * -22);
  const orbX = useTransform(sx, (v) => v * 14);
  const orbY = useTransform(sy, (v) => v * 14);

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

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute h-[80%] w-[80%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(168,184,173,0.85), rgba(122,140,128,0.45) 45%, transparent 75%)",
            x: blob1X,
            y: blob1Y,
          }}
          animate={{
            scale: [1, 1.12, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-[65%] w-[65%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 70% 60%, rgba(212,164,138,0.75), rgba(184,132,105,0.35) 45%, transparent 75%)",
            x: blob2X,
            y: blob2Y,
          }}
          animate={{
            scale: [1.05, 0.92, 1.05],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-[45%] w-[45%] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(220,224,220,0.35), transparent 70%)",
          }}
          animate={{
            scale: [0.95, 1.15, 0.95],
            x: ["-8%", "8%", "-8%"],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative h-[62%] w-[62%]"
          style={{ x: orbX, y: orbY }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.15] via-white/[0.04] to-transparent backdrop-blur-md" />
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <motion.div
            className="absolute inset-[6%] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(168,184,173,0.6), rgba(212,164,138,0.5), rgba(168,184,173,0.6))",
              filter: "blur(24px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-[14%] rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg, rgba(212,164,138,0.5), rgba(168,184,173,0.45), rgba(212,164,138,0.5))",
              filter: "blur(16px)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-[22%] rounded-full bg-ink-900/70 backdrop-blur-md" />
          <div
            className="absolute inset-[22%] rounded-full"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -24px 50px rgba(0,0,0,0.5), 0 0 60px rgba(168,184,173,0.15)",
            }}
          />
          <div
            className="absolute left-[28%] top-[24%] h-[18%] w-[24%] rounded-full bg-white/20 blur-xl"
          />
        </motion.div>

        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/50"
            style={{
              left: `${20 + ((i * 7) % 60)}%`,
              top: `${15 + ((i * 11) % 70)}%`,
            }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0.4, 1.4, 0.4],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
