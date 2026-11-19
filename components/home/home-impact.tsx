import type { CSSProperties } from "react";
import { impactIsDraft, impactMilestones } from "@/lib/content/impact";
import {
  homeContainerClass,
  homeSectionBodyClass,
  homeSectionHeadingClass,
  homeSectionSpaceClass,
} from "@/components/home/home-styles";
import { cn } from "@/lib/utils";

// The trail: a wave across a 600 x 100 box with one stop per crest, low at the 1st, 3rd, 5th
// ... stops and high at the 2nd, 4th ... (y = 90 at a low stop, 10 at a high one).
const stopCount = impactMilestones.length;
const stopSpacing = 600 / stopCount;
const trailPoints = Array.from({ length: 121 }, (_, step) => {
  const x = step * 5;
  return `${x},${(50 + 40 * Math.sin((Math.PI * x) / stopSpacing)).toFixed(1)}`;
}).join(" ");

/**
 * The year as a winding path: its milestones are stops along a dotted trail, each with its
 * figures, ending with what is under way now. The sources are not shown on the page; they
 * stay beside the figures in lib/content/impact.ts.
 * Hidden while the figures are still a draft (`impactIsDraft` in lib/content/impact.ts):
 * unconfirmed numbers stay off the page until the team has checked them. `showDraft` shows
 * them anyway, for the (not indexed) test page where the section is being reviewed.
 * `inScreen` (the homepage (/)): it has a screen of its own (see HomePreviewBody), which sets
 * the screen and the divider above; `afterFunders` when it shares that screen with the funders.
 */
export function HomeImpact({
  showDraft = false,
  inScreen = false,
  afterFunders = true,
}: {
  showDraft?: boolean;
  inScreen?: boolean;
  /** In a screen: the funders sit above, so phones get a divider between the two. */
  afterFunders?: boolean;
}) {
  if (impactIsDraft && !showDraft) return null;

  return (
    <section
      id="impact"
      aria-labelledby="impact-title"
      className={cn(
        "scroll-mt-24",
        inScreen
          ? cn(
              "pt-10 pb-12 md:pt-12 md:pb-14 lg:pt-8 lg:pb-0 lg:short:pt-6",
              afterFunders && "border-t border-home-line lg:border-0",
            )
          : ["border-t border-home-line", homeSectionSpaceClass],
      )}
    >
      {/* Laptop: the full width of the screen, not the 1200px column, so the year has room. */}
      <div className={cn(homeContainerClass, inScreen && "lg:max-w-[1600px] lg:px-12")}>
        <h2
          id="impact-title"
          // Phones and tablets: centred.
          className={cn(homeSectionHeadingClass, "text-home-ink", inScreen && "max-lg:text-center")}
        >
          Our impact so far
        </h2>
        {/* Laptop: stops sit on the trail, their notes below a low stop and above a high one.
            The list fills the rest of the screen and the trail runs through its middle, taller
            on taller screens (--trail), so a stop's dot sits 0.4 x --trail from the middle and
            its note 1rem further out (the dot is centred 1rem outside the note).
            Phone: the trail runs straight down the left. */}
        <ol
          className={cn(
            homeSectionBodyClass,
            "relative space-y-8 border-l-2 border-dashed border-home-ink/30 pl-7 lg:mt-6 lg:h-[max(24rem,calc(100svh-17rem))] lg:[--trail:clamp(8rem,22svh,15rem)] lg:space-y-0 lg:border-0 lg:pl-0",
          )}
        >
          <li
            aria-hidden
            className="absolute inset-x-0 top-1/2 hidden h-(--trail) -translate-y-1/2 lg:block"
          >
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
            // The first and last notes sit half a stop from the edge: they get one stop's width
            // plus the side padding, so they never run off the screen.
            const atEdge = index === 0 || index === stopCount - 1;
            return (
              <li
                key={item.id}
                style={
                  {
                    "--x": `${((index + 0.5) / stopCount) * 100}%`,
                    // A note may be up to 1.8 stops wide: its neighbours sit on the other side.
                    "--w": atEdge
                      ? `calc(${100 / stopCount}% + 5rem)`
                      : `${(1.8 / stopCount) * 100}%`,
                  } as CSSProperties
                }
                className={cn(
                  "relative lg:absolute lg:left-(--x) lg:w-(--w) lg:max-w-60 2xl:max-w-72 lg:-translate-x-1/2 lg:text-center",
                  low
                    ? "lg:top-[calc(50%+var(--trail)*0.4+1rem)]"
                    : "lg:bottom-[calc(50%+var(--trail)*0.4+1rem)]",
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
                <p className="text-sm font-semibold text-home-accent lg:text-base 2xl:text-lg">
                  {item.dateLabel}
                </p>
                <h3 className="mt-1 text-base leading-snug font-bold text-home-ink lg:text-lg xl:text-xl 2xl:text-2xl">
                  {item.title}
                </h3>
                {item.figures.length > 0 ? (
                  <p className="mt-1 text-sm leading-snug text-home-ink lg:text-base 2xl:text-lg">
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
