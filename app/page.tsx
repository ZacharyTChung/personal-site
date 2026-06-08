import { Nav } from "@/components/sections/nav";
import { ClearingScene } from "@/components/scene/clearing-scene";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { Projects } from "@/components/sections/projects";
import { Awards } from "@/components/sections/awards";
import { Interests } from "@/components/sections/interests";
import { Music } from "@/components/sections/music";
import { IronmanSection } from "@/components/sections/ironman";
import { Contact } from "@/components/sections/contact";
import { TrailScape } from "@/components/ui/trail-scape";

export default function Home() {
  return (
    <main className="relative">
      <TrailScape />
      <Nav />
      <ClearingScene />
      <About />
      <Stack />
      <Projects />
      <Awards />
      <Interests />
      <Music />
      <IronmanSection />
      <Contact />
    </main>
  );
}
