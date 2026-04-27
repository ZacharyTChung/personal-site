"use client";

import { useEffect } from "react";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

export function Hero() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="top" className="relative">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/opening_center2.jpg"
        bgImageSrc="/images/opening_bg.jpeg"
        title="Zachary Chung"
        date="Los Angeles · open to relocating"
        scrollToExpand="Scroll to expand"
        textBlend
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Hi, I&apos;m Zachary
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Software engineer in LA, open to relocating.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Most of what I build started with a problem I ran into myself.
            When I&apos;m not at a screen, I&apos;m probably swimming, biking,
            or running — chasing a half-Ironman in December.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
            >
              Get in touch
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-5 text-muted-foreground">
            <a
              href="https://github.com/ZacharyTChung"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-foreground"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:zchung@usc.edu"
              aria-label="Email"
              className="transition-colors hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <a
            href="#about"
            className="mt-12 inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Continue
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </a>
        </div>
      </ScrollExpandMedia>
    </section>
  );
}
