import { ArrowUpRight } from "lucide-react";
import {
  homeContainerClass,
  homeScreenClass,
  homeSectionHeadingClass,
} from "@/components/home-preview/home-styles";
import { cn } from "@/lib/utils";

export type PressItem = {
  key: string;
  url: string;
  outlet: string;
  headline: string;
  /** The headline's language, e.g. "Nepali": anything but English is marked up as such. */
  language?: string;
};

/** HTML language codes for headlines that are not in the page's own language (English). */
const languageCodes: Record<string, string> = { Nepali: "ne" };

/** The most articles one screen holds (three columns, two rows); the newest come first. */
const MAX_ARTICLES = 6;

/**
 * "In the National Press": newspaper articles about the organisation's work, one tile each,
 * with the newspaper's name at the top and the headline at the foot. Every tile opens the
 * article on the newspaper's own site. The articles come from lib/content/media-coverage.ts;
 * with none, the section is left out.
 *
 * On a laptop the section fills one screen (under the fixed header), like the sections
 * before it: the tiles share the height left under the heading, in two columns for up to four
 * articles (bar three, which sit side by side) and three columns beyond that.
 */
export function HomePress({ items }: { items: PressItem[] }) {
  if (items.length === 0) return null;

  const shown = items.slice(0, MAX_ARTICLES);
  const threeColumns = shown.length === 3 || shown.length > 4;
  // One or two tall tiles have room for a headline the size of the other sections' lead titles.
  const large = shown.length <= 2;

  return (
    <section id="press" aria-labelledby="home-press-title" className={homeScreenClass}>
      <div className={cn(homeContainerClass, "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col")}>
        <h2
          id="home-press-title"
          // Phones and tablets: centred, like the sections above.
          className={`${homeSectionHeadingClass} text-home-ink max-lg:text-center`}
        >
          In the National Press
        </h2>
        <ul
          className={cn(
            "mt-8 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-4 lg:mt-8 lg:min-h-0 lg:flex-1 lg:auto-rows-fr lg:gap-6 lg:short:mt-6",
            threeColumns && "lg:grid-cols-3",
          )}
        >
          {shown.map((item) => (
            <li key={item.key} className="lg:min-h-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex h-full flex-col justify-between gap-2 bg-home-field p-5 sm:gap-8 sm:p-6 no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action sm:p-7 lg:overflow-hidden"
              >
                <span className="flex items-start justify-between gap-6">
                  <span className="text-sm font-semibold text-home-accent">{item.outlet}</span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 shrink-0 text-home-ink transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:transition-none"
                  />
                </span>
                <span
                  lang={item.language ? languageCodes[item.language] : undefined}
                  className={cn(
                    "block font-bold text-balance text-home-ink transition-colors duration-200 group-hover/link:text-home-accent",
                    large
                      ? "text-xl leading-snug lg:text-[clamp(1.75rem,2.4vw,2.125rem)] lg:leading-[1.15] lg:tracking-tight"
                      : "text-xl leading-snug lg:line-clamp-4",
                  )}
                >
                  {item.headline}
                </span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
