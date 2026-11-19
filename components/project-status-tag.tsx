import { projectStatusTagLabels, projectStatusTone, type ProjectStatusTone } from "@/lib/site";
import { cn } from "@/lib/utils";

const toneClass: Record<ProjectStatusTone, string> = {
  completed: "bg-status-completed-bg text-status-completed-fg",
  ongoing: "bg-status-ongoing-bg text-status-ongoing-fg",
  development: "bg-status-development-bg text-status-development-fg",
};

/** A project's status as a small coloured tag: Ongoing, Completed or In development. */
export function ProjectStatusTag({ slug, className }: { slug: string; className?: string }) {
  const tone = projectStatusTone(slug);
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase",
        toneClass[tone],
        className,
      )}
    >
      {projectStatusTagLabels[tone]}
    </span>
  );
}
