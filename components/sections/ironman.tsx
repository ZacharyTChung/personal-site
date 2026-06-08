import Image from "next/image";
import { RaceCountdown } from "@/components/ui/race-countdown";
import { BikeSVG } from "@/components/scene/scene-objects";
import { SceneGlyph, SectionEyebrow } from "@/components/ui/scene-accents";

export function IronmanSection() {
  return (
    <section
      id="ironman"
      className="relative overflow-hidden bg-background px-6 py-20 text-foreground"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1920&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover opacity-15 grayscale"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div className="flex items-center gap-4">
            <SceneGlyph Object={BikeSVG} accent="--c-pop-sky" />
            <div>
              <SectionEyebrow accent="--c-pop-sky">The route</SectionEyebrow>
              <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-6xl">
                What I&apos;m chasing.
              </h2>
            </div>
          </div>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Right now it&apos;s my first half-Ironman: a 1.2-mile swim, 56 on
            the bike, then a 13.1 run. No shortcut to that one — you just keep
            showing up.
          </p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Same goes for most of what I build. The good parts are usually
            buried somewhere in the boring middle.
          </p>
        </div>

        <RaceCountdown
          raceDate="2026-12-06T07:00:00-08:00"
          trainingStart="2025-12-06T00:00:00-08:00"
          raceLabel="Ironman 70.3 La Quinta"
        />
      </div>
    </section>
  );
}
