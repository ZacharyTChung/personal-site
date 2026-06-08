import Image from "next/image";
import { SoccerBallSVG } from "@/components/scene/scene-objects";
import {
  SceneGlyph,
  SectionGlow,
  SectionEyebrow,
} from "@/components/ui/scene-accents";

const interests = [
  {
    title: "soccer",
    blurb:
      "been playing since I was a kid and never really stopped — pickup games, leagues, the occasional couch match.",
    image: "/images/soccer.JPEG",
    rotClass: "-rotate-3",
    tape: "--c-pop-lime",
  },
  {
    title: "travel",
    blurb: "I'll go pretty much anywhere new, usually for the food and the people.",
    image: "/images/travel.PNG",
    rotClass: "rotate-2",
    tape: "--c-pop-sky",
  },
  {
    title: "training",
    blurb: "swim, bike, run. most days it's just the work of showing up.",
    image: "/images/ironman_train.JPG",
    rotClass: "-rotate-2",
    tape: "--c-pop-coral",
  },
  {
    title: "hiking",
    blurb:
      "most weekends end up on a trail somewhere — Sierras, desert, wherever there's a little elevation.",
    image: "/images/hiking.JPG",
    rotClass: "rotate-3",
    tape: "--c-pop-gold",
  },
  {
    title: "running",
    blurb: "easy miles before the city's awake. a long run fixes most bad days.",
    image: "/images/running.JPG",
    rotClass: "-rotate-1",
    tape: "--c-pop-violet",
  },
];

export function Interests() {
  return (
    <section
      id="interests"
      className="relative overflow-hidden px-6 py-20 text-foreground"
    >
      <SectionGlow accent="--c-pop-lime" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <SceneGlyph Object={SoccerBallSVG} accent="--c-pop-lime" />
            <div>
              <SectionEyebrow accent="--c-pop-lime">Off the clock</SectionEyebrow>
              <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                What I do outside
                <br />
                <span className="text-foreground/50">of work.</span>
              </h2>
            </div>
          </div>
          <p className="max-w-md text-muted-foreground">
            A few snapshots from the camera roll. Some reset me, some humble me,
            and all of them keep me sane.
          </p>
        </div>

        {/* taped trail-journal polaroids */}
        <div className="mt-14 flex flex-wrap items-start justify-center gap-x-8 gap-y-16">
          {interests.map((i) => (
            <figure
              key={i.title}
              className={`group relative w-[240px] max-w-[78vw] rounded-[3px] bg-[#fbf8f0] p-3 pb-14 shadow-[0_12px_26px_rgba(0,0,0,0.22)] ring-1 ring-black/5 transition-transform duration-200 hover:z-20 hover:-translate-y-1.5 hover:rotate-0 ${i.rotClass}`}
            >
              {/* washi tape */}
              <span
                className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-3 rounded-[2px] shadow-sm"
                style={{ background: `rgb(var(${i.tape}) / 0.55)` }}
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-black/5">
                <Image
                  src={i.image}
                  alt={i.title}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-4 text-center font-hand text-3xl leading-none text-[#33312e]">
                {i.title}
              </figcaption>
              {/* blurb note on hover */}
              <div
                className="pointer-events-none absolute -bottom-8 left-1/2 w-[94%] -translate-x-1/2 rotate-[-2deg] rounded-md border-2 bg-card px-3 py-2 text-center font-hand text-base leading-tight text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100"
                style={{ borderColor: `rgb(var(${i.tape}) / 0.5)` }}
              >
                {i.blurb}
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
