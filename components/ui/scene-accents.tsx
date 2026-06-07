import type { FC } from "react";
import { cn } from "@/lib/utils";

/**
 * A scene object (tent, backpack, etc.) shown in a small warm badge — used as
 * each section's heading glyph so every section visibly ties back to the
 * object you clicked in the clearing.
 */
export function SceneGlyph({
  Object,
  className,
}: {
  Object: FC<{ className?: string }>;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--c-warm-1)/0.25)] bg-[rgb(var(--c-warm-1)/0.08)] p-2.5",
        className,
      )}
    >
      <Object className="h-full w-full" />
    </span>
  );
}

/**
 * Warm firelight glow anchored to the top of a section. Renders above the
 * section background but below content (content sits in a `relative z-10`
 * wrapper), so it never falls behind the page.
 */
export function SectionGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-1/2 top-0 h-72 w-[820px] max-w-[130%] -translate-x-1/2 rounded-full blur-3xl",
        className,
      )}
      style={{
        background:
          "radial-gradient(ellipse at center top, rgb(var(--c-warm-1) / 0.10), transparent 70%)",
      }}
    />
  );
}

/** Thematic eyebrow label — warm amber, used above each section heading. */
export function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm uppercase tracking-[0.3em] text-[rgb(var(--c-warm-1))]">
      {children}
    </p>
  );
}
