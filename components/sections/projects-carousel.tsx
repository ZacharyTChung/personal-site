"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Star, Trophy } from "lucide-react";
import type { Project } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  Python: "#3776ab",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C++": "#f34b7d",
  Swift: "#f05138",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
};

function CoverTopo() {
  return (
    <svg
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse
          key={i}
          cx="150"
          cy="30"
          rx={20 + i * 26}
          ry={14 + i * 18}
          fill="none"
          stroke="#fff"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);

  useEffect(() => {
    const update = () => setVisible(window.innerWidth >= 768 ? 3 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, projects.length - visible);
  const safeIndex = Math.min(index, maxIndex);
  const canPrev = safeIndex > 0;
  const canNext = safeIndex < maxIndex;

  return (
    <section
      id="projects"
      className="relative overflow-hidden text-foreground"
    >
      <ContainerScroll
        titleComponent={
          <>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Selected work
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-foreground md:text-5xl">
              Things I&apos;ve been building
              <br />
              <span className="mt-2 inline-block text-7xl font-bold leading-none text-foreground/40 md:text-[6rem]">
                lately
              </span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Pulled live from GitHub — descriptions and activity stay current.
            </p>
          </>
        }
      >
        <div className="relative h-full">
          <div className="h-full overflow-hidden p-2">
            <div
              className="flex h-full transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(safeIndex * 100) / visible}%)`,
              }}
            >
              {projects.map((p) => (
                <div
                  key={p.slug}
                  className="h-full shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / visible}%` }}
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/30">
                    {/* generated, on-theme cover */}
                    <div
                      className="relative h-44 w-full shrink-0 overflow-hidden"
                      style={{ background: p.gradient }}
                    >
                      <CoverTopo />
                      <span className="absolute left-4 top-2 font-display text-5xl font-bold tracking-tight text-white/15">
                        {p.mark}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                      {p.role && (
                        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur">
                          {p.role}
                        </span>
                      )}
                      <h3 className="absolute bottom-3 left-4 right-4 font-display text-xl font-semibold leading-snug text-white drop-shadow">
                        {p.title}
                      </h3>
                    </div>

                    <div className="flex flex-1 flex-col overflow-y-auto p-5">
                      {/* live meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                        {p.language && (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                background:
                                  LANG_COLORS[p.language] ?? "#9aa0a6",
                              }}
                            />
                            {p.language}
                          </span>
                        )}
                        {p.stars > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3" /> {p.stars}
                          </span>
                        )}
                        {p.date && <span>{p.date}</span>}
                      </div>

                      {p.award && (
                        <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          <Trophy className="h-3 w-3" />
                          {p.award}
                        </div>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2 pt-4">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                        {p.href && (
                          <Link
                            href={p.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                          >
                            Live <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={p.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                        >
                          <Github className="h-3.5 w-3.5" /> Code
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous projects"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
            className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:border-foreground/40 hover:bg-background disabled:cursor-not-allowed disabled:opacity-30 md:left-3 md:h-11 md:w-11"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next projects"
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={!canNext}
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-lg backdrop-blur transition hover:border-foreground/40 hover:bg-background disabled:cursor-not-allowed disabled:opacity-30 md:right-3 md:h-11 md:w-11"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIndex
                    ? "w-6 bg-foreground/70"
                    : "w-1.5 bg-foreground/25"
                }`}
              />
            ))}
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
