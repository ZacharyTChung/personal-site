import Image from "next/image";
import { RaceCountdown } from "@/components/ui/race-countdown";

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
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Goals
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
            What I&apos;m chasing.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Big goals keep me honest. The one I&apos;m chasing right now is my
            first half Ironman: a 1.2 mile swim, a 56 mile bike, and a 13.1
            mile run. There&apos;s no shortcut to it — you just keep showing
            up.
          </p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Same goes for most of what I build. The interesting parts are
            almost always in the boring middle.
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
