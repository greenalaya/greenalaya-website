import { ProjectStagePage } from "@/components/project-stage-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Completed Projects",
  description: "Greenalaya Nepal's finished projects and what came of them.",
  path: "/projects/completed",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default function CompletedProjectsPage() {
  return <ProjectStagePage stage="completed" />;
}
