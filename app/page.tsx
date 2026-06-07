import { Nav } from "@/components/sections/nav";
import { ClearingScene } from "@/components/scene/clearing-scene";
import { About } from "@/components/sections/about";
import { Stack } from "@/components/sections/stack";
import { Projects } from "@/components/sections/projects";
import { Interests } from "@/components/sections/interests";
import { IronmanSection } from "@/components/sections/ironman";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <ClearingScene />
      <About />
      <Stack />
      <Projects />
      <Interests />
      <IronmanSection />
      <Contact />
    </main>
  );
}
