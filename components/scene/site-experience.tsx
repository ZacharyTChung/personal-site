"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Nav } from "@/components/sections/nav";
import { ClearingHero } from "@/components/scene/clearing-hero";
import { SectionDetail } from "@/components/scene/section-detail";
import { isSectionKey, type SectionKey } from "@/components/scene/section-keys";

/**
 * The site is the clearing: click an object (or a nav link) to open its section
 * as an overlay panel. This client wrapper owns the "which panel is open" state
 * and feeds it to the nav, the scene, and the overlay. The panel contents
 * (`sections`) are the existing section components, rendered on the server.
 *
 * The open panel lives in the URL hash (#about, #projects, ...) so panels are
 * shareable links and the browser back button closes them.
 */
export function SiteExperience({
  sections,
}: {
  sections: Record<SectionKey, ReactNode>;
}) {
  const [selected, setSelected] = useState<SectionKey | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const key = window.location.hash.slice(1);
      setSelected(isSectionKey(key) ? key : null);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  const open = useCallback((key: SectionKey) => {
    // remember what opened the panel so focus can go back to it on close;
    // the hash push means the back button closes the panel too
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    window.location.hash = key;
  }, []);

  const close = useCallback(() => {
    setSelected(null);
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // hand focus back once the panel is gone and the page is interactive again
  useEffect(() => {
    if (selected === null) {
      openerRef.current?.focus();
      openerRef.current = null;
    }
  }, [selected]);

  return (
    <MotionConfig reducedMotion="user">
      <div inert={selected !== null}>
        <Nav onSelect={open} />
        <ClearingHero onSelect={open} />
      </div>
      <SectionDetail selected={selected} sections={sections} onClose={close} />
    </MotionConfig>
  );
}
