import { CampfireSVG } from "@/components/scene/scene-objects";
import {
  SceneGlyph,
  SectionGlow,
  SectionEyebrow,
} from "@/components/ui/scene-accents";
import { CampfirePomodoro } from "./campfire-pomodoro";

export function Music() {
  return (
    <section
      id="music"
      className="relative overflow-hidden px-6 py-10 text-foreground md:py-12"
    >
      <SectionGlow accent="--c-pop-pink" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <div className="flex items-center gap-4">
          <SceneGlyph Object={CampfireSVG} accent="--c-pop-pink" />
          <div>
            <SectionEyebrow accent="--c-pop-pink">focus</SectionEyebrow>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Campfire pomodoro
            </h2>
          </div>
        </div>

        <p className="mt-6 max-w-xl text-muted-foreground">
          A pomodoro timer I built into the site. Start a session and the
          fire burns until time is up.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-lg">
          <CampfirePomodoro />
        </div>
      </div>
    </section>
  );
}
