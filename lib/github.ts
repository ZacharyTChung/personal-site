/**
 * Curated auto-fetch for the Projects section.
 *
 * We keep a hand-picked allowlist of repos (so homework/forks never show up)
 * and merge in *live* data from the GitHub API — description, primary
 * language, stars, and last-pushed date — so the section stays current on each
 * deploy without hand-editing. Everything fetched is wrapped in try/catch with
 * a static fallback, so the page renders even with no network / rate limits.
 */

const USER = "ZacharyTChung";

export interface Project {
  slug: string;
  title: string;
  /** big faint monogram shown on the card cover */
  mark: string;
  description: string;
  tags: string[];
  /** CSS background for the generated cover */
  gradient: string;
  /** live / homepage URL, or null */
  href: string | null;
  repo: string;
  role?: string;
  award?: string;
  /** e.g. "Updated Jun 2026" */
  date: string;
  stars: number;
  language: string | null;
}

interface Override {
  repo: string;
  title: string;
  mark: string;
  tags: string[];
  gradient: string;
  role?: string;
  award?: string;
  /** fallback used only when GitHub has no description / fetch fails */
  blurb?: string;
  /** overrides GitHub homepage */
  live?: string;
}

/** Display order = curated order (most compelling / recent first). */
const CURATED: Override[] = [
  {
    repo: "alpha-edge",
    title: "Alpha Edge",
    mark: "AE",
    tags: ["Python", "Claude API", "Polymarket", "Kalshi", "Bayesian fusion"],
    gradient: "linear-gradient(135deg,#2a1d12 0%,#7a4a24 60%,#c4943f 100%)",
    role: "Built it",
    blurb:
      "Prediction-market intelligence engine that fuses Polymarket and Kalshi prices with multi-source sentiment classified by Claude, then Bayesian-fuses them into edge-tier signals.",
  },
  {
    repo: "shadowbox",
    title: "Shadowbox",
    mark: "SB",
    tags: ["TypeScript", "Three.js", "MediaPipe Pose", "WebGL", "Computer vision"],
    gradient: "linear-gradient(135deg,#2a1414 0%,#6e2f2f 60%,#c4553f 100%)",
    role: "Built it",
    blurb:
      "Browser-native boxing game controlled entirely by your webcam — punch, dodge, and block with your body. Powered by MediaPipe Pose and Three.js.",
  },
  {
    repo: "wandr",
    title: "Wandr",
    mark: "WN",
    tags: ["React Native", "Expo", "Firebase", "Mapbox GL", "TypeScript"],
    gradient: "linear-gradient(135deg,#102a28 0%,#1f5b54 60%,#3f9182 100%)",
    role: "Built it",
    blurb:
      "A cozy, image-first social travel map — pin the places you've been and want to go, and share itineraries. Built with Expo, Firebase, and Mapbox.",
  },
  {
    repo: "profbench",
    title: "ProfBench",
    mark: "PB",
    tags: ["Python", "Claude API", "LLM eval", "Hugging Face", "Streamlit"],
    gradient: "linear-gradient(135deg,#13241d 0%,#2e6048 60%,#5a9a6a 100%)",
    role: "Author",
    blurb:
      "Domain-specific LLM benchmark for procurement / source-to-pay reasoning (AfterQuery-style), with Claude as autograder, loss analysis, and a Hugging Face dataset export.",
  },
  {
    repo: "AdaptiveIO_Journal",
    title: "Adaptive I/O Study",
    mark: "IO",
    tags: ["C++", "Apache Arrow", "io_uring", "mmap", "Linux"],
    gradient: "linear-gradient(135deg,#161f2c 0%,#33506e 60%,#6a96b8 100%)",
    role: "Author",
    blurb:
      "17 controlled experiments across 8 phases comparing mmap vs io_uring for analytical I/O. Identified NVMe queue saturation as the scaling limit and shipped 5 engineering recommendations.",
  },
  {
    repo: "Agentic-Phone-Automation",
    title: "Agentic iOS Accessibility",
    mark: "iA",
    tags: ["Swift", "SwiftUI", "Claude API", "AVFoundation", "XCTest"],
    gradient: "linear-gradient(135deg,#20162e 0%,#4a3a6e 60%,#8a7ab8 100%)",
    role: "Hackathon",
    award: "3rd Place · SoCal Claude Hackathon (UCLA · USC · Caltech)",
    blurb:
      "Voice-driven iPhone agent that reads on-screen context, runs multi-step cross-app workflows, and narrates each action in real time for blind and low-vision users.",
  },
];

interface GhRepo {
  description: string | null;
  homepage: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
}

async function fetchRepo(name: string): Promise<GhRepo | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${USER}/${name}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      // ISR: refresh hourly without a rebuild
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as GhRepo;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  return Promise.all(
    CURATED.map(async (o): Promise<Project> => {
      const gh = await fetchRepo(o.repo);
      const liveDesc = gh?.description?.trim();
      const homepage = o.live ?? (gh?.homepage?.trim() || null);
      return {
        slug: o.repo,
        title: o.title,
        mark: o.mark,
        description: liveDesc || o.blurb || "",
        tags: o.tags,
        gradient: o.gradient,
        href: homepage,
        repo: gh?.html_url ?? `https://github.com/${USER}/${o.repo}`,
        role: o.role,
        award: o.award,
        date: gh?.pushed_at ? `Updated ${fmtDate(gh.pushed_at)}` : "",
        stars: gh?.stargazers_count ?? 0,
        language: gh?.language ?? null,
      };
    }),
  );
}

export const LANG_COLORS: Record<string, string> = {
  Python: "#3776ab",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  "C++": "#f34b7d",
  Swift: "#f05138",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
};
