import type { FC } from "react";
import {
  TentSVG,
  LaptopLogSVG,
  BackpackSVG,
  SoccerBallSVG,
  BikeSVG,
  CampfireSVG,
} from "./scene-objects";

/**
 * Per-plane parallax depth factors. Bigger factor = nearer = moves more.
 * Owned here so the whole scene's feel is tunable in one place.
 */
export const DEPTH = {
  sky: 4,
  far: 10,
  mid: 18,
  water: 8,
  ground: 30,
  objects: 34,
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
 * The six interactive objects scattered in the clearing. Order matches the
 * Nav links (About → Projects → Stack → Interests → Goals → Contact) so the
 * scene and the nav point at the same destinations and Tab order is logical.
 */
export const HOTSPOTS: SceneHotspot[] = [
  {
    id: "about",
    targetId: "#about",
    label: "About",
    sublabel: "Pull up a chair",
    x: 19,
    y: 61,
    xMobile: 28,
    yMobile: 47,
    scale: 1.15,
    floatDuration: 5.5,
    floatDelay: 0,
    Object: TentSVG,
  },
  {
    id: "projects",
    targetId: "#projects",
    label: "Projects",
    sublabel: "What I've built",
    x: 38,
    y: 75,
    xMobile: 70,
    yMobile: 56,
    scale: 1.0,
    floatDuration: 4.6,
    floatDelay: 1.2,
    Object: LaptopLogSVG,
  },
  {
    id: "stack",
    targetId: "#stack",
    label: "Stack",
    sublabel: "What's in my pack",
    x: 57,
    y: 65,
    xMobile: 30,
    yMobile: 65,
    scale: 0.9,
    floatDuration: 5.0,
    floatDelay: 0.6,
    Object: BackpackSVG,
  },
  {
    id: "interests",
    targetId: "#interests",
    label: "Interests",
    sublabel: "Off the clock",
    x: 70,
    y: 80,
    xMobile: 71,
    yMobile: 74,
    scale: 0.7,
    floatDuration: 4.2,
    floatDelay: 2.1,
    Object: SoccerBallSVG,
  },
  {
    id: "ironman",
    targetId: "#ironman",
    label: "Goals",
    sublabel: "Ironman 70.3",
    x: 84,
    y: 60,
    xMobile: 32,
    yMobile: 82,
    scale: 1.2,
    floatDuration: 6.0,
    floatDelay: 0.9,
    Object: BikeSVG,
  },
  {
    id: "contact",
    targetId: "#contact",
    label: "Contact",
    sublabel: "Say hi by the fire",
    x: 48,
    y: 87,
    xMobile: 68,
    yMobile: 88,
    scale: 0.95,
    floatDuration: 4.8,
    floatDelay: 1.7,
    Object: CampfireSVG,
  },
];
