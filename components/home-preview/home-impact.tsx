import type { CSSProperties } from "react";
import { impactIsDraft, impactMilestones as allMilestones } from "@/lib/content/impact";

// The frozen copy keeps the six stops it was built for ("established" was added later).
const impactMilestones = allMilestones.filter((item) => item.id !== "established");
import {
  homeContainerClass,
  homeSectionBodyClass,
  homeSectionHeadingClass,
  homeSectionSpaceClass,
} from "@/components/home-preview/home-styles";
import { cn } from "@/lib/utils";

// The trail: a wave across a 600 x 100 box that is low at the 1st, 3rd and 5th stops and
// high at the 2nd, 4th and 6th.
const trailPoints = Array.from({ length: 121 }, (_, step) => {
  const x = step * 5;
  return `${x},${(50 + 40 * Math.sin((Math.PI * x) / 100)).toFixed(1)}`;
}).join(" ");

/**
 * The year as a winding path: its milestones are stops along a dotted trail, each with its
 * figures, ending with what is under way now. The sources are not shown on the page; they
 * stay beside the figures in lib/content/impact.ts.
 * Hidden while the figures are still a draft (`impactIsDraft` in lib/content/impact.ts):
 * unconfirmed numbers stay off the page until the team has checked them. `showDraft` shows
 * them anyway, for the (not indexed) test page where the section is being reviewed.
 * `inScreen` (the homepage (/)): it shares one screen with the funders (see HomePreviewBody),
 * which sets the screen and the divider above.
 */
export function HomeImpact({
  showDraft = false,
  inScreen = false,
}: {
  showDraft?: boolean;
  inScreen?: boolean;
}) {
  if (impactIsDraft && !showDraft) return null;

  return (
    <section
      id="impact"
      aria-labelledby="impact-title"
      className={cn(
        "scroll-mt-24",
        inScreen
          ? "border-t border-home-line pt-10 pb-12 md:pt-12 md:pb-14 lg:border-0 lg:pt-8 lg:pb-0 lg:short:pt-6"
          : ["border-t border-home-line", homeSectionSpaceClass],
      )}
    >
      <div className={homeContainerClass}>
        <h2
          id="impact-title"
          // Phones and tablets: centred under the funders above.
          className={cn(homeSectionHeadingClass, "text-home-ink", inScreen && "max-lg:text-center")}
        >
          Our impact so far
        </h2>
        {/* Laptop: stops sit on the trail, their notes below a low stop and above a high one.
            Phone: the trail runs straight down the left. On a laptop the tallest note above the
            trail starts a little way into the list, so the list sits higher (lg:mt-4) to keep the
            same heading-to-content gap as the other sections. */}
        <ol
          className={cn(
            homeSectionBodyClass,
            "relative space-y-8 border-l-2 border-dashed border-home-ink/30 pl-7 lg:mt-4 lg:h-82 lg:space-y-0 lg:border-0 lg:pl-0",
          )}
        >
          <li aria-hidden className="absolute inset-x-0 top-28 hidden h-24 lg:block">
            <svg viewBox="0 0 600 100" preserveAspectRatio="none" className="size-full">
              <polyline
                points={trailPoints}
                fill="none"
                className="stroke-home-ink/40"
                strokeWidth={2}
                strokeDasharray="2 8"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </li>
          {impactMilestones.map((item, index) => {
            const low = index % 2 === 0;
            return (
              <li
                key={item.id}
                style={{ "--x": `${((index + 0.5) / 6) * 100}%` } as CSSProperties}
                className={cn(
                  "relative lg:absolute lg:left-(--x) lg:w-52 lg:-translate-x-1/2 lg:text-center",
                  low ? "lg:top-[13.4rem]" : "lg:bottom-[13.4rem]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1 left-[-2.3rem] size-4 rounded-full ring-4 ring-home-ground lg:left-1/2 lg:-translate-x-1/2",
                    low ? "lg:-top-6" : "lg:top-auto lg:-bottom-6",
                    item.upcoming ? "border-2 border-home-accent bg-home-ground" : "bg-home-accent",
                  )}
                />
                <p className="text-sm font-semibold text-home-accent">{item.dateLabel}</p>
                <h3 className="mt-1 text-base leading-snug font-bold text-home-ink">
                  {item.title}
                </h3>
                {item.figures.length > 0 ? (
                  <p className="mt-1 text-sm leading-snug text-home-ink">
                    {item.figures.map((figure, figureIndex) => (
                      <span key={figure.label}>
                        {figureIndex > 0 ? " · " : null}
                        <strong className="tabular-nums">{figure.value}</strong> {figure.label}
                      </span>
                    ))}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
