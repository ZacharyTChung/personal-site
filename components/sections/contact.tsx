import { Mail, Github, Linkedin, MapPin, Phone } from "lucide-react";

type Seat = {
  icon: typeof Github;
  label: string;
  value: string;
  href: string | null;
  /** desktop position around the fire */
  pos: string;
};

const seats: Seat[] = [
  {
    icon: Github,
    label: "GitHub",
    value: "ZacharyTChung",
    href: "https://github.com/ZacharyTChung",
    pos: "md:left-[1%] md:top-[12%]",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "zacharychung",
    href: "https://www.linkedin.com/in/zacharychung",
    pos: "md:right-[1%] md:top-[12%]",
  },
  {
    icon: Mail,
    label: "Email",
    value: "zacharytylerchung@gmail.com",
    href: "mailto:zacharytylerchung@gmail.com",
    pos: "md:left-[4%] md:bottom-[10%]",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "626.491.8380",
    href: "tel:+16264918380",
    pos: "md:right-[4%] md:bottom-[10%]",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Los Angeles, CA",
    href: null,
    pos: "md:bottom-[-3%] md:left-1/2 md:-translate-x-1/2",
  },
];

function Campfire() {
  return (
    <svg
      viewBox="0 0 220 170"
      className="h-auto w-[210px] md:w-[250px]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cf-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="rgb(var(--c-warm-3))" />
          <stop offset="0.5" stopColor="rgb(var(--c-warm-1))" />
          <stop offset="1" stopColor="#ffe6a8" />
        </linearGradient>
        <radialGradient id="cf-glow" cx="50%" cy="62%" r="55%">
          <stop offset="0" stopColor="rgb(var(--c-warm-1) / 0.45)" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* ground glow */}
      <ellipse cx="110" cy="138" rx="98" ry="28" fill="url(#cf-glow)" />

      {/* stone ring */}
      {[
        [58, 142],
        [80, 152],
        [110, 156],
        [140, 152],
        [162, 142],
      ].map(([cx, cy]) => (
        <ellipse key={cx} cx={cx} cy={cy} rx="11" ry="7" fill="#46423b" />
      ))}
      {[
        [70, 149],
        [150, 149],
        [110, 152],
      ].map(([cx, cy]) => (
        <ellipse key={`d${cx}`} cx={cx} cy={cy} rx="7" ry="4.5" fill="#332f2a" />
      ))}

      {/* logs */}
      <rect x="74" y="130" width="72" height="12" rx="6" fill="#6b4226" transform="rotate(11 110 136)" />
      <rect x="74" y="130" width="72" height="12" rx="6" fill="#7d4f2d" transform="rotate(-11 110 136)" />

      {/* flames */}
      <path
        className="flame"
        d="M110 138 C86 116 92 96 104 80 C100 98 108 106 114 110 C110 92 116 78 110 62 C130 86 134 112 124 132 C130 124 132 112 130 102 C140 120 136 134 110 138 Z"
        fill="url(#cf-flame)"
      />
      <path
        className="flame flame-mid"
        d="M110 138 C99 122 101 108 109 96 C107 110 113 116 117 120 C115 102 119 92 115 84 C129 100 129 122 119 134 Z"
        fill="rgb(var(--c-warm-1))"
      />
      <path
        className="flame flame-core"
        d="M110 136 C104 124 106 112 111 102 C116 112 118 124 110 136 Z"
        fill="#ffeec2"
      />

      {/* embers */}
      <circle className="ember" cx="96" cy="118" r="2" fill="rgb(var(--c-warm-1))" style={{ animationDelay: "0s" }} />
      <circle className="ember" cx="124" cy="112" r="1.6" fill="rgb(var(--c-warm-2))" style={{ animationDelay: "1.1s" }} />
      <circle className="ember" cx="110" cy="122" r="1.5" fill="#ffe6a8" style={{ animationDelay: "2.2s" }} />
    </svg>
  );
}

function SeatCard({ seat }: { seat: Seat }) {
  const Icon = seat.icon;
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--c-warm-1)/0.35)] bg-[rgb(var(--c-warm-1)/0.12)] text-[rgb(var(--c-warm-1))]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 text-left">
        <span className="block text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {seat.label}
        </span>
        <span className="block break-all text-sm font-medium text-foreground">
          {seat.value}
        </span>
      </span>
    </>
  );

  const className = `flex w-full max-w-xs items-center gap-3 rounded-2xl border border-border bg-card/80 px-4 py-3 backdrop-blur transition md:absolute md:w-[226px] ${seat.pos}`;

  if (seat.href) {
    return (
      <a
        href={seat.href}
        target={seat.href.startsWith("http") ? "_blank" : undefined}
        rel={seat.href.startsWith("http") ? "noreferrer" : undefined}
        className={`${className} hover:-translate-y-0.5 hover:border-[rgb(var(--c-warm-1)/0.5)]`}
      >
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
}

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-6 pb-10 pt-10 text-foreground md:pt-12"
    >
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Contact
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Get in touch
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          I&apos;m looking for software engineering and technical product
          roles. Email is the fastest way to reach me.
        </p>

        {/* campfire with the socials gathered around it */}
        <div className="relative mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 md:mt-10 md:block md:h-[400px]">
          {/* warm hearth glow (desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl md:block"
            style={{
              background:
                "radial-gradient(circle, rgb(var(--c-warm-1) / 0.2), transparent 70%)",
            }}
          />

          {/* fire */}
          <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
            <Campfire />
          </div>

          {/* seats */}
          {seats.map((s) => (
            <SeatCard key={s.label} seat={s} />
          ))}
        </div>
      </div>

      <footer className="relative mt-10 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        <p>
          Built with Next.js and Tailwind. © {new Date().getFullYear()} Zachary
          Chung.
        </p>
      </footer>
    </section>
  );
}
