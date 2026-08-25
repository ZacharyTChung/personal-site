"use client";

import { useEffect, useState } from "react";

interface RaceCountdownProps {
  raceDate: string;
  trainingStart: string;
  raceLabel?: string;
}

function diff(target: number) {
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

export function RaceCountdown({
  raceDate,
  trainingStart,
  raceLabel,
}: RaceCountdownProps) {
  const target = new Date(raceDate).getTime();
  const start = new Date(trainingStart).getTime();
  const [tick, setTick] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [now, setNow] = useState(start);

  useEffect(() => {
    // seed the countdown right away so it doesn't sit at zero for a second;
    // it can't be computed during render without a hydration mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTick(diff(target));
    setNow(Date.now());
    const id = setInterval(() => {
      setTick(diff(target));
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const total = target - start;
  const elapsed = Math.min(total, Math.max(0, now - start));
  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  const units: Array<[string, number]> = [
    ["Days", tick.days],
    ["Hours", tick.hours],
    ["Minutes", tick.minutes],
    ["Seconds", tick.seconds],
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm md:p-8">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Race day
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground md:text-3xl">
            {raceLabel ?? "Ironman"}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(raceDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2 md:gap-3">
        {units.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-xl border border-border bg-muted/40 p-2 text-center md:p-3"
          >
            <p className="font-display text-2xl font-bold tabular-nums text-foreground md:text-4xl">
              {value.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 truncate text-[9px] uppercase tracking-[0.12em] text-muted-foreground md:text-[11px]">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Training progress</span>
          <span className="tabular-nums text-foreground">{pct.toFixed(1)}%</span>
        </div>
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/80 transition-[width] duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>
            {new Date(trainingStart).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>
            {new Date(raceDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
