import { GuitarSVG } from "@/components/scene/scene-objects";
import {
  SceneGlyph,
  SectionGlow,
  SectionEyebrow,
} from "@/components/ui/scene-accents";

// Paste a Spotify playlist id here — the part after /playlist/ in the share
// link (e.g. "37i9dQZF1DX0XUsuxWHRQd"). Leave empty to show the placeholder.
const PLAYLIST_ID = "";

export function Music() {
  return (
    <section
      id="music"
      className="relative overflow-hidden bg-background px-6 py-20 text-foreground"
    >
      <SectionGlow accent="--c-pop-pink" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <SceneGlyph Object={GuitarSVG} accent="--c-pop-pink" />
          <div>
            <SectionEyebrow accent="--c-pop-pink">By the fire</SectionEyebrow>
            <h2 className="mt-1 font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Campfire playlist.
            </h2>
          </div>
        </div>

        <p className="mt-6 max-w-xl text-muted-foreground">
          What&apos;s usually on while I&apos;m building, or winding down at the
          end of a long day.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          {PLAYLIST_ID ? (
            <iframe
              title="Campfire playlist"
              src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
              width="100%"
              height="380"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block w-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <span className="font-hud text-[10px] uppercase tracking-widest text-[rgb(var(--c-warm-1))]">
                ▸ Now playing
              </span>
              <p className="text-foreground">Pull up a log — I&apos;ll put something on.</p>
              <p className="text-sm text-muted-foreground">
                Playlist landing here soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
