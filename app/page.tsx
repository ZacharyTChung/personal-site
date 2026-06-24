import { getProjects } from "@/lib/github";
import { SiteExperience } from "@/components/scene/site-experience";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { ProjectsCarousel } from "@/components/sections/projects-carousel";
import { Awards } from "@/components/sections/awards";
import { Interests } from "@/components/sections/interests";
import { Music } from "@/components/sections/music";
import { IronmanSection } from "@/components/sections/ironman";
import { Contact } from "@/components/sections/contact";
import type { SectionKey } from "@/components/scene/section-keys";
import type { ReactNode } from "react";

export default async function Home() {
  // Projects come from GitHub, so render the sections here on the server and
  // hand them to the clearing as ready-made panels opened by clicking objects.
  const projects = await getProjects();

  const sections: Record<SectionKey, ReactNode> = {
    about: <About />,
    stack: <Stack />,
    projects: <ProjectsCarousel projects={projects} />,
    awards: <Awards />,
    interests: <Interests />,
    music: <Music />,
    ironman: <IronmanSection />,
    contact: <Contact />,
  };

  return (
    <main className="relative">
      <SiteExperience sections={sections} />
    </main>
  );
}
