import Image from "next/image";
import { ArrowUpRight, Bell, ListOrdered, MapPin, Share2, Users } from "lucide-react";
import { WandrPhoneSVG } from "@/components/scene/scene-objects";
import {
  SceneGlyph,
  SectionGlow,
  SectionEyebrow,
} from "@/components/ui/scene-accents";
import { WANDR_APP_STORE_URL } from "@/lib/wandr";

const features = [
  {
    icon: MapPin,
    title: "Build the map",
    text: "Drop a pin anywhere in the world. Add photos, a date, and a note, or let wandr read your camera roll and suggest the trips you never logged.",
  },
  {
    icon: ListOrdered,
    title: "Rank what you've seen",
    text: "Two places, one question: which was better? A handful of taps and your list orders itself. Scores shift as you add more, the way a real opinion does.",
  },
  {
    icon: Bell,
    title: "A wishlist that finds you",
    text: "Save the places you want to go. Turn on wishlist alerts and wandr tells you when you're near one.",
  },
  {
    icon: Share2,
    title: "Share the map, not a screenshot",
    text: "Year cards, passport cards, trip cards, and journey routes, all built from your real pins.",
  },
  {
    icon: Users,
    title: "Travel with friends",
    text: "Follow the people you travel with, see where they've been, and compare your maps head to head.",
  },
];

const stack = ["React Native", "Expo", "TypeScript", "Firebase", "Mapbox GL"];

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.24 3.08-.98 1.06-2.16 1.68-3.3 1.58-.04-1.13.43-2.25 1.2-3.06.86-.94 2.24-1.6 3.34-1.6zM20.7 17.36c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.53-4.13 3.55-1.54.01-1.94-1.01-4.03-1-2.09.01-2.53 1.02-4.07 1-1.74-.02-3.06-1.79-4.05-3.36C.11 16.1-.18 11.5 1.53 8.99c1.22-1.78 3.14-2.82 4.94-2.82 1.84 0 2.99 1.01 4.51 1.01 1.47 0 2.37-1.01 4.5-1.01 1.6 0 3.3.87 4.51 2.38-3.96 2.17-3.32 7.83.71 8.81z" />
    </svg>
  );
}

export function WandrSection() {
  return (
    <section
      id="wandr"
      className="relative overflow-hidden px-6 py-10 text-foreground md:py-12"
    >
      <SectionGlow accent="--c-pop-teal" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <SceneGlyph Object={WandrPhoneSVG} accent="--c-pop-teal" />
          <div>
            <SectionEyebrow accent="--c-pop-teal">my iOS app</SectionEyebrow>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              wandr
            </h2>
          </div>
        </div>

        {/* the app, its icon, and where to get it */}
        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <Image
            src="/images/wandr-icon.png"
            alt="wandr app icon"
            width={112}
            height={112}
            className="h-24 w-24 shrink-0 rounded-[22%] border border-border shadow-[3px_3px_0_rgb(0_0_0_/_0.12)] sm:h-28 sm:w-28"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-semibold leading-tight">
              wandr
            </p>
            <p className="text-muted-foreground">
              Travel Journal &amp; Map. Map the trips you&apos;ve taken.
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Free on the App Store · iOS
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={WANDR_APP_STORE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-foreground px-4 py-2.5 text-background shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <AppleGlyph className="h-6 w-6" />
                <span className="text-left leading-none">
                  <span className="block text-[10px] font-medium opacity-80">
                    Download on the
                  </span>
                  <span className="mt-0.5 block text-base font-semibold">
                    App Store
                  </span>
                </span>
                <ArrowUpRight className="ml-0.5 h-4 w-4 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          wandr is a journal for the places you&apos;ve actually been. Pin a
          place, rate it against the other places you&apos;ve visited, and
          get a score that means something. It comes from your own
          comparisons, not five stars from a stranger.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[rgb(var(--c-pop-teal)/0.6)]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgb(var(--c-pop-teal)/0.5)] bg-[rgb(var(--c-pop-teal)/0.15)] text-foreground">
                <f.icon className="h-4 w-4" />
              </span>
              <h3 className="mt-3 font-semibold leading-snug">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-border p-5 text-sm leading-relaxed text-muted-foreground">
            Free to use, with an optional wandr+ membership. No ads. Your map
            is yours: make your account private, or hide your places or
            photos, whenever you like.
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            I designed and built wandr solo: the Firestore schema, auth, the
            Mapbox GL globe, and the release pipeline.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
