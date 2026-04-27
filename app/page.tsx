import { Nav } from "@/components/sections/nav";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Interests } from "@/components/sections/interests";
import { IronmanSection } from "@/components/sections/ironman";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Interests />
      <IronmanSection />
      <Contact />
    </main>
  );
}
