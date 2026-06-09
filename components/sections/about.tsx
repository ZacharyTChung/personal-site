import { Code2, Mountain, Bike, Globe } from "lucide-react";
import { TentSVG } from "@/components/scene/scene-objects";
import { SceneGlyph, SectionGlow, SectionEyebrow } from "@/components/ui/scene-accents";

const stats = [
  {
    icon: Code2,
    label: "Engineer",
    value: "Full-stack, mobile, systems",
  },
  {
    icon: Mountain,
    label: "Hiker",
    value: "Anywhere with a trail",
  },
  {
    icon: Bike,
    label: "Triathlete",
    value: "70.3 in December",
  },
  {
    icon: Globe,
    label: "Traveler",
    value: "Always planning the next trip",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-20 text-foreground"
    >
      <SectionGlow accent="--c-pop-coral" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="flex items-center gap-4">
          <SceneGlyph Object={TentSVG} accent="--c-pop-coral" />
          <div>
            <SectionEyebrow accent="--c-pop-coral">about me</SectionEyebrow>
            <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              A little about me.
            </h2>
          </div>
        </div>
        <div className="mt-8 grid gap-10 md:grid-cols-5">
          <div className="md:col-span-3 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I&apos;m a software engineer based in LA and open to relocating.
              I like building things people actually use, mostly web and mobile
              apps, with some lower level work when a project needs it.
            </p>
            <p>
              When I&apos;m not coding I&apos;m usually running, hiking, or
              planning a trip. I like endurance training for the same reason I
              like building. Small steady days add up over time.
            </p>
            <p>
              This site is just a place to keep track of what I&apos;m working
              on and where I&apos;ve been.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
              >
                <s.icon className="h-5 w-5 text-foreground/70" />
                <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
                <p className="text-sm font-medium text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
