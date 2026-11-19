"use client";

import { mothsBagmatiProject } from "@/lib/content/moths-bagmati-project";
import { ProjectStatusTag } from "@/components/project-status-tag";
import { ListCard } from "@/components/list-card";
import { SearchableListPage } from "@/components/searchable-list-page";
import { formatLongDate } from "@/lib/format";
import type { Project } from "@/lib/types/project";

type ProjectsPageContentProps = {
  projects: Project[];
  /** The page's title (default "Our Projects"; the Ongoing and Completed pages set their own). */
  heading?: string;
  emptyMessage?: string;
};

export function ProjectsPageContent({
  projects,
  heading = "Our Projects",
  emptyMessage = "No projects are available yet.",
}: ProjectsPageContentProps) {
  return (
    <SearchableListPage
      items={projects}
      heading={heading}
      searchLabel="projects"
      emptyMessage={emptyMessage}
      noMatchMessage="No projects match your search."
      getKey={(project) => project.id}
      matchesQuery={(project, q) =>
        project.title.toLowerCase().includes(q) ||
        (formatLongDate(project.created_at)?.toLowerCase().includes(q) ?? false)
      }
      renderItem={(project) => (
        <ListCard
          href={`/projects/${project.slug}`}
          title={project.title}
          date={project.created_at}
          imageSrc={project.image_url}
          imageClassName={
            project.slug === mothsBagmatiProject.slug
              ? // The moth sits low and to one side of the photo; keep it in frame.
                "translate-x-[12px] scale-[1.5] object-cover object-[50%_56%] transition duration-300 group-hover:scale-[1.52] sm:translate-x-[30px]"
              : undefined
          }
          tag={(className) => <ProjectStatusTag slug={project.slug} className={className} />}
        />
      )}
    />
  );
}
