import { Fragment } from "react";
import { impactIsDraft, impactStats } from "@/lib/content/impact";
import { homeContainerClass, homeSectionHeadingClass } from "@/components/home/home-styles";
import { cn } from "@/lib/utils";

/**
 * Headline figures as a row of stat tiles, with every source listed once underneath.
 * Hidden while the figures are still a draft (`impactIsDraft` in lib/content/impact.ts):
 * unconfirmed numbers stay off the page until the team has checked them. `showDraft` shows
 * them anyway, for the (not indexed) test page where the section is being reviewed.
 * `publicationsCount` keeps the publications tile in step with the publications list.
 * `inScreen` (/home-preview-2): it shares one screen with the funders (see HomePreviewBody),
 * which sets the spacing, so the figures sit a little tighter on short laptop screens and the
 * sources line is left out to keep the screen uncrowded (the sources stay in impact.ts).
 */
export function HomeImpact({
  publicationsCount,
  showDraft = false,
  inScreen = false,
}: {
  publicationsCount?: number;
  showDraft?: boolean;
  inScreen?: boolean;
}) {
  if (impactIsDraft && !showDraft) return null;

  const stats = impactStats.map((stat) =>
    stat.id === "publications" && typeof publicationsCount === "number"
      ? { ...stat, value: String(publicationsCount) }
      : stat,
  );
  // Several figures share a source; list each source once.
  const sources = [...new Map(stats.map((stat) => [stat.source.href, stat.source])).values()];

  return (
    <section
      id="impact"
      aria-labelledby="impact-title"
      className={cn("scroll-mt-24", inScreen ? "pt-12 lg:pt-10" : "py-16 md:py-20")}
    >
      <div className={homeContainerClass}>
        <h2 id="impact-title" className={`${homeSectionHeadingClass} text-home-ink`}>
          Our impact so far
        </h2>
        <ul
          className={cn(
            "mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
            inScreen && "lg:short:mt-6",
          )}
        >
          {stats.map((stat) => (
            <li
              key={stat.id}
              className={cn("rounded-lg bg-home-field p-5", inScreen && "lg:short:p-4")}
            >
              <p className="text-[clamp(2.25rem,4vw,3rem)] leading-none font-bold tracking-tight text-home-ink tabular-nums">
                {stat.value}
              </p>
              <p className="mt-3 text-sm leading-snug text-home-ink">{stat.label}</p>
            </li>
          ))}
        </ul>
        {inScreen ? null : (
          <p className="mt-4 text-sm leading-relaxed text-home-muted">
            Sources:{" "}
            {sources.map((source, index) => (
              <Fragment key={source.href}>
                {index > 0 ? ", " : null}
                <a
                  href={source.href}
                  {...(source.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-home-accent underline decoration-home-accent/40 underline-offset-2 hover:decoration-home-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action"
                >
                  {source.label}
                  {source.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </Fragment>
            ))}
            .
          </p>
        )}
      </div>
    </section>
  );
}
