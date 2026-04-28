"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Trophy } from "lucide-react";

const projects = [
  {
    title: "Agentic Automation for iOS Accessibility",
    description:
      "Voice-driven AI iPhone agent that understands screen context, performs multi-step workflows across apps, and narrates each action in real time for blind and low-vision users.",
    tags: ["Swift", "SwiftUI", "Node.js", "Claude API", "XCTest", "AVFoundation"],
    image: "/images/Agentic_Automation_IOS.png",
    href: "#",
    repo: "https://github.com/bryanrg22/ios-agent_automation",
    role: "Contributor",
    date: "April 2026",
    award: "3rd Place · SoCal Claude Hackathon (UCLA · USC · Caltech)",
  },
  {
    title: "ProfBench",
    description:
      "Domain-specific LLM evaluation harness for procurement / source-to-pay reasoning. AfterQuery-style expert-in-the-loop authoring with Claude as autograder, plus loss analysis, leaderboard, and Hugging Face dataset export.",
    tags: ["Python", "Claude API", "Streamlit", "Hugging Face", "LLM Eval"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    href: "#",
    repo: "https://github.com/ZacharyTChung/profbench",
    role: "Author",
    date: "April 2026 – Present",
  },
  {
    title: "I/O Performance Study — mmap vs io_uring",
    description:
      "17 controlled experiments across 8 research phases comparing I/O strategies for analytical workloads. Identified NVMe queue saturation as a scaling limit and produced 5 actionable engineering recommendations.",
    tags: ["C++", "Apache Arrow", "Linux", "io_uring", "mmap"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    href: "#",
    repo: "https://github.com/ZacharyTChung/AdaptiveIO_Journal",
    role: "Author",
    date: "December 2025 – Present",
  },
  {
    title: "Wandr",
    description:
      "Full-stack mobile app for mapping and rating travel locations. EXIF auto-pinning, GPS dwell-time detection, presigned S3 uploads, and a geospatial PostGIS schema behind a Firebase Auth-protected API.",
    tags: [
      "React Native",
      "TypeScript",
      "Node.js",
      "PostgreSQL/PostGIS",
      "AWS S3",
      "Firebase",
      "Mapbox GL",
    ],
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1600&auto=format&fit=crop",
    href: "#",
    repo: "https://github.com/ZacharyTChung/travel-map",
    role: "Built it",
    date: "March 2026 – Present",
  },
];

export function Projects() {
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
      className="relative overflow-hidden bg-background text-foreground"
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
                  key={p.title}
                  className="h-full shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / visible}%` }}
                >
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/30">
                    <div className="relative h-52 w-full shrink-0 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover saturate-[0.65] transition-transform duration-500 group-hover:saturate-100 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                      {p.role && (
                        <span className="absolute right-3 top-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/80 backdrop-blur">
                          {p.role}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col overflow-y-auto p-5">
                      {p.date && (
                        <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {p.date}
                        </span>
                      )}
                      <h3 className="mt-1.5 text-lg font-semibold leading-snug text-foreground">
                        {p.title}
                      </h3>
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
                        {p.href && p.href !== "#" && (
                          <Link
                            href={p.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                          >
                            Live <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        {p.repo && p.repo !== "#" && (
                          <Link
                            href={p.repo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                          >
                            <Github className="h-3.5 w-3.5" /> Code
                          </Link>
                        )}
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
