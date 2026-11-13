import { ArrowRight, BrainCircuit, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  homeButtonClass,
  homeContainerClass,
  homeSectionBodyClass,
  homeSectionHeadingClass,
  homeSectionSpaceClass,
} from "@/components/home/home-styles";
import { labsContent, type LabsStatus, type LabsStatusTone } from "@/lib/content/labs";
import { pageTitleClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

const secondaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-home-ink/25 px-5 sm:px-7 text-base font-semibold text-home-ink no-underline transition-colors duration-200 hover:border-home-ink/50 hover:bg-home-field focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

/** A section in the page's rhythm; `tone` gives it the green ground (black in the dark theme). */
const sectionClass = (tone: "ground" | "field") =>
  cn(
    "scroll-mt-24",
    homeSectionSpaceClass,
    tone === "field" && "bg-home-field dark:bg-home-ground",
  );

// Blue = being built, amber = running now; concepts and plans get a plain outlined label, so
// nothing that is not under way borrows a "live" colour.
const statusToneClass: Record<LabsStatusTone, string> = {
  development: "bg-status-development-bg text-status-development-fg",
  ongoing: "bg-status-ongoing-bg text-status-ongoing-fg",
  research: "border border-home-ink/30 text-home-ink",
  planned: "border border-home-ink/30 text-home-ink",
};

/** The approach's steps, in order: collect, check, model. */
const approachIcons = [MapPin, ShieldCheck, BrainCircuit];

function StatusLabel({ status }: { status: LabsStatus }) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2 py-0.5 text-sm font-semibold",
        statusToneClass[status.tone],
      )}
    >
      {status.label}
    </span>
  );
}

/** 1. Who the Labs are: the headline, what they are not, and a field photograph. */
export function LabsHero() {
  const { hero } = labsContent;
  return (
    // One screen under the fixed header on every device, its content centred in it. The
    // headline, photo and gaps scale with the screen's height as well as its width, so the
    // whole first screen fits from a small phone to a large monitor.
    <section
      aria-labelledby="labs-title"
      className="flex min-h-svh flex-col justify-center pt-[calc(4.5rem+clamp(1rem,3svh,2.5rem))] pb-[clamp(1.5rem,4svh,3rem)]"
    >
      {/* The Labs' name, centred over the headline and photo. */}
      <p
        className={cn(
          homeContainerClass,
          "mb-[clamp(1rem,3.5svh,3rem)] text-center text-[clamp(1.125rem,min(5vw,3.2svh),1.875rem)] font-bold tracking-tight text-home-accent",
        )}
      >
        {hero.eyebrow}
      </p>
      <div
        className={cn(
          homeContainerClass,
          "grid gap-[clamp(1.25rem,3.5svh,2.5rem)] lg:grid-cols-2 lg:items-center lg:gap-16",
        )}
      >
        <div className="max-lg:text-center">
          <h1
            id="labs-title"
            className={cn(
              pageTitleClass,
              "text-home-ink",
              // Grows with the screen, but never taller than the screen allows.
              "text-[clamp(1.625rem,min(8vw,4.6svh),3.5rem)] leading-[1.1] lg:text-[clamp(2rem,min(4.2vw,7.2svh),3.5rem)] lg:leading-[1.08]",
            )}
          >
            {hero.title}
          </h1>
          <p className="mt-[clamp(0.75rem,2.5svh,1.5rem)] max-w-[46ch] text-[clamp(0.9375rem,min(4.2vw,2.3svh),1.25rem)] leading-relaxed text-home-ink max-lg:mx-auto">
            {hero.description}
          </p>
          <div className="mt-[clamp(1rem,3svh,2rem)] flex flex-wrap gap-2 max-lg:justify-center sm:gap-3">
            <Link href={hero.primary.href} className={cn(homeButtonClass, "max-sm:px-5")}>
              {hero.primary.label}
            </Link>
            <Link href={hero.secondary.href} className={secondaryButtonClass}>
              {hero.secondary.label}
            </Link>
          </div>
        </div>
        <figure className="max-lg:mx-auto max-lg:w-full max-lg:max-w-xl">
          {/* Phones and tablets: a wide, short photo, at most a quarter of the screen tall. */}
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-home-field max-lg:aspect-auto max-lg:h-[min(24svh,56vw)] lg:max-h-[62svh]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 text-sm font-bold text-home-ink italic max-lg:text-center max-sm:sr-only">
            {hero.image.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** 2. Why local data comes first: the reason, then the three steps as a pipeline. */
export function LabsApproach() {
  const { approach } = labsContent;
  return (
    <section id="approach" aria-labelledby="labs-approach-title" className={sectionClass("field")}>
      <div className={homeContainerClass}>
        <h2
          id="labs-approach-title"
          className={cn(homeSectionHeadingClass, "text-center text-home-ink")}
        >
          {approach.title}
        </h2>
        <p className="mx-auto mt-3 max-w-[62ch] text-center text-base leading-relaxed text-home-ink sm:mt-4 sm:text-lg">
          {approach.body.join(" ")}
        </p>
        {/* Three steps joined by arrows: across on a laptop, down on phones and tablets. */}
        <ol
          className={cn(
            homeSectionBodyClass,
            "mx-auto flex max-w-xl flex-col items-stretch gap-1.5 lg:max-w-none lg:flex-row lg:items-stretch lg:gap-3",
          )}
        >
          {approach.steps.map((step, index) => {
            const Icon = approachIcons[index];
            return (
              <li key={step.title} className="contents">
                <div className="flex flex-1 items-center gap-4 rounded-2xl border border-home-ink/15 bg-home-surface px-4 py-3 text-left sm:p-5 lg:flex-col lg:gap-0 lg:p-6 lg:text-center">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-home-field text-home-accent lg:size-14">
                    <Icon aria-hidden className="size-5 lg:size-7" />
                  </span>
                  <span className="min-w-0">
                    <h3 className="text-lg font-bold text-home-ink lg:mt-4 lg:text-xl">
                      <span className="sr-only">Step {index + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-1 text-base leading-snug text-home-ink lg:mt-2 lg:leading-relaxed">
                      {step.description}
                    </p>
                  </span>
                </div>
                {index < approach.steps.length - 1 ? (
                  <ArrowRight
                    aria-hidden
                    className="size-5 shrink-0 self-center text-home-accent max-lg:rotate-90 lg:size-7"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** 3. The flagship: Chinari, its status, its logo and its five steps joined by arrows. */
export function LabsChinari() {
  const { title, status, summary, logo, steps } = labsContent.chinari;
  return (
    <section id="chinari" aria-labelledby="labs-chinari-title" className={sectionClass("ground")}>
      <div className={homeContainerClass}>
        {/* Laptops: the words on the left, the logo beside them on the right (so its size adds
            no height). Phones and tablets: the logo on top, everything centred. */}
        <div className="flex flex-col items-center gap-4 max-lg:text-center lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14">
          <div className="max-lg:order-2">
            <StatusLabel status={status} />
            <h2
              id="labs-chinari-title"
              className={cn(homeSectionHeadingClass, "mt-3 text-home-ink")}
            >
              {title}
            </h2>
            <p className="mt-4 max-w-[78ch] text-base leading-relaxed text-home-ink max-lg:mx-auto max-sm:text-[15px] max-sm:leading-snug sm:text-lg">
              {summary}
            </p>
          </div>
          {/* The logo (cropped to the drawing), large enough to read the snow leopard. */}
          <span className="relative block aspect-[582/438] h-24 shrink-0 max-lg:order-1 sm:h-32 lg:h-48">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="260px"
              className="object-contain dark:hidden"
            />
            <Image
              src={logo.darkSrc}
              alt={logo.alt}
              fill
              sizes="260px"
              className="hidden object-contain dark:block"
            />
          </span>
        </div>
        <Pipeline steps={steps} />
      </div>
    </section>
  );
}

/** Steps joined by arrows: across from tablet width, down on phones. */
function Pipeline({ steps }: { steps: readonly { title: string; description: string }[] }) {
  return (
    <ol
      className={cn(
        homeSectionBodyClass,
        "mx-auto flex max-w-xl flex-col items-stretch gap-1 md:max-w-none md:flex-row md:gap-1.5 lg:gap-2",
      )}
    >
      {steps.map((step, index) => (
        <li key={step.title} className="contents">
          <div className="flex-1 rounded-xl bg-home-field px-4 py-2 max-md:text-center sm:py-3 md:p-3.5 lg:p-5">
            <h3 className="text-base font-bold text-home-ink sm:text-lg md:text-base lg:text-xl">
              <span className="sr-only">Step {index + 1}: </span>
              {step.title}
            </h3>
            <p className="text-sm leading-snug text-home-ink sm:mt-1 sm:text-base md:text-sm lg:text-base">
              {step.description}
            </p>
          </div>
          {index < steps.length - 1 ? (
            <ArrowRight
              aria-hidden
              className="size-4 shrink-0 self-center text-home-accent max-md:rotate-90 sm:size-5 lg:size-6"
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** 4. The research pillars, each with its honest status (Junkiri, the pilot, first). */
export function LabsPillars() {
  const { title, items } = labsContent.pillars;
  return (
    <section id="pillars" aria-labelledby="labs-pillars-title" className={sectionClass("field")}>
      <div className={homeContainerClass}>
        <h2
          id="labs-pillars-title"
          className={cn(homeSectionHeadingClass, "text-center text-home-ink")}
        >
          {title}
        </h2>
        <ul
          className={cn(
            homeSectionBodyClass,
            "mx-auto grid max-w-xl gap-3 md:max-w-none md:grid-cols-3 lg:gap-6",
          )}
        >
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1.5 rounded-xl bg-home-ground p-4 sm:gap-3 sm:p-6 lg:p-7 dark:bg-home-field"
            >
              <span>
                <StatusLabel status={item.status} />
              </span>
              <h3 className="text-lg leading-snug font-bold text-home-ink lg:text-xl">
                {item.name}
              </h3>
              <p className="text-[15px] leading-snug text-home-ink sm:text-base sm:leading-relaxed">
                {item.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
