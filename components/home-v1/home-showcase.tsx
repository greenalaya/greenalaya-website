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
  /** Shown under the lead item's title only. */
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
  /** The "see all" panel. */
  more: { href: string; label: string };
  /** Section background; the "see all" panel takes the other tone so it always stands out. */
  tone?: "ground" | "field";
  /**
   * On a laptop the whole section fits one screen (under the fixed 4.8rem header): the images
   * take whatever height is left after the text, instead of a fixed shape.
   */
  inScreen?: boolean;
};

const linkClass =
  "group/link no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

const zoomClass =
  "transition-transform duration-500 ease-out motion-safe:group-hover/link:scale-[1.03]";

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
  inScreen = false,
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
      className={cn(
        "py-24 md:py-32",
        tone === "field" && "bg-home-field",
        // The floor keeps the text readable in a very short window; the section then runs longer.
        inScreen
          ? "scroll-mt-[4.8rem] lg:flex lg:h-[calc(100svh-4.8rem)] lg:min-h-[34rem] lg:flex-col lg:py-8"
          : "scroll-mt-24",
      )}
    >
      <div
        className={cn(homeContainerClass, inScreen && "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col")}
      >
        <h2 id={titleId} className={`${homeSectionHeadingClass} text-home-ink`}>
          {title}
        </h2>

        <div
          className={cn(
            "mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-10",
            inScreen && "lg:mt-8 lg:min-h-0 lg:flex-1 lg:grid-rows-[minmax(0,1fr)] lg:short:mt-6",
          )}
        >
          {lead ? (
            <article className={cn("lg:col-span-7", inScreen && "lg:min-h-0")}>
              <Link
                href={lead.href}
                className={cn(linkClass, "block", inScreen && "lg:flex lg:h-full lg:flex-col")}
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] overflow-hidden bg-home-field md:aspect-[16/9]",
                    inScreen ? "lg:aspect-auto lg:min-h-0 lg:flex-1" : "lg:aspect-[4/3]",
                  )}
                >
                  <ShowcaseImage
                    image={lead.image}
                    sizes="(min-width: 1200px) 660px, (min-width: 1024px) 58vw, 100vw"
                  />
                </div>
                <h3
                  className={cn(
                    "text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] font-bold tracking-tight text-balance text-home-ink",
                    "mt-6",
                    inScreen && "lg:mt-4 lg:text-[clamp(1.75rem,2.4vw,2.125rem)]",
                  )}
                >
                  {lead.title}
                </h3>
                {lead.description ? (
                  <p
                    className={cn(
                      "mt-4 line-clamp-4 max-w-[60ch] text-lg leading-relaxed text-home-ink",
                      inScreen && "lg:mt-3 lg:line-clamp-2 lg:max-w-none lg:text-base",
                    )}
                  >
                    {lead.description}
                  </p>
                ) : null}
              </Link>
            </article>
          ) : null}

          <div
            style={rowStyle}
            className={cn(
              "flex flex-col gap-8 md:grid md:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:[grid-template-rows:var(--showcase-rows)] lg:gap-6",
              inScreen && "lg:min-h-0",
            )}
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
                    <h3
                      className={cn(
                        "text-xl leading-snug font-bold text-home-ink transition-colors duration-200 group-hover/link:text-home-accent",
                        // In one screen a long title keeps to four lines, so it never runs
                        // past its row.
                        inScreen && "lg:line-clamp-4",
                      )}
                    >
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
                "flex flex-col p-7 sm:p-8 md:col-span-2 lg:col-span-1",
                // The label sits in the middle of the panel, on the left.
                "justify-center",
                tone === "field" ? "bg-home-ground" : "bg-home-field",
                inScreen && "lg:min-h-0 lg:px-7 lg:py-5",
              )}
            >
              <span className="inline-flex items-center gap-3 text-xl font-bold text-home-ink">
                {more.label}
                <ArrowRight aria-hidden className={cn(homeArrowIconClass, "size-5")} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
