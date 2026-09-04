import { ProjectsPageContent } from "@/components/projects-page-content";
import { butterflyProject } from "@/lib/content/butterfly-project";
import { fetchListWithFallback } from "@/lib/content/fetch-list-with-fallback";
import { seedProjects } from "@/lib/content/seed";
import { pageMetadata } from "@/lib/seo";
import type { Project } from "@/lib/types/project";

export const metadata = pageMetadata({
  title: "Our Projects",
  description: "Greenalaya Nepal's conservation, research, and innovation programs.",
  path: "/projects",
});

export const revalidate = 300;
export const dynamic = "force-static";

async function getProjects(): Promise<Project[]> {
  const projects = await fetchListWithFallback<Project>({
    table: "projects",
    columns: "id, title, slug, description, image_url, created_at",
    orderColumn: "title",
    seed: seedProjects,
    label: "projects",
  });

  const butterfly = projects.find((project) => project.slug === butterflyProject.slug);

  return butterfly
    ? [
        {
          ...butterfly,
          title: "Kathmandu Valley Butterfly Documentation",
          image_url: butterfly.image_url ?? "/images/projects/godawari-butterfly-watch.webp",
        },
      ]
    : seedProjects.filter((project) => project.slug === butterflyProject.slug);
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageContent projects={projects} />;
}
