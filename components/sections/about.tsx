import { Code2, Mountain, Bike, BookOpen } from "lucide-react";

const stats = [
  {
    icon: Code2,
    label: "Engineer",
    value: "Mostly TypeScript & Python",
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
    icon: BookOpen,
    label: "Reader",
    value: "Sci-fi and nonfiction",
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative bg-background px-6 py-32 text-foreground"
    >
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          About
        </p>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
          A little about me.
        </h2>
        <div className="mt-8 grid gap-10 md:grid-cols-5">
          <div className="md:col-span-3 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I&apos;m a software engineer based in LA, though I&apos;d happily
              relocate for the right opportunity. I like taking an idea from
              a sticky note to something real — mostly with TypeScript and
              Python.
            </p>
            <p>
              When I&apos;m not at a screen I&apos;m usually running, hiking, or
              trying to plan the next trip. The reason I like long-distance
              training is the same reason I like building: small daily
              progress that turns into something you couldn&apos;t do a few
              months back.
            </p>
            <p>
              This site is a place to keep track of what I&apos;m working on
              and what I&apos;ve been up to.
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
