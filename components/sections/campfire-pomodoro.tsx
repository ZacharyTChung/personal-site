"use client";

import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

export function CampfirePomodoro() {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);

  const total = mode === "focus" ? FOCUS : BREAK;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left === 0) setRunning(false);
  }, [left]);

  const pick = (m: "focus" | "break") => {
    setMode(m);
    setLeft(m === "focus" ? FOCUS : BREAK);
    setRunning(false);
  };

  // fire burns down as the session runs (1 = full, ~0 = embers)
  const p = Math.max(0.14, left / total);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const done = left === 0;

  return (
    <div className="flex flex-col items-center gap-6 px-6 py-10">
      {/* mode toggle */}
      <div className="flex rounded-full border-2 border-border bg-background/60 p-1 font-hand text-lg">
        {(["focus", "break"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => pick(m)}
            className={`rounded-full px-5 py-1 transition-colors ${
              mode === m
                ? "bg-[rgb(var(--c-warm-1)/0.18)] text-[rgb(var(--c-warm-1))]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "focus" ? "focus" : "break"}
          </button>
        ))}
      </div>

      {/* campfire */}
      <svg viewBox="0 0 200 180" className="h-44 w-44" aria-hidden="true">
        <defs>
          <linearGradient id="pomo-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="rgb(var(--c-warm-3))" />
            <stop offset="0.5" stopColor="rgb(var(--c-warm-1))" />
            <stop offset="1" stopColor="#ffe6a8" />
          </linearGradient>
          <radialGradient id="pomo-glow" cx="50%" cy="62%" r="55%">
            <stop offset="0" stopColor="rgb(var(--c-warm-1) / 0.5)" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="150" rx={70 * p + 26} ry="22" fill="url(#pomo-glow)" />

        {/* stones */}
        {[
          [56, 150],
          [78, 160],
          [100, 163],
          [122, 160],
          [144, 150],
        ].map(([cx, cy]) => (
          <ellipse key={cx} cx={cx} cy={cy} rx="11" ry="7" fill="#46423b" />
        ))}

        {/* logs */}
        <rect x="64" y="140" width="72" height="12" rx="6" fill="#6b4226" transform="rotate(11 100 146)" />
        <rect x="64" y="140" width="72" height="12" rx="6" fill="#7d4f2d" transform="rotate(-11 100 146)" />

        {/* flames — scaled by remaining time, around the base */}
        <g transform={`translate(100 142) scale(1 ${p}) translate(-100 -142)`}>
          {!done && (
            <>
              <path
                className="flame"
                d="M100 142 C78 120 84 100 96 84 C92 102 100 110 106 114 C102 96 108 80 100 66 C122 90 126 116 116 136 C122 128 124 116 122 106 C132 124 128 138 100 142 Z"
                fill="url(#pomo-flame)"
              />
              <path
                className="flame flame-mid"
                d="M100 142 C89 126 91 112 99 100 C97 114 103 120 107 124 C105 106 109 96 105 88 C119 104 119 126 109 138 Z"
                fill="rgb(var(--c-warm-1))"
              />
              <path
                className="flame flame-core"
                d="M100 140 C94 128 96 116 101 106 C106 116 108 128 100 140 Z"
                fill="#ffeec2"
              />
            </>
          )}
          {done && (
            <ellipse cx="100" cy="138" rx="20" ry="5" fill="rgb(var(--c-warm-2))" opacity="0.7" />
          )}
        </g>

        {/* embers */}
        {!done && (
          <>
            <circle className="ember" cx="86" cy="124" r="2" fill="rgb(var(--c-warm-1))" />
            <circle className="ember" cx="114" cy="118" r="1.6" fill="rgb(var(--c-warm-2))" style={{ animationDelay: "1.1s" }} />
          </>
        )}
      </svg>

      {/* timer */}
      <div className="text-center">
        <p className="font-display text-6xl font-bold tabular-nums text-foreground md:text-7xl">
          {mm}:{ss}
        </p>
        <p className="mt-1 font-hand text-xl text-muted-foreground">
          {done
            ? mode === "focus"
              ? "nice work, take a break"
              : "break over, back to it"
            : mode === "focus"
              ? "keep the fire going"
              : "rest by the fire"}
        </p>
      </div>

      {/* controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={done}
          className="flex items-center gap-2 rounded-full border-2 border-[rgb(var(--c-warm-1)/0.5)] bg-[rgb(var(--c-warm-1)/0.15)] px-6 py-2 font-hand text-xl text-[rgb(var(--c-warm-1))] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "pause" : "start"}
        </button>
        <button
          type="button"
          onClick={() => {
            setLeft(total);
            setRunning(false);
          }}
          aria-label="Reset timer"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
