import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  homeArrowIconClass,
  homeContainerClass,
  homeSectionHeadingClass,
} from "@/components/home/home-styles";

export type ShowcaseItem = {
  key: string;
  href: string;
  title: string;
  /** Short line above the title: a status, a date, or a page count. */
  meta?: string | null;
  description?: string | null;
  image: {
    src: string;
    alt: string;
    /** Optional version for dark mode (e.g. a logo drawn for dark backgrounds). */
    darkSrc?: string;
    /** "contain" keeps logos and publication covers whole on a plain tile. */
    fit?: "cover" | "contain";
  } | null;
};

type HomeShowcaseProps = {
  id: string;
  title: string;
  items: ShowcaseItem[];
  more: { href: string; label: string; description: string };
  /** Section background; the "see all" panel takes the other tone so it always stands out. */
  tone?: "ground" | "field";
  /** Label for the lead item's link, e.g. "View the project". */
  leadLinkLabel: string;
};

const linkClass =
  "group/link no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

const zoomClass =
  "transition-transform duration-500 ease-out motion-safe:group-hover/link:scale-[1.03]";

function Meta({ children, className }: { children?: string | null; className?: string }) {
  if (!children) return null;
  return <p className={cn("text-sm font-semibold text-home-accent", className)}>{children}</p>;
}

function ShowcaseImage({ image, sizes }: { image: ShowcaseItem["image"]; sizes: string }) {
  if (!image) return <div aria-hidden className="absolute inset-0 bg-home-field" />;

  if (image.fit === "contain") {
    return (
      <div className="absolute inset-0 bg-home-surface">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className={cn("object-contain p-3", zoomClass, image.darkSrc && "dark:hidden")}
        />
        {image.darkSrc ? (
          <Image
            src={image.darkSrc}
            alt={image.alt}
            fill
            sizes={sizes}
            className={cn("hidden object-contain p-3 dark:block", zoomClass)}
          />
        ) : null}
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className={cn("object-cover", zoomClass)}
    />
  );
}

/**
 * One large lead item on the left; up to two compact items and a "see all" panel stacked on
 * the right, in equal rows that end level with the lead item.
 */
export function HomeShowcase({
  id,
  title,
  items,
  more,
  tone = "ground",
  leadLinkLabel,
}: HomeShowcaseProps) {
  // Nothing to feature yet (e.g. an empty table): leave the section out entirely.
  if (items.length === 0) return null;

  const [lead, ...rest] = items;
  const side = rest.slice(0, 2);
  // With a single side item it sits naturally and the "see all" panel takes the rest of the
  // column; with two, items and panel share equal rows.
  const single = side.length === 1;
  const rowStyle = {
    "--showcase-rows": single
      ? "auto minmax(0, 1fr)"
      : `repeat(${side.length + 1}, minmax(0, 1fr))`,
  } as CSSProperties;
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn("scroll-mt-24 py-24 md:py-32", tone === "field" && "bg-home-field")}
    >
      <div className={homeContainerClass}>
        <h2 id={titleId} className={`${homeSectionHeadingClass} text-home-ink`}>
          {title}
        </h2>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-10">
          {lead ? (
            <article className="lg:col-span-7">
              <Link href={lead.href} className={cn(linkClass, "block")}>
                <div className="relative aspect-[4/3] overflow-hidden bg-home-field md:aspect-[16/9] lg:aspect-[4/3]">
                  <ShowcaseImage
                    image={lead.image}
                    sizes="(min-width: 1200px) 660px, (min-width: 1024px) 58vw, 100vw"
                  />
                </div>
                <Meta className="mt-6">{lead.meta}</Meta>
                <h3 className="mt-2 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-medium tracking-[-0.015em] text-balance text-home-ink">
                  {lead.title}
                </h3>
                {lead.description ? (
                  <p className="mt-4 line-clamp-4 max-w-[60ch] text-lg leading-relaxed text-home-ink">
                    {lead.description}
                  </p>
                ) : null}
                <span className="mt-4 inline-flex items-center gap-2 font-semibold text-home-accent transition-colors duration-200 group-hover/link:text-home-ink">
                  {leadLinkLabel}
                  <ArrowRight aria-hidden className={homeArrowIconClass} />
                </span>
              </Link>
            </article>
          ) : null}

          <div
            style={rowStyle}
            className="flex flex-col gap-8 md:grid md:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:[grid-template-rows:var(--showcase-rows)] lg:gap-6"
          >
            {side.map((item) => (
              <article key={item.key} className="lg:min-h-0">
                <Link
                  href={item.href}
                  className={cn(
                    linkClass,
                    "flex items-start gap-5 md:flex-col md:gap-4",
                    single ? "lg:gap-4" : "lg:h-full lg:flex-row lg:items-stretch lg:gap-5",
                  )}
                >
                  <div
                    className={cn(
                      "relative aspect-[4/3] w-32 shrink-0 overflow-hidden bg-home-field sm:w-40 md:aspect-[16/9] md:w-full",
                      !single && "lg:aspect-auto lg:w-[45%]",
                    )}
                  >
                    <ShowcaseImage image={item.image} sizes="(min-width: 768px) 360px, 160px" />
                  </div>
                  <div className={cn("min-w-0", !single && "lg:self-center")}>
                    <Meta>{item.meta}</Meta>
                    <h3 className="mt-1.5 font-display text-xl leading-snug font-medium text-home-ink transition-colors duration-200 group-hover/link:text-home-accent sm:text-2xl lg:text-xl xl:text-2xl">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}

            <Link
              href={more.href}
              className={cn(
                linkClass,
                "flex flex-col justify-end p-7 sm:p-8 md:col-span-2 lg:col-span-1",
                tone === "field" ? "bg-home-ground" : "bg-home-field",
              )}
            >
              <p className="text-base leading-relaxed text-home-ink">{more.description}</p>
              <span className="mt-4 inline-flex items-center gap-3 font-display text-2xl font-medium text-home-ink sm:text-3xl">
                {more.label}
                <ArrowRight aria-hidden className={cn(homeArrowIconClass, "size-6")} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
