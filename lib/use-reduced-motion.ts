"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Wrapper over framer-motion's useReducedMotion that returns a guaranteed
 * boolean (it can yield `null` before hydration). Used to gate parallax,
 * idle-float, ambient loops, and smooth-scroll across the scene.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}
