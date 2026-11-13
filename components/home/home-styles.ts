import { sectionTitleClass } from "@/lib/typography";

/** Shared class names for the redesigned homepage sections. */

export const homeContainerClass = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

export const homeSectionHeadingClass = sectionTitleClass;

/**
 * The redesigned homepage's one spacing rhythm, so every section reads alike as the page
 * scrolls: the space above and below a section, and the gap from its heading (or the line
 * under the heading) to what it shows. A description line sits `mt-3` under its heading.
 */
export const homeSectionSpaceClass = "py-16 md:py-20";
export const homeSectionBodyClass = "mt-8 md:mt-10";

/**
 * A section that is one screen on a laptop (under the fixed header, 4.5rem tall once the page has scrolled; its 1px border line overlaps the section) and a snap point:
 * on pages that snap (see `[data-snap-screens]` in globals.css) scrolling settles with the
 * section filling the screen. The floor keeps the content readable in a very short window;
 * the section then runs longer. Phones and tablets keep the normal flow: 48px at each end on
 * phones (96px from one section's content to the next heading), 56px on tablets (112px).
 */
export const homeScreenClass =
  "snap-start scroll-mt-[4.5rem] py-12 md:py-14 lg:flex lg:h-[calc(100svh-4.5rem)] lg:min-h-[34rem] lg:flex-col lg:py-8";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

/**
 * Matches the header's "Get Involved" button (green gradient pill), as requested.
 * Its gradient and hover lift are the brand button style, so the taste lint is told to skip them.
 */
export const homeButtonClass = `inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] px-7 text-base font-semibold text-white no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,175,80,0.4)] active:translate-y-0 motion-reduce:hover:translate-y-0 ${focusRing}`; // taste-skill-ignore

export const homeArrowIconClass =
  "size-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none";

export const homeArrowLinkClass = `group/link inline-flex min-h-11 items-center gap-2 font-semibold text-home-accent no-underline transition-colors duration-200 hover:text-home-ink ${focusRing}`;

/** A text link set on a photograph (white, underlined), e.g. the hero's secondary action. */
export const homeOnImageLinkClass =
  "inline-flex min-h-11 items-center text-base font-semibold text-white underline decoration-white/60 decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

/**
 * The butterfly meadow's daytime sky (pale blue into meadow green). Shared by the scene and by
 * the hero's left half on the homepage (/), so the two halves join without a seam.
 */
export const homeMeadowSkyClass =
  "bg-[linear-gradient(180deg,#eaf3fb_0%,#eef6e6_55%,#d6e9c8_100%)]";

/** The card that holds the right-hand hero component on the homepage (/). */
export const homeHeroPanelClass =
  "rounded-2xl border border-home-line bg-home-surface p-3 shadow-[0_30px_60px_-34px_rgb(24_61_50/0.45)] sm:p-4";
