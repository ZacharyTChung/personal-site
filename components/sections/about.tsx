import { Code2, ClipboardList, Bike, Globe } from "lucide-react";
import { TentSVG } from "@/components/scene/scene-objects";
import { SceneGlyph, SectionGlow, SectionEyebrow } from "@/components/ui/scene-accents";

const stats = [
  {
    icon: Code2,
    label: "Engineering",
    value: "Full-stack, mobile, systems",
  },
  {
    icon: ClipboardList,
    label: "Product",
    value: "Scoping, specs, metrics",
  },
  {
    icon: Bike,
    label: "Triathlon",
    value: "70.3 in December",
  },
  {
    icon: Globe,
    label: "Travel",
    value: "Planning the next trip",
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
              About me.
            </h2>
          </div>
        </div>
        <div className="mt-8 grid gap-10 md:grid-cols-5">
          <div className="md:col-span-3 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I&apos;m a software engineer based in LA, open to relocating. I
              build web and mobile apps end to end, and I go lower level when
              the problem calls for it.
            </p>
            <p>
              I care about the product side as much as the code: what to
              build, who it&apos;s for, and how to tell if it worked. I&apos;m
              looking for software engineering and technical product roles.
            </p>
            <p>
              Outside of work I&apos;m training for my first half Ironman and
              planning my next trip.
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
