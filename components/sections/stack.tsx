import { Code2, Layers, Server, Sparkles } from "lucide-react";
import { BackpackSVG } from "@/components/scene/scene-objects";
import { SceneGlyph, SectionGlow, SectionEyebrow } from "@/components/ui/scene-accents";

const groups = [
  {
    icon: Code2,
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Swift", "C++", "Rust", "SQL"],
  },
  {
    icon: Layers,
    label: "Frameworks",
    items: [
      "React Native",
      "Expo",
      "Node.js",
      "Express",
      "SwiftUI",
      "React",
      "Mapbox GL",
    ],
  },
  {
    icon: Server,
    label: "Infrastructure",
    items: [
      "PostgreSQL",
      "Firebase",
      "AWS",
      "Docker",
      "Git",
      "REST APIs",
      "CI/CD",
      "Linux",
    ],
  },
  {
    icon: Sparkles,
    label: "Testing and AI",
    items: [
      "pytest",
      "XCTest",
      "Unit and integration testing",
      "LLM APIs",
      "Agentic tool calling",
      "Evaluation harnesses",
    ],
  },
];

export function Stack() {
  return (
    <section
      id="stack"
      className="relative overflow-hidden px-6 py-10 text-foreground md:py-12"
    >
      <SectionGlow accent="--c-pop-teal" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <SceneGlyph Object={BackpackSVG} accent="--c-pop-teal" />
            <div>
              <SectionEyebrow accent="--c-pop-teal">tools i use</SectionEyebrow>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-5xl">
                Stack
              </h2>
            </div>
          </div>
          <p className="max-w-md text-muted-foreground">
            The languages and tools behind the projects on this site.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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
