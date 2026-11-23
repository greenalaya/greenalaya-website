import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { canOptimizeLogo, collaboratorPhotoUrl } from "@/lib/content/collaborator-photo";
import { aboutPageContent, aboutWhatWeDo, siteConfig } from "@/lib/site";
import type { Collaborator } from "@/lib/types/collaborator";
import { ScrollToNext, ScrollToPrevious, screenSectionClass } from "@/components/scroll-to-next";
import { homeContainerClass, homeSectionHeadingClass } from "@/components/home/home-styles";
import { pageTitleClass } from "@/lib/typography";

/**
 * Hero: page title, then what we do beside the community photo, filling the first screen on
 * laptops with the same bouncing scroll-down arrow as the live homepage hero. On phones the
 * photo comes first, so the people are seen before the text; there the words are a size smaller
 * (title 30px, paragraphs 16px, caption 12px) and there is no arrow.
 */
export function AboutIntro() {
  return (
    <section
      id="about-hero"
      aria-labelledby="about-title"
      className="relative flex min-h-svh flex-col pt-24 pb-12 sm:pb-24 md:pt-28 lg:justify-center lg:pt-24 lg:pb-20"
    >
      <div className={homeContainerClass}>
        {/* Full-width row so the title stays on one line on laptops. */}
        <h1
          id="about-title"
          className={`${pageTitleClass} text-center text-home-ink max-sm:text-[1.875rem] lg:whitespace-nowrap`}
        >
          {aboutPageContent.title}
        </h1>
      </div>
      <div
        className={`${homeContainerClass} mt-8 grid gap-8 lg:mt-12 lg:grid-cols-12 lg:items-start lg:gap-12`}
      >
        <figure className="lg:order-last lg:col-span-6">
          <Image
            src={siteConfig.images.communityHero}
            alt="Participants of a Greenalaya Nepal butterfly watch gathered for a group photo, with forested hills behind them"
            width={1024}
            height={628}
            preload
            sizes="(min-width: 1200px) 576px, (min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full"
          />
          <figcaption className="mt-3 text-xs font-bold text-black italic sm:text-sm dark:text-white">
            {aboutWhatWeDo.imageCaption}
          </figcaption>
        </figure>
        <div className="space-y-4 lg:col-span-6">
          {/* All three paragraphs share one size (smaller on phones) and pure black (white in dark mode). */}
          {aboutWhatWeDo.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-base leading-relaxed text-pretty text-black sm:text-lg dark:text-white"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      {/* Laptops only (the arrow's default); phones just scroll on. */}
      <ScrollToNext href="#mission" label="Scroll to our mission" className="bottom-4" />
    </section>
  );
}

/**
 * Mission on the left and vision on the right, on one pale green band, with matching heading
 * and text styles and a thin rule between them. They stack on phones, mission first.
 */
export function AboutMissionVision() {
  const blocks = [
    { id: "mission-title", title: "Our Mission", text: aboutPageContent.leadMission },
    { id: "vision", title: "Our Vision", text: aboutPageContent.vision },
  ];

  return (
    <section
      id="mission"
      aria-labelledby="mission-title"
      className={`relative scroll-mt-24 bg-home-ground py-20 text-home-ink md:py-28 lg:pt-12 lg:pb-12 ${screenSectionClass}`}
    >
      <ScrollToPrevious href="#about-hero" label="Back to the top" />
      <div
        className={`${homeContainerClass} grid gap-12 text-center md:grid-cols-2 md:gap-0 md:divide-x md:divide-home-line`}
      >
        {blocks.map((block) => (
          <div key={block.id} className="md:px-10 lg:px-14">
            <h2 id={block.id} className={`${homeSectionHeadingClass} scroll-mt-24`}>
              {block.title}
            </h2>
            {/* Same size as the first section's paragraphs: 16px on phones, 18px from 640px up. */}
            <p className="mx-auto mt-6 max-w-[46ch] text-base leading-relaxed text-pretty text-home-ink sm:text-lg">
              {block.text}
            </p>
          </div>
        ))}
      </div>
      <ScrollToNext href="#pillars" label="Scroll to our strategic pillars" />
    </section>
  );
}

const logoTileSize = {
  // Smaller on phones, so the walls stay compact: four supporters or collaborators to a row.
  large: { tile: "size-24 p-2.5 sm:size-44 sm:p-3", sizes: "176px" },
  small: { tile: "size-[4.75rem] p-2 sm:size-32 sm:p-3", sizes: "128px" },
} as const;

/**
 * One partner logo on a light tile (soft ivory in dark mode, so it doesn't glare). Linked logos
 * show a small arrow, stronger on hover and keyboard focus.
 */
function PartnerLogo({
  partner,
  size,
}: {
  partner: Collaborator;
  size: keyof typeof logoTileSize;
}) {
  const { tile, sizes } = logoTileSize[size];
  const src = collaboratorPhotoUrl(partner);
  const logo = (
    <div className={`overflow-hidden rounded-lg bg-white dark:bg-[#e9ede6] ${tile}`}>
      <div className="relative size-full">
        {/* Optimized so tiles load a small resized copy, not the full-size original upload. */}
        <Image
          src={src}
          alt={partner.name}
          fill
          sizes={sizes}
          unoptimized={!canOptimizeLogo(src)}
          className="object-contain"
        />
      </div>
    </div>
  );

  if (partner.website_url && /^https?:\/\//i.test(partner.website_url)) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${partner.name} (opens in a new tab)`}
        className="group/logo relative block rounded-lg transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action motion-safe:hover:-translate-y-0.5"
      >
        {logo}
        <ArrowUpRight
          aria-hidden
          className="absolute top-1 right-1 size-3 text-[#1f5f23] sm:top-1.5 sm:right-1.5 sm:size-4 opacity-50 transition-opacity group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100"
        />
      </a>
    );
  }

  return logo;
}

/** Supporters (larger tiles) and collaborators as logo walls; logos with a website link open it. */
export function AboutPartners({
  supportedBy,
  collaborators,
  previousHref,
}: {
  supportedBy: Collaborator[];
  collaborators: Collaborator[];
  /** Where the up arrow goes, so it never points at a section that isn't rendered. */
  previousHref: { href: `#${string}`; label: string };
}) {
  const groups = [
    { id: "supported-by", title: "Supported by", partners: supportedBy, size: "large" as const },
    {
      id: "collaborators",
      title: "Collaborators",
      partners: collaborators,
      size: "small" as const,
    },
  ].filter((group) => group.partners.length > 0);
  if (groups.length === 0) return null;

  return (
    <section
      id="partners"
      aria-labelledby="partners-title"
      className={`relative scroll-mt-24 bg-home-ground py-16 md:py-20 lg:pt-12 lg:pb-12 ${screenSectionClass}`}
    >
      <ScrollToPrevious href={previousHref.href} label={previousHref.label} />
      <div className={homeContainerClass}>
        <h2 id="partners-title" className={`${homeSectionHeadingClass} text-center text-home-ink`}>
          Our Partners
        </h2>
        <div className="mt-10 space-y-12 md:mt-12 lg:mt-8 lg:space-y-8">
          {groups.map((group) => (
            <div key={group.id} role="group" aria-labelledby={`${group.id}-title`}>
              <h3
                id={`${group.id}-title`}
                className="text-center text-xl leading-tight font-semibold text-home-ink sm:text-2xl"
              >
                {group.title}
              </h3>
              <ul className="mt-5 flex flex-wrap justify-center gap-2.5 sm:gap-4">
                {group.partners.map((partner) => (
                  <li key={partner.id}>
                    <PartnerLogo partner={partner} size={group.size} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <ScrollToNext href="#get-involved" label="Scroll to get involved" />
    </section>
  );
}
