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
  const remoteProjects = await fetchListWithFallback<Project>({
    table: "projects",
    columns: "id, title, slug, description, image_url, created_at",
    orderColumn: "title",
    seed: seedProjects,
    label: "projects",
  });

  // Supabase's projects table carries legacy rows beyond our known projects
  // (leftover thematic-area placeholders) — only ever show the projects we
  // actually maintain in seedProjects, picking up a live override by slug
  // where one exists.
  const remoteBySlug = new Map(remoteProjects.map((project) => [project.slug, project]));

  return seedProjects.map((project) => {
    const current = remoteBySlug.get(project.slug) ?? project;
    return current.slug === butterflyProject.slug
      ? {
          ...current,
          title: "Kathmandu Valley Butterfly Documentation",
          image_url: current.image_url ?? "/images/projects/godawari-butterfly-watch.webp",
        }
      : current;
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageContent projects={projects} />;
}
