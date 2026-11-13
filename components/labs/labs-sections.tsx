import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  homeArrowIconClass,
  homeButtonClass,
  homeContainerClass,
  homeSectionHeadingClass,
} from "@/components/home/home-styles";
import { labsContent, type LabsProject, type LabsStatusTone } from "@/lib/content/labs";
import { pageTitleClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

/**
 * On a laptop each Labs section fills one screen under the fixed 4.8rem header, like the
 * homepage preview's sections; the floor keeps the content readable in a very short window.
 */
const screenClass =
  "scroll-mt-[4.8rem] lg:flex lg:min-h-[max(calc(100svh-4.8rem),34rem)] lg:flex-col lg:justify-center";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

// Blue = being built, amber = running now; research and plans get a plain outlined label,
// so nothing that is not under way borrows a "live" colour.
const statusToneClass: Record<LabsStatusTone, string> = {
  development: "bg-status-development-bg text-status-development-fg",
  ongoing: "bg-status-ongoing-bg text-status-ongoing-fg",
  research: "border border-home-ink/30 text-home-ink",
  planned: "border border-home-ink/30 text-home-ink",
};

/** The first screen: the page's name and one line, beside the three steps every project follows. */
export function LabsHero() {
  const { hero, approach } = labsContent;

  return (
    <section
      aria-labelledby="labs-title"
      // The first section sits under the fixed header, so it carries the header's height itself.
      className="pt-28 pb-16 md:pt-36 md:pb-24 lg:flex lg:min-h-[max(100svh,38rem)] lg:flex-col lg:justify-center lg:pt-[4.8rem] lg:pb-0"
    >
      <div
        className={cn(homeContainerClass, "grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16")}
      >
        <div>
          <h1 id="labs-title" className={cn(pageTitleClass, "text-home-ink")}>
            {hero.title}
          </h1>
          <p className="mt-6 max-w-[36ch] text-lg leading-relaxed text-home-ink sm:text-xl">
            {hero.description}
          </p>
          <Link href={hero.primary.href} className={cn(homeButtonClass, "mt-8")}>
            {hero.primary.label}
          </Link>
        </div>

        <div aria-labelledby="labs-approach-title" role="group">
          <h2 id="labs-approach-title" className="text-sm font-semibold text-home-accent">
            {approach.title}
          </h2>
          <ol className="mt-4 space-y-3">
            {approach.steps.map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-5 bg-home-field p-5 text-xl leading-snug font-bold text-home-ink sm:p-6"
              >
                {/* The steps happen in this order, so each carries its number. */}
                <span aria-hidden className="text-sm font-semibold text-home-accent tabular-nums">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ProjectTile({ project }: { project: LabsProject }) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-6">
        <span
          className={cn(
            "inline-block rounded-sm px-2 py-0.5 text-sm font-semibold",
            statusToneClass[project.status.tone],
          )}
        >
          {project.status.label}
        </span>
        {project.link ? (
          project.link.external ? (
            <ArrowUpRight aria-hidden className="size-5 shrink-0 text-home-ink" />
          ) : (
            <ArrowRight aria-hidden className={cn(homeArrowIconClass, "size-5 text-home-ink")} />
          )
        ) : null}
      </span>
      <span>
        <span className="block text-[clamp(1.75rem,2.4vw,2.125rem)] leading-[1.15] font-bold tracking-tight text-balance text-home-ink">
          {project.name}
        </span>
        <span className="mt-3 block max-w-[40ch] text-base leading-relaxed text-home-ink lg:short:mt-2">
          {project.summary}
        </span>
      </span>
    </>
  );
  // A little tighter on short laptop screens, so the four tiles still fit one screen.
  const tileClass =
    "flex h-full flex-col justify-between gap-8 bg-home-ground p-6 dark:bg-home-field sm:p-7 lg:short:gap-5 lg:short:p-5";

  if (!project.link) return <div className={tileClass}>{body}</div>;

  return (
    <Link
      href={project.link.href}
      aria-label={`${project.name}: ${project.link.label}`}
      {...(project.link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(tileClass, "group/link no-underline", focusRing)}
    >
      {body}
    </Link>
  );
}

/** One tile per Labs project, each with its status; a tile opens its page where there is one. */
export function LabsBuilding() {
  const { title, projects } = labsContent.building;

  return (
    <section
      id="building"
      aria-labelledby="labs-building-title"
      className={cn(screenClass, "bg-home-field dark:bg-home-ground py-20 md:py-28 lg:py-8")}
    >
      <div className={cn(homeContainerClass, "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col")}>
        <h2 id="labs-building-title" className={`${homeSectionHeadingClass} text-home-ink`}>
          {title}
        </h2>
        <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 lg:mt-8 lg:min-h-0 lg:flex-1 lg:auto-rows-fr lg:gap-6 lg:short:mt-6">
          {projects.map((project) => (
            <li key={project.id} className="lg:min-h-0">
              <ProjectTile project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Chinari's five steps in a row, from a photograph to a trusted record. */
export function LabsChinari() {
  const { title, logo, steps, link } = labsContent.chinari;

  return (
    <section
      id="chinari"
      aria-labelledby="labs-chinari-title"
      className={cn(screenClass, "py-20 md:py-28 lg:py-8")}
    >
      <div className={homeContainerClass}>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
          <h2 id="labs-chinari-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {title}
          </h2>
          <span className="relative block h-16 w-40 shrink-0">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="160px"
              className="object-contain object-right dark:hidden"
            />
            <Image
              src={logo.darkSrc}
              alt={logo.alt}
              fill
              sizes="160px"
              className="hidden object-contain object-right dark:block"
            />
          </span>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="bg-home-field p-5 sm:p-6">
              {/* A real sequence: each step's number shows where it falls. */}
              <p aria-hidden className="text-sm font-semibold text-home-accent tabular-nums">
                {index + 1}
              </p>
              <h3 className="mt-6 text-xl leading-snug font-bold text-home-ink lg:mt-10">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-home-ink">{step.description}</p>
            </li>
          ))}
        </ol>
        <Link
          href={link.href}
          className={cn(
            "group/link mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-home-accent no-underline transition-colors duration-200 hover:text-home-ink",
            focusRing,
          )}
        >
          {link.label}
          <ArrowRight aria-hidden className={homeArrowIconClass} />
        </Link>
      </div>
    </section>
  );
}
