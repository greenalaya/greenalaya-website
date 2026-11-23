import Image from "next/image";
import type { SVGProps } from "react";
import { ScrollToNext, ScrollToPrevious, screenSectionClass } from "@/components/scroll-to-next";
import { homeContainerClass } from "@/components/home/home-styles";
import { teamPhotoUrl } from "@/lib/content/team-photo";
import type { TeamMember } from "@/lib/types/team";
import { cn } from "@/lib/utils";

type ArrowLink = { href: `#${string}`; label: string };

function IconLinkedin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconWebsite(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

const isWebLink = (href?: string | null): href is string => !!href && /^https?:\/\//i.test(href);

/** A person's LinkedIn and website, as small icon links (nothing if they have neither). */
function MemberLinks({ member, className }: { member: TeamMember; className?: string }) {
  const linkedin = isWebLink(member.linkedin_url) ? member.linkedin_url : null;
  const website = isWebLink(member.website_url) ? member.website_url : null;
  if (!linkedin && !website) return null;
  // The padding (offset by the margin) gives each icon a 32px tap area without moving it.
  const linkClass =
    "-m-2 inline-flex p-2 text-home-muted transition-colors hover:text-home-accent focus-visible:outline-2 focus-visible:outline-home-action";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {linkedin ? (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name}'s LinkedIn (opens in a new tab)`}
          className={linkClass}
        >
          <IconLinkedin className="size-4" />
        </a>
      ) : null}
      {website ? (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name}'s website (opens in a new tab)`}
          className={linkClass}
        >
          <IconWebsite className="size-4" />
        </a>
      ) : null}
    </span>
  );
}

/** Photo sizes for the browser, so it loads a copy no bigger than shown. */
const photoSizes = "(min-width: 640px) 160px, 96px";

/**
 * One person: a photo with the name (and role, and links) under it. On phones the photo is a
 * circle with a white ring and a soft shadow; from small tablets up a rectangular portrait.
 */
function Person({
  member,
  className,
  photoClassName,
}: {
  member: TeamMember;
  /** The person's width. */
  className?: string;
  /** The photo's size. */
  photoClassName?: string;
}) {
  return (
    <li className={cn("w-20 text-center", className)}>
      <div
        className={cn(
          "relative mx-auto size-20 overflow-hidden rounded-full bg-home-field",
          "shadow-[0_4px_14px_rgb(0_0_0/0.12)] ring-2 ring-white dark:ring-white/15",
          "sm:aspect-4/5 sm:h-auto sm:w-full sm:rounded-none sm:shadow-none sm:ring-0",
          photoClassName,
        )}
      >
        {/* The name is printed below, so the photo is not announced a second time. */}
        <Image
          src={teamPhotoUrl(member)}
          alt=""
          fill
          sizes={photoSizes}
          className="object-cover object-[50%_25%]"
        />
      </div>
      <div className="mt-2 text-xs sm:mt-2.5 sm:text-sm lg:mt-1.5 lg:text-[0.8125rem]">
        <p className="leading-snug font-semibold wrap-break-word text-home-ink">{member.name}</p>
        {member.position ? (
          <p className="mt-0.5 text-[0.6875rem] text-home-muted sm:text-xs">{member.position}</p>
        ) : null}
      </div>
      <MemberLinks member={member} className="mt-1" />
    </li>
  );
}

const groupHeadingClass = "text-center text-lg font-semibold text-home-ink sm:text-xl lg:text-xl";

const listClass = "mt-4 flex flex-wrap justify-center gap-x-2 gap-y-5 sm:mt-5 lg:mt-3";

/**
 * "Our People" on the About page: the advisors, then the team. The "Our People" title is for
 * screen readers only (the section opens straight on "Advisors"), which leaves room for bigger
 * photos. Phones show everyone as round photos, about four to a row (advisors a little larger);
 * tablets and laptops show rectangular portraits, the team six to a row on laptops. On laptops
 * (1024px and up) the photos are smaller than each person's slot, so names stay on one line, and
 * the section fits one screen from 1024x768 up; short screens (under 760px, e.g. 1280x720) get
 * smaller photos and taller ones (900px and up) bigger photos. Empty groups are left out, and
 * with nobody at all the section isn't shown.
 *
 * The section is #advisors (so the About menu's "Advisors" lands on it) and its team group is
 * #team.
 */
export function AboutPeople({
  advisors,
  members,
  previousHref,
  nextHref,
}: {
  advisors: TeamMember[];
  members: TeamMember[];
  previousHref?: ArrowLink;
  nextHref?: ArrowLink;
}) {
  if (advisors.length + members.length === 0) return null;

  return (
    <section
      id="advisors"
      aria-labelledby="people-title"
      className={cn("relative scroll-mt-24 py-16 md:py-20 lg:pt-9 lg:pb-9", screenSectionClass)}
    >
      {previousHref ? (
        <ScrollToPrevious href={previousHref.href} label={previousHref.label} />
      ) : null}
      <div className={homeContainerClass}>
        <h2 id="people-title" className="sr-only">
          Our People
        </h2>

        {advisors.length > 0 ? (
          <div>
            <h3 className={groupHeadingClass}>Advisors</h3>
            <ul className={cn(listClass, "sm:gap-x-6 sm:gap-y-5")}>
              {advisors.map((member) => (
                <Person
                  key={member.id}
                  member={member}
                  className="w-24 sm:w-40"
                  photoClassName="size-24 lg:w-28 lg:[@media(min-height:900px)]:w-36 lg:[@media(max-height:760px)]:w-24"
                />
              ))}
            </ul>
          </div>
        ) : null}

        {members.length > 0 ? (
          <div
            id="team"
            className="mt-10 scroll-mt-24 sm:mt-12 lg:mt-5 lg:[@media(max-height:760px)]:mt-3"
          >
            <h3 className={groupHeadingClass}>Team</h3>
            <ul
              className={cn(
                listClass,
                "sm:gap-x-5 sm:gap-y-5 lg:mx-auto lg:max-w-[58rem] lg:gap-x-3 lg:gap-y-3",
              )}
            >
              {members.map((member) => (
                <Person
                  key={member.id}
                  member={member}
                  className="sm:w-32 lg:w-36"
                  photoClassName="lg:w-24 lg:[@media(min-height:900px)]:w-28 lg:[@media(max-height:760px)]:w-20"
                />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {nextHref ? <ScrollToNext href={nextHref.href} label={nextHref.label} /> : null}
    </section>
  );
}
