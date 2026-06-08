import { Trophy } from "lucide-react";
import { FlagSVG } from "@/components/scene/scene-objects";
import {
  SceneGlyph,
  SectionGlow,
  SectionEyebrow,
} from "@/components/ui/scene-accents";

const awards = [
  {
    title: "3rd Place — SoCal Claude Hackathon",
    org: "UCLA · USC · Caltech",
    date: "April 2026",
    note: "Built a voice-driven iPhone agent that runs multi-step tasks across apps and reads each step out loud for blind and low-vision users.",
  },
];

export function Awards() {
  return (
    <section
      id="awards"
      className="relative overflow-hidden px-6 py-20 text-foreground"
    >
      <SectionGlow accent="--c-pop-gold" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex items-center gap-4">
          <SceneGlyph Object={FlagSVG} accent="--c-pop-gold" />
          <div>
            <SectionEyebrow accent="--c-pop-gold">Trophy shelf</SectionEyebrow>
            <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              A few wins.
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {awards.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[rgb(var(--c-warm-1)/0.4)]"
            >
              <div className="flex items-center gap-2 text-[rgb(var(--c-warm-1))]">
                <Trophy className="h-4 w-4" />
                <span className="font-hud text-[9px] uppercase tracking-wider">
                  {a.date}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">
                {a.title}
              </h3>
              <p className="text-sm text-muted-foreground">{a.org}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {a.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
