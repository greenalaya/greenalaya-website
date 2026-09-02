import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { PageShell } from "@/components/page-shell";
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
    columns: "id, title, slug, description, image_url",
    orderColumn: "title",
    seed: seedProjects,
    label: "projects",
  });

  const butterfly = projects.find((project) => project.slug === butterflyProject.slug);

  return butterfly
    ? [{ ...butterfly, title: "Kathmandu Valley Butterfly Documentation" }]
    : seedProjects.filter((project) => project.slug === butterflyProject.slug);
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <PageShell
      title="Our Projects"
      description="Greenalaya Nepal's conservation, research, and innovation programs."
    >
      <ul className="mt-8 space-y-6">
        {projects.map((project) => (
          <li key={project.id}>
            <ContentCard>
              <h2 className="text-xl font-semibold text-secondary-foreground">
                <Link href={`/projects/${project.slug}`} className="hover:underline">
                  {project.title}
                </Link>
              </h2>
              {project.description ? (
                <p className="mt-2 text-foreground">{project.description}</p>
              ) : null}
            </ContentCard>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
