import Image from "next/image";
import { Plane, Mountain, Dumbbell, Footprints, Goal } from "lucide-react";
import { SoccerBallSVG } from "@/components/scene/scene-objects";
import { SceneGlyph, SectionGlow, SectionEyebrow } from "@/components/ui/scene-accents";

const interests = [
  {
    title: "Soccer",
    blurb:
      "Been playing since I was a kid and never really stopped. Pickup games, leagues, and the occasional weekend match on the couch.",
    icon: Goal,
    image: "/images/soccer.JPEG",
    span: "",
  },
  {
    title: "Travel",
    blurb:
      "I'll go pretty much anywhere new, usually for the food and the people.",
    icon: Plane,
    image: "/images/travel.PNG",
    span: "",
  },
  {
    title: "Training",
    blurb:
      "Swim, bike, run. Most days it's just the work of showing up.",
    icon: Dumbbell,
    image: "/images/ironman_train.JPG",
    span: "",
  },
  {
    title: "Hiking",
    blurb:
      "Most weekends end up with a trail somewhere. Sierras, desert, wherever there's a bit of elevation.",
    icon: Mountain,
    image: "/images/hiking.JPG",
    span: "md:col-span-2",
  },
  {
    title: "Running",
    blurb:
      "Easy miles before the city's awake. A long run fixes most bad days.",
    icon: Footprints,
    image: "/images/running.JPG",
    span: "",
  },
];

export function Interests() {
  return (
    <section
      id="interests"
      className="relative overflow-hidden bg-background px-6 py-20 text-foreground"
    >
      <SectionGlow />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <SceneGlyph Object={SoccerBallSVG} />
            <div>
              <SectionEyebrow>Off the clock</SectionEyebrow>
              <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                What I do outside
                <br />
                <span className="text-foreground/50">of work.</span>
              </h2>
            </div>
          </div>
          <p className="max-w-md text-muted-foreground">
            A few things I keep coming back to. Some reset me, some humble me,
            and all of them keep me sane.
          </p>
        </div>

        <div className="grid auto-rows-[20rem] grid-cols-1 gap-5 md:auto-rows-[24rem] md:grid-cols-3">
          {interests.map((i) => (
            <article
              key={i.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card ${i.span}`}
            >
              <Image
                src={i.image}
                alt={i.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-foreground backdrop-blur">
                  <i.icon className="h-3.5 w-3.5 text-foreground/80" />
                  {i.title}
                </div>
                <p className="max-w-md text-sm text-foreground/85">{i.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
