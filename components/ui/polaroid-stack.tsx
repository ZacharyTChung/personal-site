"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface PolaroidStackProps {
  className?: string;
}

const cards = [
  {
    label: "Soccer",
    caption: "Saturday pickup",
    img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Travel",
    caption: "Anywhere new",
    img: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Nature",
    caption: "Sierra Nevada",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Hiking",
    caption: "Above the clouds",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900&auto=format&fit=crop",
  },
  {
    label: "Running",
    caption: "Easy miles",
    img: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=900&auto=format&fit=crop",
  },
];

const layout = [
  { x: -85, y: -10, rotate: -14 },
  { x: -42, y: 6, rotate: -7 },
  { x: 0, y: 0, rotate: 0 },
  { x: 42, y: 6, rotate: 7 },
  { x: 85, y: -10, rotate: 14 },
];

export function PolaroidStack({ className }: PolaroidStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    let raf = 0;
    let nx = 0;
    let ny = 0;
    let cx = 0;
    let cy = 0;
    let rect: DOMRect | null = null;

    const tick = () => {
      cx += (nx - cx) * 0.12;
      cy += (ny - cy) * 0.12;
      const el = innerRef.current;
      if (el) el.style.transform = `translate3d(${cx * 12}px, ${cy * 8}px, 0)`;
      if (Math.abs(nx - cx) > 0.0005 || Math.abs(ny - cy) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!rect) rect = ref.current?.getBoundingClientRect() ?? null;
      if (!rect) return;
      nx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      ny = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const invalidate = () => {
      rect = null;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div
        ref={innerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute h-[55%] w-[80%] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgb(var(--c-warm-1) / 0.3), transparent 70%)",
          }}
        />

        {cards.map((card, i) => {
          const l = layout[i];
          const isHovered = hovered === i;
          const isOtherHovered = hovered !== null && hovered !== i;
          const cardTransform = `translate(-50%, -50%) translate(${l.x}%, ${l.y}%) rotate(${isHovered ? l.rotate * 0.4 : l.rotate}deg) scale(${isHovered ? 1.08 : isOtherHovered ? 0.96 : 1})`;
          return (
            <div
              key={card.label}
              className="absolute left-1/2 top-1/2"
              style={{
                width: "34%",
                aspectRatio: "3 / 4",
                zIndex: isHovered ? 50 : 10 + i,
                transform: cardTransform,
                transition:
                  "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease",
                opacity: isOtherHovered ? 0.7 : 1,
                willChange: "transform",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="polaroid-float relative h-full w-full rounded-md p-2 pb-7 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.45)]"
                style={{
                  background: "rgb(var(--c-bg-1))",
                  border: "1px solid rgb(var(--c-fg) / 0.08)",
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: `${6 + i * 0.6}s`,
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-sm">
                  <Image
                    src={card.img}
                    alt={card.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 60%, rgb(var(--c-fg) / 0.25) 100%)",
                    }}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-1 px-3 text-center">
                  <p
                    className="font-display text-sm font-medium leading-tight"
                    style={{ color: "rgb(var(--c-fg))" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-[10px] tracking-wide"
                    style={{ color: "rgb(var(--c-fg) / 0.55)" }}
                  >
                    {card.caption}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
