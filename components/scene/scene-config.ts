import type { FC } from "react";
import {
  TentSVG,
  LaptopLogSVG,
  BackpackSVG,
  SoccerBallSVG,
  BikeSVG,
  CampfireSVG,
  FlagSVG,
  GuitarSVG,
  SignpostSVG,
} from "./scene-objects";

/**
 * Per-plane parallax depth factors. Bigger factor = nearer = moves more.
 * Owned here so the whole scene's feel is tunable in one place.
 */
export const DEPTH = {
  sky: 2,
  far: 4,
  mid: 7,
  water: 4,
  ground: 11,
  objects: 12,
} as const;

export interface SceneHotspot {
  /** stable id, also used as the React key */
  id: string;
  /** existing section anchor this object navigates to, e.g. "#about" */
  targetId: string;
  label: string;
  sublabel: string;
  /** position as % of the scene container, center-anchored (desktop) */
  x: number;
  y: number;
  /** optional portrait overrides */
  xMobile?: number;
  yMobile?: number;
  /** relative size multiplier applied to the base object width */
  scale: number;
  /** idle-float timing — varied per object so the clearing feels alive */
  floatDuration: number;
  floatDelay: number;
  /** the flat-vector SVG rendered for this hotspot */
  Object: FC<{ className?: string }>;
}

/**
 * The interactive objects scattered in the clearing. Order matches the
 * Nav links (About → Experience → Stack → ... → Contact) so the
 * scene and the nav point at the same destinations and Tab order is logical.
 */
export const HOTSPOTS: SceneHotspot[] = [
  {
    id: "about",
    targetId: "#about",
    label: "About",
    sublabel: "a bit about me",
    x: 12,
    y: 70,
    xMobile: 26,
    yMobile: 42,
    scale: 1.15,
    floatDuration: 5.5,
    floatDelay: 0,
    Object: TentSVG,
  },
  {
    id: "experience",
    targetId: "#experience",
    label: "Experience",
    sublabel: "the trail so far",
    x: 38,
    y: 83,
    xMobile: 68,
    yMobile: 47,
    scale: 1.05,
    floatDuration: 5.1,
    floatDelay: 0.3,
    Object: SignpostSVG,
  },
  {
    id: "stack",
    targetId: "#stack",
    label: "Stack",
    sublabel: "what i build with",
    x: 29,
    y: 70,
    xMobile: 28,
    yMobile: 53,
    scale: 0.9,
    floatDuration: 5.0,
    floatDelay: 0.6,
    Object: BackpackSVG,
  },
  {
    id: "projects",
    targetId: "#projects",
    label: "Projects",
    sublabel: "my work",
    x: 47,
    y: 68,
    xMobile: 66,
    yMobile: 59,
    scale: 1.0,
    floatDuration: 4.6,
    floatDelay: 1.2,
    Object: LaptopLogSVG,
  },
  {
    id: "awards",
    targetId: "#awards",
    label: "Awards",
    sublabel: "wins",
    x: 91,
    y: 34,
    xMobile: 30,
    yMobile: 65,
    scale: 0.85,
    floatDuration: 5.3,
    floatDelay: 2.4,
    Object: FlagSVG,
  },
  {
    id: "interests",
    targetId: "#interests",
    label: "Interests",
    sublabel: "outside of work",
    x: 62,
    y: 78,
    xMobile: 70,
    yMobile: 70,
    scale: 0.7,
    floatDuration: 4.2,
    floatDelay: 2.1,
    Object: SoccerBallSVG,
  },
  {
    id: "music",
    targetId: "#music",
    label: "Focus",
    sublabel: "campfire pomodoro",
    x: 22,
    y: 86,
    xMobile: 28,
    yMobile: 76,
    scale: 0.95,
    floatDuration: 5.7,
    floatDelay: 1.4,
    Object: GuitarSVG,
  },
  {
    id: "ironman",
    targetId: "#ironman",
    label: "Goals",
    sublabel: "half ironman",
    x: 88,
    y: 68,
    xMobile: 66,
    yMobile: 81,
    scale: 1.2,
    floatDuration: 6.0,
    floatDelay: 0.9,
    Object: BikeSVG,
  },
  {
    id: "contact",
    targetId: "#contact",
    label: "Contact",
    sublabel: "get in touch",
    x: 73,
    y: 87,
    xMobile: 32,
    yMobile: 88,
    scale: 0.95,
    floatDuration: 4.8,
    floatDelay: 1.7,
    Object: CampfireSVG,
  },
];
