"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#projects", label: "Projects" },
  { href: "#awards", label: "Awards" },
  { href: "#interests", label: "Interests" },
  { href: "#music", label: "Music" },
  { href: "#ironman", label: "Goals" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

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
          scrolled
            ? "border border-[rgb(var(--c-warm-1)/0.18)] bg-[rgb(var(--c-bg-2)/0.8)] backdrop-blur-md"
            : "border border-transparent",
        )}
      >
        <Link href="#top" className="flex items-center gap-2">
          <span className="font-hud text-[10px] text-[rgb(var(--c-warm-1))]">
            ▲
          </span>
          <span className="font-display text-lg tracking-tight text-foreground">
            Zachary Chung
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-[rgb(var(--c-warm-1)/0.12)] text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors",
                      isActive
                        ? "bg-[rgb(var(--c-warm-1))]"
                        : "bg-foreground/25 group-hover:bg-foreground/50",
                    )}
                  />
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#contact"
          className="rounded-lg border border-[rgb(var(--c-warm-1)/0.4)] bg-[rgb(var(--c-warm-1)/0.1)] px-3 py-2 font-hud text-[9px] uppercase tracking-wider text-[rgb(var(--c-warm-1))] transition-colors hover:bg-[rgb(var(--c-warm-1)/0.18)]"
        >
          Say hi
        </a>
      </nav>
    </header>
  );
}
