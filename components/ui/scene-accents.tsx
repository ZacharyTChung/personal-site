import type { FC } from "react";
import { cn } from "@/lib/utils";

/**
 * A scene object (tent, backpack, etc.) shown in a small colored badge — used
 * as each section's heading glyph so every section visibly ties back to the
 * object you clicked in the clearing. `accent` is a CSS custom-property name
 * (e.g. "--c-pop-teal") so each section gets its own pop color.
 */
export function SceneGlyph({
  Object,
  accent = "--c-warm-1",
  className,
}: {
  Object: FC<{ className?: string }>;
  accent?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-16 w-16 shrink-0 -rotate-3 items-center justify-center rounded-2xl border-2 p-2.5 shadow-[3px_3px_0_rgb(0_0_0_/_0.12)] transition-transform duration-200 hover:rotate-0",
        className,
      )}
      style={{
        borderColor: `rgb(var(${accent}) / 0.55)`,
        background: `rgb(var(${accent}) / 0.16)`,
      }}
    >
      <Object className="h-full w-full" />
    </span>
  );
}

/** Soft colored glow anchored to the top of a section (sits above the section
 *  background, below content which uses a `relative z-10` wrapper). */
export function SectionGlow({
  accent = "--c-warm-1",
  className,
}: {
  accent?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-1/2 top-0 h-72 w-[820px] max-w-[130%] -translate-x-1/2 rounded-full blur-3xl",
        className,
      )}
      style={{
        background: `radial-gradient(ellipse at center top, rgb(var(${accent}) / 0.16), transparent 70%)`,
      }}
    />
  );
}

/** Thematic eyebrow label — pixel HUD font, tinted with the section accent. */
export function SectionEyebrow({
  children,
  accent = "--c-warm-1",
}: {
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <p
      className="font-hand text-xl lowercase leading-none"
      style={{ color: `rgb(var(${accent}))` }}
    >
      {children}
    </p>
  );
}
