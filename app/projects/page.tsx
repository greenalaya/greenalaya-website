import { ProjectsPageContent } from "@/components/projects-page-content";
import { getProjectList } from "@/lib/content/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Projects",
  description: "Greenalaya Nepal's conservation, research, and innovation programs.",
  path: "/projects",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default async function ProjectsPage() {
  const projects = await getProjectList();
  return <ProjectsPageContent projects={projects} />;
}
