"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { SectionKey } from "./section-keys";
import { SECTION_LABELS } from "./section-keys";

/**
 * Click an object in the clearing (or a nav link) and its section opens here as
 * an overlay panel. The content is the existing section components, rendered on
 * the server and passed in via `sections`, so nothing about them has to change.
 */
export function SectionDetail({
  selected,
  sections,
  onClose,
}: {
  selected: SectionKey | null;
  sections: Record<SectionKey, ReactNode>;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // close on Escape, lock the page scroll, and move focus into the panel
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected, onClose]);

  return (
    <AnimatePresence>
      {selected && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto overscroll-contain p-3 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-label={SECTION_LABELS[selected]}
        >
          {/* dimmed, blurred backdrop */}
          <div className="fixed inset-0 -z-10 bg-[rgb(var(--c-bg-1)/0.55)] backdrop-blur-md" />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="relative my-4 w-full max-w-3xl overflow-hidden rounded-[1.6rem] border border-border bg-background shadow-2xl outline-none"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-[rgb(var(--c-bg-2)/0.9)] text-foreground shadow-sm backdrop-blur transition-transform hover:scale-105"
            >
              <X className="h-5 w-5" />
            </button>
            {sections[selected]}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
