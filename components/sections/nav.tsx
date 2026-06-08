"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
            ? "border border-[rgb(var(--c-warm-1)/0.2)] bg-[rgb(var(--c-bg-2)/0.95)] shadow-sm"
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="rounded-full border-2 border-[rgb(var(--c-warm-1)/0.55)] bg-[rgb(var(--c-warm-1)/0.15)] px-4 py-1 font-hand text-lg leading-none text-[rgb(var(--c-warm-1))] transition-transform hover:-rotate-2 hover:scale-105"
          >
            say hi!
          </a>
        </div>
      </nav>
    </header>
  );
}
