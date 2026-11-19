import { publicationCategories, type PublicationCategory } from "@/lib/site";
import { cn } from "@/lib/utils";

/** What kind a publication is (Report, Book, ...) as a small green tag; nothing if unsorted. */
export function PublicationCategoryTag({
  category,
  className,
}: {
  category: PublicationCategory | null;
  className?: string;
}) {
  const kind = publicationCategories.find((item) => item.id === category);
  if (!kind) return null;
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full bg-status-completed-bg px-3 py-1 text-xs font-bold tracking-wide text-status-completed-fg uppercase",
        className,
      )}
    >
      {kind.tag}
    </span>
  );
}
