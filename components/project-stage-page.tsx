import { ProjectsPageContent } from "@/components/projects-page-content";
import { getProjectList } from "@/lib/content/projects";
import { projectStage, projectStages, type ProjectStage } from "@/lib/site";

/** The Ongoing or Completed projects page (/projects/ongoing, /projects/completed). */
export async function ProjectStagePage({ stage }: { stage: ProjectStage }) {
  const projects = (await getProjectList()).filter(
    (project) => projectStage(project.slug) === stage,
  );
  const { label } = projectStages.find((item) => item.id === stage)!;
  return (
    <ProjectsPageContent
      projects={projects}
      heading={label}
      emptyMessage={`There are no ${stage} projects at the moment.`}
    />
  );
}
