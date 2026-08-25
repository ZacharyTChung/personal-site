import { RaceCountdown } from "@/components/ui/race-countdown";
import { BikeSVG } from "@/components/scene/scene-objects";
import {
  SceneGlyph,
  SectionGlow,
  SectionEyebrow,
} from "@/components/ui/scene-accents";

export function IronmanSection() {
  return (
    <section
      id="ironman"
      className="relative overflow-hidden px-6 py-10 text-foreground md:py-12"
    >
      <SectionGlow accent="--c-pop-sky" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <SceneGlyph Object={BikeSVG} accent="--c-pop-sky" />
          <div>
            <SectionEyebrow accent="--c-pop-sky">goals</SectionEyebrow>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Ironman 70.3
            </h2>
          </div>
        </div>
        <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
          I&apos;m training for my first half Ironman this December in La
          Quinta: a 1.2 mile swim, a 56 mile bike, and a 13.1 mile run.
        </p>

        <div className="mt-6">
          <RaceCountdown
            raceDate="2026-12-06T07:00:00-08:00"
            trainingStart="2025-12-06T00:00:00-08:00"
            raceLabel="Ironman 70.3 La Quinta"
          />
        </div>
      </div>
    </section>
  );
}
