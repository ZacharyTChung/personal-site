import {
  Code2,
  Smartphone,
  Server,
  Cpu,
  Sparkles,
  Wrench,
} from "lucide-react";
import { BackpackSVG } from "@/components/scene/scene-objects";
import { SceneGlyph, SectionGlow, SectionEyebrow } from "@/components/ui/scene-accents";

const groups = [
  {
    icon: Code2,
    label: "Languages",
    items: ["Python", "C++", "Java", "TypeScript", "SQL"],
  },
  {
    icon: Smartphone,
    label: "Mobile / Frontend",
    items: ["React Native", "Expo", "React", "Mapbox GL"],
  },
  {
    icon: Server,
    label: "Backend / Infra",
    items: ["Node.js", "Express", "PostgreSQL", "PostGIS"],
  },
  {
    icon: Cpu,
    label: "Systems",
    items: ["Linux", "Apache Arrow", "AWS S3"],
  },
  {
    icon: Sparkles,
    label: "AI Tools",
    items: ["GitHub Copilot", "Claude"],
  },
  {
    icon: Wrench,
    label: "Other",
    items: ["Firebase", "Git", "VS Code", "Microsoft Office"],
  },
];

export function Stack() {
  return (
    <section
      id="stack"
      className="relative overflow-hidden bg-background px-6 py-20 text-foreground"
    >
      <SectionGlow accent="--c-pop-teal" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <SceneGlyph Object={BackpackSVG} accent="--c-pop-teal" />
            <div>
              <SectionEyebrow accent="--c-pop-teal">What&apos;s in my pack</SectionEyebrow>
              <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                The stack I reach for
                <br />
                <span className="text-foreground/50">most often.</span>
              </h2>
            </div>
          </div>
          <p className="max-w-md text-muted-foreground">
            Not a wishlist — just the stuff I actually reach for and have
            shipped real things with.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div
              key={g.label}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/40">
                  <g.icon className="h-4 w-4 text-foreground/80" />
                </div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-foreground">
                  {g.label}
                </h3>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-foreground/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
