import Link from "next/link";
import type { ReactNode } from "react";
import { HomeHeroTree } from "@/components/home/home-hero-tree";
import { HomeHeroTypedWords } from "@/components/home/home-hero-typed-words";
import { HomeMeadowGrass } from "@/components/home/home-meadow-grass";
import {
  homeButtonClass,
  homeContainerClass,
  homeMeadowSkyClass,
} from "@/components/home/home-styles";
import { homeContent } from "@/lib/site";
import { pageTitleClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

const secondaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-home-ink/25 px-7 text-base font-semibold text-home-ink no-underline transition-colors duration-200 hover:border-home-ink/50 hover:bg-home-field focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

/**
 * Split hero for the homepage tests. Left: the original preview wording
 * (homeContent.heroOriginal) and its actions. Right: `aside`, the interactive component each
 * test page tries out (the moth lamp on the homepage (/), the species quiz, now Nature Detective).
 *
 * With `fill`, on a laptop the hero is one full screen and `aside` takes the whole right half
 * of it, edge to edge: from the top of the window (under the see-through site header) to the
 * bottom of the hero, and out to the right edge. On phones and tablets it sits under the words.
 * Without `fill`, the right side is a narrower column for a card. With `tree` (full screen
 * only), a tree stands on the line between the halves, behind the words. With `meadow` (full
 * screen only), the left half has the scene's background and grass too (the meadow by day, the
 * night in the dark theme), so the hero reads as one scene; the insects, flower and lamp stay
 * on the right.
 */
export function HomeHeroSplit({
  aside,
  fill = false,
  tree = false,
  meadow = false,
}: {
  aside: ReactNode;
  fill?: boolean;
  tree?: boolean;
  meadow?: boolean;
}) {
  const { title, description, primaryLabel, secondaryLabel } = homeContent.heroOriginal;

  return (
    <section
      aria-labelledby="home-hero-title"
      className={cn(
        !fill && "pt-28 pb-16 md:pt-36 md:pb-24",
        // The full-screen hero: one screen tall, its words in the left half below the header.
        fill && "relative snap-start lg:flex lg:min-h-svh lg:items-center lg:pt-[4.8rem] lg:pb-0",
        // Phones and tablets: the words start right under the header.
        fill && "max-lg:pt-[4.5rem] max-lg:pb-0",
      )}
    >
      <div
        className={cn(
          homeContainerClass,
          "grid gap-12",
          // Phones and tablets: the scene follows the first screen straight on.
          fill && "max-lg:gap-0",
          // Full screen: the halves span the whole window, not the page column, so the words
          // line up with the header's logo and the scene meets the right edge.
          fill
            ? "lg:max-w-none lg:grid-cols-2 lg:px-0"
            : "items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-20",
        )}
      >
        {/* Full screen: the block of words sits in the centre of the left half, with even room
            either side; the words themselves stay left-aligned. */}
        <div
          className={cn(
            fill && "lg:relative lg:z-30 lg:w-fit lg:justify-self-center lg:px-10 lg:py-16",
            // Phones and tablets: the words and buttons fill one screen under the header,
            // centred across and down, on any phone size.
            fill &&
              "max-lg:flex max-lg:min-h-[calc(100svh-4.5rem)] max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:text-center",
          )}
        >
          {/* Each word on its own line ("Research." / "Technology." / "Conservation."). The
              words stay one heading, read as a single sentence. */}
          <h1
            id="home-hero-title"
            className={cn(
              pageTitleClass,
              "text-home-ink",
              // In the full-screen hero the headline is a step up from the usual page title,
              // growing gently with the screen (about 60px on a 1440px laptop) up to 4rem.
              fill && "lg:text-[clamp(2.75rem,4.2vw,4rem)] lg:leading-[1.06]",
              // Phones and tablets: the headline grows with the screen, and so do the gaps below
              // it, so on a tall phone the block spreads to fill the screen.
              fill &&
                "max-lg:text-[clamp(2.75rem,min(12vw,7.5svh),4.5rem)] max-lg:leading-[clamp(3rem,8.5svh,5.5rem)]",
            )}
          >
            {fill ? (
              <>
                {/* The full-screen hero types its words out on phones and tablets; this is
                    the heading's text for screen readers and search. */}
                <span className="sr-only">{title}</span>
                <HomeHeroTypedWords words={title.split(" ")} />
              </>
            ) : (
              title.split(" ").map((word, index) => (
                // The space keeps the words apart for screen readers and search; blocks hide it.
                <span key={word} className="block">
                  {index > 0 ? " " : null}
                  {word}
                </span>
              ))
            )}
          </h1>
          {/* The space steps up between the three groups (headline, line, actions) rather
              than repeating one gap, so each reads as its own step. */}
          <p
            className={cn(
              "mt-6 max-w-[46ch] text-lg leading-relaxed text-home-ink sm:text-xl",
              fill && "lg:mt-7 lg:max-w-[36ch]",
              fill && "max-lg:mx-auto max-lg:mt-[clamp(1.5rem,7svh,4.5rem)]",
            )}
          >
            {description}
          </p>
          <div
            id="home-hero-actions"
            className={cn(
              "mt-8 flex flex-wrap gap-3",
              fill && "lg:mt-10",
              fill && "max-lg:mt-[clamp(2rem,9svh,6rem)] max-lg:justify-center",
            )}
          >
            <Link href="#where-we-work" className={homeButtonClass}>
              {primaryLabel}
            </Link>
            <Link href="#get-involved" className={secondaryButtonClass}>
              {secondaryLabel}
            </Link>
          </div>
        </div>

        {fill ? (
          // Out of the grid on a laptop, and pinned to the hero's right half instead.
          <div className="max-lg:-mx-5 sm:max-lg:-mx-8 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            {aside}
          </div>
        ) : (
          aside
        )}
      </div>
      {fill && meadow ? (
        <>
          {/* Laptops: the scene's background behind the words too (the meadow sky by day, the
              night's dark at night), from the same top and bottom so the halves meet seamlessly... */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 lg:block dark:bg-none dark:bg-black",
              homeMeadowSkyClass,
            )}
          />
          {/* ...and its grass along the foot (in both themes), in front of the tree's trunk
              like the scene's. */}
          <HomeMeadowGrass className="pointer-events-none absolute bottom-0 left-0 z-20 hidden h-16 w-1/2 lg:block" />
        </>
      ) : null}
      {fill && tree ? (
        // On the centre line, rooted at the foot of the screen and reaching most of the way up
        // it (88% of the hero's height, or 62% of the window's width on narrow laptops), so its
        // crown spreads across the top of the hero, above the words. Layered over the scene's
        // sky but under its light and insects, so the lamp lights it and the butterflies, moths
        // and grass pass in front of it.
        <HomeHeroTree className="pointer-events-none absolute bottom-0 left-1/2 z-10 hidden h-[min(88%,62vw)] -translate-x-1/2 lg:block" />
      ) : null}
    </section>
  );
}
