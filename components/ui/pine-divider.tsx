/**
 * A thin pine treeline silhouette band. Used at the top of the closing Contact
 * section as a "forest edge" before the fire — echoing the hero's pines.
 */
export function PineDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="rgb(var(--s-pine-near))"
        d="M0 48 L0 30 L30 6 L60 30 L96 4 L132 30 L168 8 L204 30 L246 2 L288 30 L324 8 L360 30 L402 4 L444 30 L486 8 L528 30 L570 2 L612 30 L654 8 L696 30 L738 4 L780 30 L822 8 L864 30 L906 2 L948 30 L990 8 L1032 30 L1074 4 L1116 30 L1152 8 L1200 30 L1200 48 Z"
      />
    </svg>
  );
}
