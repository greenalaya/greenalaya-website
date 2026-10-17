/** Shared class names for the redesigned homepage sections. */

export const homeContainerClass = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

export const homeSectionHeadingClass =
  "font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.02em] text-balance";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

/**
 * Matches the header's "Get Involved" button (light-green gradient pill), as requested.
 * Its gradient and hover lift are the brand button style, so the taste lint is told to skip them.
 */
export const homeButtonClass = `inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4caf50] to-[#2e7d32] px-7 text-base font-semibold text-white no-underline transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,175,80,0.4)] active:translate-y-0 motion-reduce:hover:translate-y-0 ${focusRing}`; // taste-skill-ignore

export const homeTextLinkClass = `inline-flex min-h-11 items-center text-base font-semibold text-home-ink underline decoration-home-sage decoration-2 underline-offset-[6px] transition-colors duration-200 hover:decoration-home-accent ${focusRing}`;

export const homeArrowIconClass =
  "size-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transition-none";

export const homeArrowLinkClass = `group/link inline-flex min-h-11 items-center gap-2 font-semibold text-home-accent no-underline transition-colors duration-200 hover:text-home-ink ${focusRing}`;
