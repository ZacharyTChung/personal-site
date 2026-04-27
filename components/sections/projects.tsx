"use client";

import Image from "next/image";
import Link from "next/link";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ArrowUpRight, Github } from "lucide-react";

const projects = [
  {
    title: "AdaptiveIO Journal",
    description:
      "Engineering journal for an adaptive I/O system — low-level work on zero-copy data pipelines using io_uring, mmap, and Apache Arrow.",
    tags: ["C++", "Apache Arrow", "Linux", "io_uring", "mmap"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    href: "#",
    repo: "https://github.com/ZacharyTChung/AdaptiveIO_Journal",
    role: "Contributor",
  },
  {
    title: "iOS Agent Automation",
    description:
      "AI agent that drives an iPhone autonomously — vision + tool use to complete real tasks across mobile apps.",
    tags: ["Swift", "SwiftUI", "Node.js", "Claude API", "XCTest", "AVFoundation"],
    image: "/images/Agentic_Automation_IOS.png",
    href: "#",
    repo: "https://github.com/bryanrg22/ios-agent_automation",
    role: "Contributor",
  },
  {
    title: "wandr",
    description:
      "Beli, but for travel — a social app for tracking, ranking, and sharing the places you've been.",
    tags: [
      "TypeScript",
      "React",
      "Mapbox",
      "Firebase",
      "AWS",
      "Supabase",
      "PostGIS",
    ],
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1600&auto=format&fit=crop",
    href: "#",
    repo: "https://github.com/ZacharyTChung/travel-map",
    role: "Built it",
  },
];

export function Projects() {
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
        <div
          className={`mx-auto grid h-full grid-cols-1 gap-5 overflow-y-auto p-2 md:gap-6 ${
            projects.length === 1
              ? "md:max-w-md md:grid-cols-1"
              : projects.length === 2
                ? "md:max-w-3xl md:grid-cols-2"
                : "md:grid-cols-3"
          }`}
        >
          {projects.map((p) => (
            <article
              key={p.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-foreground/30"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover saturate-[0.65] transition-transform duration-500 group-hover:saturate-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                {p.role && (
                  <span className="absolute right-3 top-3 rounded-full border border-border bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/80 backdrop-blur">
                    {p.role}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
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
          ))}
        </div>
      </ContainerScroll>
    </section>
  );
}
