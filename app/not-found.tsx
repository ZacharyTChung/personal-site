import Link from "next/link";

const PINES: Array<{ size: number; color: string }> = [
  { size: 44, color: "#93ab5e" },
  { size: 64, color: "#7c9a4a" },
  { size: 48, color: "#5f7d3c" },
];

function Pine({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 3 L24 14 L20.5 14 L26 22 L18.5 22 L18.5 26 L13.5 26 L13.5 22 L6 22 L11.5 14 L8 14 Z"
        fill={color}
      />
      <rect x="13.5" y="24" width="5" height="5" rx="1.4" fill="#8a6b4a" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-end gap-3">
        {PINES.map((p, i) => (
          <Pine key={i} size={p.size} color={p.color} />
        ))}
      </div>
      <p className="font-hand text-2xl text-[rgb(var(--c-warm-1))]">
        you wandered off the trail
      </p>
      <h1 className="font-display text-6xl tracking-tight text-foreground">404</h1>
      <p className="max-w-sm text-muted-foreground">
        There is no page out here. Just trees.
      </p>
      <Link
        href="/"
        className="rounded-full border-2 border-[rgb(var(--c-warm-1)/0.55)] bg-[rgb(var(--c-warm-1)/0.15)] px-5 py-2 font-hand text-lg leading-none text-[rgb(var(--c-warm-1))] transition-transform hover:-rotate-2 hover:scale-105"
      >
        back to the clearing
      </Link>
    </main>
  );
}
