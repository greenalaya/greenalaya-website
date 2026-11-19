import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  homeArrowIconClass,
  homeArrowLinkClass,
  homeContainerClass,
  homeSectionHeadingClass,
} from "@/components/home-preview/home-styles";

export type PublicationListItem = {
  key: string;
  href: string;
  title: string;
  meta: string;
  cover: { src: string; alt: string };
};

/**
 * The latest publications with their covers shown large and whole. Columns follow the number
 * of publications, so two never leave an empty third column.
 */
export function HomePublications({ items }: { items: PublicationListItem[] }) {
  const { publications } = homeContent;
  if (items.length === 0) return null;
  const shown = items.slice(0, 3);

  return (
    <section
      id="publications"
      aria-labelledby="home-publications-title"
      className="scroll-mt-24 bg-home-field dark:bg-home-ground py-16 md:py-20"
    >
      <div className={homeContainerClass}>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h2 id="home-publications-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {publications.title}
          </h2>
          <Link href={publications.more.href} className={homeArrowLinkClass}>
            {publications.more.label}
            <ArrowRight aria-hidden className={homeArrowIconClass} />
          </Link>
        </div>

        <ul
          className={cn(
            "mt-8 grid gap-5 md:mt-10",
            shown.length > 1 && "md:grid-cols-2",
            shown.length > 2 && "lg:grid-cols-3",
          )}
        >
          {shown.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="group/pub flex h-full items-center gap-6 rounded-lg bg-home-ground p-5 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action sm:p-6"
              >
                <div className="relative aspect-[5/4] w-32 shrink-0 overflow-hidden bg-home-surface sm:w-48">
                  <Image
                    src={item.cover.src}
                    alt={item.cover.alt}
                    fill
                    sizes="(min-width: 640px) 192px, 128px"
                    className="object-contain p-1.5 transition-transform duration-300 ease-out motion-safe:group-hover/pub:scale-[1.04]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-home-accent">{item.meta}</p>
                  <p className="mt-1.5 text-xl leading-snug font-semibold text-balance text-home-ink transition-colors duration-200 group-hover/pub:text-home-accent sm:text-2xl">
                    {item.title}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
