import { ProjectStagePage } from "@/components/project-stage-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ongoing Projects",
  description: "Greenalaya Nepal's projects that are under way.",
  path: "/projects/ongoing",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default function OngoingProjectsPage() {
  return <ProjectStagePage stage="ongoing" />;
}
