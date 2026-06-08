/**
 * Little hand-drawn SVG doodles. All paint with currentColor so you can tint
 * them with a text-color class. Decorative — always aria-hidden.
 */

export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 12" fill="none" aria-hidden="true" className={className}>
      <path
        d="M2 8 Q11 1 20 8 T38 8 T56 8 T74 8 T92 8 T110 8 T119 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 64" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 8 C32 12 52 22 64 46"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M50 42 L66 50 L60 33"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M12 1 C12.5 8 16 11.5 23 12 C16 12.5 12.5 16 12 23 C11.5 16 8 12.5 1 12 C8 11.5 11.5 8 12 1 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Burst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 4 L20 12" />
        <path d="M20 28 L20 36" />
        <path d="M4 20 L12 20" />
        <path d="M28 20 L36 20" />
        <path d="M9 9 L14 14" />
        <path d="M26 26 L31 31" />
        <path d="M31 9 L26 14" />
        <path d="M14 26 L9 31" />
      </g>
    </svg>
  );
}
