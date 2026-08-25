"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NAV_ORDER, SECTION_LABELS, type SectionKey } from "@/components/scene/section-keys";

export function Nav({ onSelect }: { onSelect?: (k: SectionKey) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const pick = (key: SectionKey) => {
    setMenuOpen(false);
    onSelect?.(key);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-2 transition-all duration-300",
          scrolled || menuOpen
            ? "border border-[rgb(var(--c-warm-1)/0.2)] bg-[rgb(var(--c-bg-2)/0.95)] shadow-sm"
            : "border border-transparent",
        )}
      >
        <Link href="#top" className="flex items-center gap-2">
          <span className="font-hud text-[10px] text-[rgb(var(--c-warm-1))]">▲</span>
          <span className="font-display text-lg tracking-tight text-foreground">
            Zachary Chung
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {NAV_ORDER.map((key) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => pick(key)}
                className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-foreground/25 transition-colors group-hover:bg-[rgb(var(--c-warm-1))]" />
                {SECTION_LABELS[key]}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => pick("contact")}
            className="rounded-full border-2 border-[rgb(var(--c-warm-1)/0.55)] bg-[rgb(var(--c-warm-1)/0.15)] px-4 py-1 font-hand text-lg leading-none text-[rgb(var(--c-warm-1))] transition-transform hover:-rotate-2 hover:scale-105"
          >
            get in touch
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground/15 text-foreground transition-colors hover:border-[rgb(var(--c-warm-1)/0.55)] md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* tap anywhere outside to dismiss */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 -z-10 cursor-default md:hidden"
            />
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mx-auto mt-2 grid max-w-6xl grid-cols-2 gap-1 rounded-2xl border border-[rgb(var(--c-warm-1)/0.2)] bg-[rgb(var(--c-bg-2)/0.97)] p-3 shadow-md md:hidden"
            >
              {NAV_ORDER.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => pick(key)}
                    className="group flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-[rgb(var(--c-warm-1)/0.1)] hover:text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground/25 transition-colors group-hover:bg-[rgb(var(--c-warm-1))]" />
                    {SECTION_LABELS[key]}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
