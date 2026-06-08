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
import { TrailDivider } from "@/components/ui/trail-divider";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <ClearingScene />
      <TrailDivider terrain="forest" />
      <About />
      <TrailDivider terrain="meadow" />
      <Stack />
      <TrailDivider terrain="desert" />
      <Projects />
      <TrailDivider terrain="rocky" />
      <Awards />
      <TrailDivider terrain="alpine" />
      <Interests />
      <TrailDivider terrain="river" />
      <Music />
      <TrailDivider terrain="forest" />
      <IronmanSection />
      <TrailDivider terrain="meadow" />
      <Contact />
    </main>
  );
}
