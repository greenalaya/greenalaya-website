import { sectionTitleClass } from "@/lib/typography";

/** Shared class names for the redesigned homepage sections. */

export const homeContainerClass = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

export const homeSectionHeadingClass = sectionTitleClass;

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
 * the hero's left half on /home-preview-2, so the two halves join without a seam.
 */
export const homeMeadowSkyClass =
  "bg-[linear-gradient(180deg,#eaf3fb_0%,#eef6e6_55%,#d6e9c8_100%)]";

/** The card that holds the right-hand hero component on /home-preview-2 and -3. */
export const homeHeroPanelClass =
  "rounded-2xl border border-home-line bg-home-surface p-3 shadow-[0_30px_60px_-34px_rgb(24_61_50/0.45)] sm:p-4";
