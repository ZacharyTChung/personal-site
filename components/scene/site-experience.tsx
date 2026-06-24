"use client";

import { useState, type ReactNode } from "react";
import { Nav } from "@/components/sections/nav";
import { ClearingHero } from "@/components/scene/clearing-hero";
import { SectionDetail } from "@/components/scene/section-detail";
import type { SectionKey } from "@/components/scene/section-keys";

/**
 * The site is the clearing: click an object (or a nav link) to open its section
 * as an overlay panel. This client wrapper owns the "which panel is open" state
 * and feeds it to the nav, the scene, and the overlay. The panel contents
 * (`sections`) are the existing section components, rendered on the server.
 */
export function SiteExperience({
  sections,
}: {
  sections: Record<SectionKey, ReactNode>;
}) {
  const [selected, setSelected] = useState<SectionKey | null>(null);

  return (
    <>
      <Nav onSelect={setSelected} />
      <ClearingHero onSelect={setSelected} />
      <SectionDetail
        selected={selected}
        sections={sections}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
