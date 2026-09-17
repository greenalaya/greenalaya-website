"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { mothsBagmatiProject } from "@/lib/content/moths-bagmati-project";
import { formatLongDate, SearchableListPage } from "@/components/searchable-list-page";
import type { Project } from "@/lib/types/project";

type ProjectsPageContentProps = {
  projects: Project[];
};

export function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  return (
    <SearchableListPage
      items={projects}
      heading="Our Projects"
      searchLabel="projects"
      emptyMessage="No projects are available yet."
      noMatchMessage="No projects match your search."
      getKey={(project) => project.id}
      matchesQuery={(project, q) =>
        project.title.toLowerCase().includes(q) ||
        (formatLongDate(project.created_at)?.toLowerCase().includes(q) ?? false)
      }
      renderItem={(project) => (
        <article className="group">
          <Link href={`/projects/${project.slug}`} className="block no-underline">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={
                    project.slug === mothsBagmatiProject.slug
                      ? "translate-x-[30px] scale-[1.5] object-cover object-[50%_56%] transition duration-300 group-hover:scale-[1.52]"
                      : "object-cover transition duration-300 group-hover:scale-[1.02]"
                  }
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e20] to-[#8bc34a]" />
              )}
            </div>
            <h3 className="mt-4 text-lg leading-snug font-normal text-foreground transition group-hover:text-primary sm:text-xl">
              {project.title}
            </h3>
            {project.created_at ? (
              <p className="mt-2 flex items-center gap-1.5 text-base italic text-muted-foreground">
                <CalendarDays className="size-4 shrink-0 not-italic text-primary" aria-hidden />
                {formatLongDate(project.created_at)}
              </p>
            ) : null}
          </Link>
        </article>
      )}
    />
  );
}
