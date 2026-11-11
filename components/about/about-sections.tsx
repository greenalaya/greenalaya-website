import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { canOptimizeLogo, collaboratorPhotoUrl } from "@/lib/content/collaborator-photo";
import { teamPhotoUrl } from "@/lib/content/team-photo";
import { aboutPageContent, aboutWhatWeDo, siteConfig } from "@/lib/site";
import type { Collaborator } from "@/lib/types/collaborator";
import type { TeamMember } from "@/lib/types/team";
import { ScrollToNext, ScrollToPrevious, screenSectionClass } from "@/components/scroll-to-next";
import {
  homeArrowIconClass,
  homeArrowLinkClass,
  homeContainerClass,
  homeSectionHeadingClass,
} from "@/components/home/home-styles";
import { pageTitleClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

/**
 * Hero: page title, then what we do beside the community photo, filling the first screen on
 * laptops with the same bouncing scroll-down arrow as the live homepage hero. On phones the
 * photo comes first, so the people are seen before the text.
 */
export function AboutIntro() {
  return (
    <section
      id="about-hero"
      aria-labelledby="about-title"
      className="relative flex min-h-svh flex-col pt-24 pb-24 md:pt-28 lg:justify-center lg:pt-24 lg:pb-20"
    >
      <div className={homeContainerClass}>
        {/* Full-width row so the title stays on one line on laptops. */}
        <h1
          id="about-title"
          className={`${pageTitleClass} text-center text-home-ink lg:whitespace-nowrap`}
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
          <figcaption className="mt-3 text-sm text-home-muted italic">
            {aboutWhatWeDo.imageCaption}
          </figcaption>
        </figure>
        <div className="space-y-4 lg:col-span-6">
          {/* All three paragraphs share one size and pure black (white in dark mode), as requested. */}
          {aboutWhatWeDo.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-lg leading-relaxed text-pretty text-black dark:text-white"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <ScrollToNext href="#mission" label="Scroll to our mission" className="bottom-4 flex" />
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
      className={`relative scroll-mt-24 bg-home-field py-20 text-home-ink md:py-28 lg:pt-12 lg:pb-12 ${screenSectionClass}`}
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
            <p className="mx-auto mt-6 max-w-[46ch] text-xl leading-relaxed text-pretty text-home-ink">
              {block.text}
            </p>
          </div>
        ))}
      </div>
      <ScrollToNext href="#pillars" label="Scroll to our strategic pillars" />
    </section>
  );
}

/**
 * Advisors as a still row of portraits, in full colour: one row of three on phones, a centred
 * row of fixed-width portraits from small tablets up. Faces are cropped from near the top so
 * they line up across differently framed photos.
 */
export function AboutAdvisors({
  advisors,
  nextHref,
}: {
  advisors: TeamMember[];
  /** Where the down arrow goes, so it never points at a section that isn't rendered. */
  nextHref: { href: `#${string}`; label: string };
}) {
  if (advisors.length === 0) return null;

  return (
    <section
      id="advisors"
      aria-labelledby="advisors-title"
      className={`relative scroll-mt-24 py-16 md:py-20 lg:pt-12 lg:pb-12 ${screenSectionClass}`}
    >
      <ScrollToPrevious href="#thematic" label="Back to our thematic areas" />
      <div className={homeContainerClass}>
        <h2 id="advisors-title" className={`${homeSectionHeadingClass} text-center text-home-ink`}>
          Advisors
        </h2>
        <ul className="mt-10 grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-8 md:mt-12 md:gap-x-10">
          {advisors.map((advisor) => (
            <li key={advisor.id} className="text-center sm:w-48 lg:w-52">
              <div className="relative aspect-4/5 overflow-hidden bg-home-field">
                {/* The name is printed below, so the portrait is not announced a second time. */}
                <Image
                  src={teamPhotoUrl(advisor)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 208px, (min-width: 640px) 192px, 33vw"
                  className="object-cover object-[50%_25%]"
                />
              </div>
              <p className="mt-3 text-sm leading-snug font-semibold text-home-ink sm:text-lg">
                {advisor.name}
              </p>
              {advisor.position ? (
                <p className="mt-0.5 text-sm text-home-muted">{advisor.position}</p>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link
            href="/team"
            className={cn(
              homeArrowLinkClass,
              "text-black hover:text-home-accent dark:text-white dark:hover:text-home-accent",
            )}
          >
            Meet our team
            <ArrowRight aria-hidden className={homeArrowIconClass} />
          </Link>
        </div>
      </div>
      <ScrollToNext href={nextHref.href} label={nextHref.label} />
    </section>
  );
}

const logoTileSize = {
  large: { tile: "size-36 sm:size-44", sizes: "176px" },
  small: { tile: "size-[6.5rem] sm:size-32", sizes: "128px" },
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
    <div className={`overflow-hidden rounded-lg bg-white p-3 dark:bg-[#e9ede6] ${tile}`}>
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
          className="absolute top-1.5 right-1.5 size-4 text-[#1f5f23] opacity-50 transition-opacity group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100"
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
      className={`relative scroll-mt-24 bg-home-field py-16 md:py-20 lg:pt-12 lg:pb-12 ${screenSectionClass}`}
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
              <ul className="mt-5 flex flex-wrap justify-center gap-3 sm:gap-4">
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
