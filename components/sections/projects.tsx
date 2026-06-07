import { getProjects } from "@/lib/github";
import { ProjectsCarousel } from "./projects-carousel";

export async function Projects() {
  const projects = await getProjects();
  return <ProjectsCarousel projects={projects} />;
}
