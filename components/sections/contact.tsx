import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { PineDivider } from "@/components/ui/pine-divider";

function Fireplace() {
  return (
    <svg
      viewBox="0 0 240 180"
      className="h-auto w-full max-w-[360px]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hearth-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4640" />
          <stop offset="1" stopColor="#332f2a" />
        </linearGradient>
        <linearGradient id="hearth-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="rgb(var(--c-warm-3))" />
          <stop offset="0.5" stopColor="rgb(var(--c-warm-1))" />
          <stop offset="1" stopColor="#ffe6a8" />
        </linearGradient>
      </defs>

      {/* stone surround */}
      <rect x="8" y="26" width="224" height="146" rx="10" fill="url(#hearth-stone)" />
      {/* stonework seams */}
      <g stroke="#26231f" strokeWidth="1.4" opacity="0.6">
        <path d="M8 70 H40 M200 70 H232 M8 116 H40 M200 116 H232" />
        <path d="M24 26 V70 M216 26 V70 M24 116 V172 M216 116 V172" />
      </g>
      {/* mantel beam */}
      <rect x="0" y="14" width="240" height="20" rx="4" fill="#5a3d28" />
      <rect x="0" y="14" width="240" height="5" rx="2" fill="#6e4d33" />

      {/* firebox */}
      <path
        d="M44 172 L44 96 Q44 60 120 60 Q196 60 196 96 L196 172 Z"
        fill="#150d08"
      />

      {/* logs */}
      <rect x="70" y="150" width="100" height="12" rx="6" fill="#6b4226" transform="rotate(8 120 156)" />
      <rect x="70" y="150" width="100" height="12" rx="6" fill="#7d4f2d" transform="rotate(-8 120 156)" />
      <circle cx="74" cy="150" r="6" fill="#8a5a36" />
      <circle cx="166" cy="150" r="6" fill="#8a5a36" />

      {/* flames */}
      <path
        className="flame"
        d="M120 150 C96 124 100 104 112 86 C108 104 116 112 122 116 C118 100 124 84 120 70 C140 92 144 118 134 138 C140 130 142 120 140 110 C150 126 146 142 120 150 Z"
        fill="url(#hearth-flame)"
      />
      <path
        className="flame flame-mid"
        d="M120 150 C108 132 110 118 118 104 C116 118 122 124 126 128 C124 112 128 100 124 92 C138 108 138 128 128 142 Z"
        fill="rgb(var(--c-warm-1))"
      />
      <path
        className="flame flame-core"
        d="M120 148 C114 136 116 124 121 114 C126 124 128 136 120 148 Z"
        fill="#ffeec2"
      />

      {/* embers */}
      <circle cx="98" cy="158" r="2" fill="rgb(var(--c-warm-1))" />
      <circle cx="144" cy="160" r="1.6" fill="rgb(var(--c-warm-2))" />
      <circle cx="120" cy="163" r="1.6" fill="#ffe6a8" />
    </svg>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 pb-16 pt-24 text-foreground"
    >
      {/* forest edge */}
      <PineDivider className="absolute inset-x-0 top-0 h-10 w-full" />

      {/* warm hearth glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-[420px] w-[640px] max-w-[90vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--c-warm-2) / 0.22), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Fireplace />
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Get in touch
        </p>
        <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-7xl">
          Pull up a chair
          <br />
          <span className="text-foreground/50">by the fire.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Always down to talk projects, training, or your favorite trail.
          Email&apos;s the fastest way to reach me — I read everything.
        </p>

        <a
          href="mailto:zchung@usc.edu"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-base font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-5 w-5" />
          zchung@usc.edu
        </a>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row sm:gap-10">
          <a
            href="https://github.com/ZacharyTChung"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            github.com/ZacharyTChung
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
            linkedin.com/in/zacharychung
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Los Angeles, CA · open to relocating
          </span>
        </div>
      </div>

      <footer className="relative mt-16 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        <p>
          Built between training sessions with Next.js and Tailwind. ©{" "}
          {new Date().getFullYear()} Zachary Chung.
        </p>
      </footer>
    </section>
  );
}
