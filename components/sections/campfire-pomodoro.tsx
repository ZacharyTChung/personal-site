"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

/** Synthesize a soft campfire (warm hiss + random crackles) with Web Audio. */
function createFire(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // base hiss: looping white noise through a lowpass
  const size = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < size; i++) ch[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 880;
  const hiss = ctx.createGain();
  hiss.gain.value = 0.05;
  noise.connect(lp);
  lp.connect(hiss);
  hiss.connect(master);
  noise.start();

  // random crackles
  let stopped = false;
  const crackle = () => {
    if (stopped) return;
    const dur = 0.03 + Math.random() * 0.05;
    const n = Math.floor(ctx.sampleRate * dur);
    const cbuf = ctx.createBuffer(1, n, ctx.sampleRate);
    const cd = cbuf.getChannelData(0);
    for (let i = 0; i < n; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource();
    src.buffer = cbuf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1100 + Math.random() * 2600;
    bp.Q.value = 0.7;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.14, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(master);
    src.start();
    window.setTimeout(crackle, 40 + Math.random() * 280);
  };
  crackle();

  master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.4);

  return {
    stop() {
      stopped = true;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.3);
      window.setTimeout(() => {
        try {
          noise.stop();
        } catch {}
        try {
          master.disconnect();
        } catch {}
      }, 400);
    },
  };
}

const STARS = [
  [10, 14],
  [22, 26],
  [34, 10],
  [48, 22],
  [60, 12],
  [70, 28],
  [82, 16],
  [90, 30],
  [16, 40],
  [78, 44],
];

function Pine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 64" className={className} aria-hidden="true">
      <rect x="17" y="48" width="6" height="16" fill="#13201a" />
      <path d="M20 4 L6 30 L34 30 Z" fill="#16271f" />
      <path d="M20 22 L3 52 L37 52 Z" fill="#13201a" />
    </svg>
  );
}

export function CampfirePomodoro() {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [sound, setSound] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const total = mode === "focus" ? FOCUS : BREAK;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left === 0) setRunning(false);
  }, [left]);

  // campfire audio while sound is on and the timer is running
  useEffect(() => {
    if (!(sound && running)) return;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    if (!ctxRef.current) ctxRef.current = new Ctor();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const fire = createFire(ctx);
    return () => fire.stop();
  }, [sound, running]);

  const pick = (m: "focus" | "break") => {
    setMode(m);
    setLeft(m === "focus" ? FOCUS : BREAK);
    setRunning(false);
  };

  const p = Math.max(0.14, left / total);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const done = left === 0;

  return (
    <div className="relative overflow-hidden">
      {/* dusk campsite sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #1b2742 0%, #2a3a52 55%, #33455b 100%)",
        }}
      />
      {/* stars */}
      {STARS.map(([x, y], i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-white/70"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
      {/* moon */}
      <div className="absolute right-[12%] top-[12%] h-8 w-8 rounded-full bg-[#e9eef6] opacity-80 shadow-[0_0_24px_rgba(220,232,248,0.5)]" />
      {/* ground */}
      <div className="absolute inset-x-0 bottom-0 h-[26%] bg-[#1f2b22]" />
      {/* flanking pines */}
      <Pine className="absolute bottom-[16%] left-[4%] h-24 w-14" />
      <Pine className="absolute bottom-[18%] left-[15%] h-16 w-10" />
      <Pine className="absolute bottom-[16%] right-[5%] h-24 w-14" />
      <Pine className="absolute bottom-[18%] right-[16%] h-16 w-10" />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-10">
        {/* mode toggle */}
        <div className="flex rounded-full border border-white/15 bg-white/5 p-1 font-hand text-lg">
          {(["focus", "break"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => pick(m)}
              className={`rounded-full px-5 py-0.5 transition-colors ${
                mode === m
                  ? "bg-[rgb(var(--c-warm-1)/0.25)] text-[#ffd9a0]"
                  : "text-white/55 hover:text-white/85"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* campfire */}
        <svg viewBox="0 0 200 170" className="h-36 w-36" aria-hidden="true">
          <defs>
            <linearGradient id="pomo-flame" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="rgb(var(--c-warm-3))" />
              <stop offset="0.5" stopColor="rgb(var(--c-warm-1))" />
              <stop offset="1" stopColor="#ffe6a8" />
            </linearGradient>
            <radialGradient id="pomo-glow" cx="50%" cy="60%" r="55%">
              <stop offset="0" stopColor="rgb(var(--c-warm-1) / 0.55)" />
              <stop offset="1" stopColor="transparent" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="142" rx={64 * p + 28} ry="22" fill="url(#pomo-glow)" />
          {[
            [56, 142],
            [78, 152],
            [100, 155],
            [122, 152],
            [144, 142],
          ].map(([cx, cy]) => (
            <ellipse key={cx} cx={cx} cy={cy} rx="11" ry="7" fill="#3a3631" />
          ))}
          <rect x="64" y="132" width="72" height="12" rx="6" fill="#6b4226" transform="rotate(11 100 138)" />
          <rect x="64" y="132" width="72" height="12" rx="6" fill="#7d4f2d" transform="rotate(-11 100 138)" />
          <g transform={`translate(100 134) scale(1 ${p}) translate(-100 -134)`}>
            {!done ? (
              <>
                <path className="flame" d="M100 134 C78 112 84 92 96 76 C92 94 100 102 106 106 C102 88 108 72 100 58 C122 82 126 108 116 128 C122 120 124 108 122 98 C132 116 128 130 100 134 Z" fill="url(#pomo-flame)" />
                <path className="flame flame-mid" d="M100 134 C89 118 91 104 99 92 C97 106 103 112 107 116 C105 98 109 88 105 80 C119 96 119 118 109 130 Z" fill="rgb(var(--c-warm-1))" />
                <path className="flame flame-core" d="M100 132 C94 120 96 108 101 98 C106 108 108 120 100 132 Z" fill="#ffeec2" />
              </>
            ) : (
              <ellipse cx="100" cy="130" rx="20" ry="5" fill="rgb(var(--c-warm-2))" opacity="0.7" />
            )}
          </g>
          {!done && (
            <>
              <circle className="ember" cx="86" cy="116" r="2" fill="rgb(var(--c-warm-1))" />
              <circle className="ember" cx="114" cy="110" r="1.6" fill="rgb(var(--c-warm-2))" style={{ animationDelay: "1.1s" }} />
            </>
          )}
        </svg>

        {/* timer */}
        <div className="text-center">
          <p className="font-display text-6xl font-bold tabular-nums text-[#f5ecda] md:text-7xl">
            {mm}:{ss}
          </p>
          <p className="mt-1 font-hand text-xl text-white/60">
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
            className="flex items-center gap-2 rounded-full border-2 border-[rgb(var(--c-warm-1)/0.5)] bg-[rgb(var(--c-warm-1)/0.18)] px-6 py-2 font-hand text-xl text-[#ffd9a0] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/15 text-white/60 transition-colors hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSound((s) => !s)}
            aria-label={sound ? "Mute campfire" : "Play campfire sound"}
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
              sound
                ? "border-[rgb(var(--c-warm-1)/0.5)] text-[#ffd9a0]"
                : "border-white/15 text-white/60 hover:text-white"
            }`}
          >
            {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>
        <p className="font-hand text-base text-white/45">
          {sound ? "crackle on (plays while the timer runs)" : "tap the speaker for fire sounds"}
        </p>
      </div>
    </div>
  );
}
