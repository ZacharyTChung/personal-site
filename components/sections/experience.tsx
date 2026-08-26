import { Briefcase, GraduationCap, Users } from "lucide-react";
import { SignpostSVG } from "@/components/scene/scene-objects";
import {
  SceneGlyph,
  SectionGlow,
  SectionEyebrow,
} from "@/components/ui/scene-accents";

const roles = [
  {
    org: "USC Networked Systems Lab",
    title: "Undergraduate Research Assistant",
    sub: "Viterbi School of Engineering · Los Angeles, CA",
    date: "Dec 2025 to Present",
    points: [
      "Accelerated selective queries 1.30x to 8.14x over tuned Parquet across seven workloads with byte identical Apache Arrow output, by building the benchmarking harness for Mica, a page addressable columnar storage format.",
      "Cut a point query 257x, from 632 ms to 2.46 ms, by implementing page level pruning that touched 6 of 59,543 pages and read 0.18 MiB instead of the full column.",
      "Outperformed indexed Lance and isolated the residual Parquet gap to metadata overhead, ruling out compression and layout as the cause.",
    ],
  },
  {
    org: "AfterQuery (YC S23)",
    title: "SWE Benchmark Task Author, Contract",
    sub: "San Francisco, CA",
    date: "May 2026 to Aug 2026",
    points: [
      "Authored expert level software engineering problems with reference solutions and verifying test suites, tuning difficulty against measured agent solve rates near 70%.",
      "Reviewed peer authored tasks, gating submissions on correctness, reproducibility, and difficulty calibration before release.",
      "Delivered against a multi stage human and model review pipeline at an 87% acceptance rate.",
    ],
  },
];

const leadership = [
  {
    org: "ACM at USC",
    title: "Operations Chair",
    sub: "USC chapter of ACM, the global computing society · 200+ members · Los Angeles, CA",
    date: "Nov 2025 to Present",
    points: [
      "Run weekly meetings and 30+ attendee technical events with speakers from Cisco and Netflix, and help raise $10,000 annually to fund member travel to ACM research conferences.",
    ],
  },
  {
    org: "CodeCanBridge",
    title: "Cofounder and Curriculum Developer",
    sub: "Arcadia, CA",
    date: "April 2022 to May 2024",
    points: [
      "Cofounded a nonprofit teaching coding to 20 students with special needs and drove a district wide special education CS curriculum revision.",
    ],
  },
];

const coursework = [
  "Data Structures and Object Oriented Design",
  "Algorithms",
  "Computer Systems",
  "Databases",
  "Discrete Methods",
];

function RoleCard({ role }: { role: (typeof roles)[number] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[rgb(var(--c-pop-gold)/0.5)]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-semibold leading-snug text-foreground">
          {role.org}
        </h3>
        <span className="font-hud text-[9px] uppercase tracking-wider text-[rgb(var(--c-warm-1))]">
          {role.date}
        </span>
      </div>
      <p className="mt-0.5 text-sm font-medium text-foreground/80">
        {role.title}
      </p>
      <p className="text-sm text-muted-foreground">{role.sub}</p>
      <ul className="mt-3 space-y-2">
        {role.points.map((point) => (
          <li
            key={point}
            className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--c-pop-gold))]"
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupLabel({
  icon: Icon,
  children,
}: {
  icon: typeof Briefcase;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 flex items-center gap-2 text-[rgb(var(--c-warm-1))] first:mt-0">
      <Icon className="h-4 w-4" />
      <span className="font-hand text-xl lowercase leading-none">
        {children}
      </span>
    </div>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden px-6 py-10 text-foreground md:py-12"
    >
      <SectionGlow accent="--c-pop-gold" />
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="flex items-center gap-4">
          <SceneGlyph Object={SignpostSVG} accent="--c-pop-gold" />
          <div>
            <SectionEyebrow accent="--c-pop-gold">
              the trail so far
            </SectionEyebrow>
            <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Experience
            </h2>
          </div>
        </div>

        <div className="mt-8">
          <GroupLabel icon={Briefcase}>work and research</GroupLabel>
          <div className="mt-4 space-y-5">
            {roles.map((role) => (
              <RoleCard key={role.org} role={role} />
            ))}
          </div>

          <GroupLabel icon={Users}>leadership</GroupLabel>
          <div className="mt-4 space-y-5">
            {leadership.map((role) => (
              <RoleCard key={role.org} role={role} />
            ))}
          </div>

          <GroupLabel icon={GraduationCap}>education</GroupLabel>
          <div className="mt-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[rgb(var(--c-pop-gold)/0.5)]">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold leading-snug text-foreground">
                University of Southern California
              </h3>
              <span className="font-hud text-[9px] uppercase tracking-wider text-[rgb(var(--c-warm-1))]">
                Expected May 2028
              </span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-foreground/80">
              B.S. Computer Science and Business Administration
            </p>
            <p className="text-sm text-muted-foreground">
              Viterbi and Marshall · Los Angeles, CA
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Relevant coursework
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {coursework.map((course) => (
                <span
                  key={course}
                  className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-foreground/80"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
