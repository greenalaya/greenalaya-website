/**
 * Shared heading roles, so every page sets its titles in the same face, weight and size.
 * The site uses one sans family (the device's system UI font) for headings and body.
 */

/** The page's one h1: 36px on phones up to 56px on laptops. */
export const pageTitleClass =
  "text-[clamp(2.25rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-balance";

/** Section headings (h2) inside a page: 28px on phones up to 40px on laptops. */
export const sectionTitleClass =
  "text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-balance";
