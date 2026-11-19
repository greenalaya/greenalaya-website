import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type ListCardProps = {
  href: string;
  title: string;
  /** ISO date, shown under the title. */
  date?: string | null;
  imageSrc?: string | null;
  imageAlt?: string;
  /** Replaces the picture's default fit, e.g. to keep the subject in frame. */
  imageClassName?: string;
  /** A small label (a project's status, a publication's kind), given its className here. */
  tag?: (className: string) => ReactNode;
};

/**
 * One card on the Projects, Publications, News and Blog pages. On phones it is a compact row,
 * a small picture beside the title, so several fit on a screen; from small tablets up, a
 * picture above the title in the grid.
 */
export function ListCard({
  href,
  title,
  date,
  imageSrc,
  imageAlt,
  imageClassName,
  tag,
}: ListCardProps) {
  const dateLabel = formatLongDate(date);
  return (
    <article className="group">
      <Link href={href} className="flex items-start gap-4 no-underline sm:block">
        <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-md bg-muted sm:w-auto sm:rounded-none">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt ?? title}
              fill
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 50vw, 33vw"
              className={cn(
                imageClassName ?? "object-cover transition duration-300 group-hover:scale-[1.02]",
              )}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e20] to-[#8bc34a]" />
          )}
          {/* On the picture from small tablets up; too big for the phone's small picture. */}
          {tag?.("absolute top-3 left-3 hidden shadow-[0_2px_8px_rgb(0_0_0/0.18)] sm:inline-flex")}
        </div>
        <div className="min-w-0">
          {tag?.("mb-1.5 px-2 py-0.5 text-[0.6875rem] sm:hidden")}
          <h3 className="text-base leading-snug font-semibold text-foreground transition group-hover:text-primary sm:mt-4 sm:text-xl">
            {title}
          </h3>
          {dateLabel ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground italic sm:mt-2 sm:text-base">
              <CalendarDays className="size-4 shrink-0 text-primary not-italic" aria-hidden />
              {dateLabel}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
