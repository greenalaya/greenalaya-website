"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ScrollToPrevious } from "@/components/scroll-to-next";
import { SectionFadeBridges } from "@/components/section-fade-bridges";
import { Button } from "@/components/ui/button";
import { contactHref, contactIntents, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { sectionTitleClass } from "@/lib/typography";

const involvementTabs = [
  {
    label: contactIntents.volunteer.label,
    href: "/membership",
    variant: "cool" as const,
  },
  {
    label: contactIntents.internship.label,
    href: contactHref("internship"),
    variant: "outlineLight" as const,
  },
  {
    label: contactIntents.partner.label,
    href: contactHref("partner"),
    variant: "outlineLight" as const,
  },
];

/**
 * Redesigned homepage: Greenalaya Nepal is not a membership organization, so the homepage
 * leads with partnership and enquiries. The /membership page itself stays available.
 */
const themedInvolvementTabs = [
  {
    label: contactIntents.partner.label,
    href: contactHref("partner"),
    variant: "cool" as const,
  },
  {
    label: "Send a query",
    href: "/contact",
    variant: "outlineLight" as const,
  },
  {
    label: contactIntents.internship.label,
    href: contactHref("internship"),
    variant: "outlineLight" as const,
  },
];

const carouselImages = siteConfig.images.footerCarousel;

// The ::after stretches the 36px circle's tap area to 44px without changing how it looks.
const arrowBaseClass =
  "relative flex size-9 shrink-0 items-center justify-center rounded-full border transition after:absolute after:-inset-1 after:content-['']";
const arrowDarkClass =
  "border-white/20 text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white";
const arrowThemedClass =
  "border-home-ink/30 text-home-ink hover:border-home-ink/60 hover:bg-home-ink/5 dark:border-white/20 dark:text-white/80 dark:hover:border-white/40 dark:hover:bg-white/10 dark:hover:text-white";

/** Outline buttons that read on the pale light-mode band and keep the white outline in dark mode. */
const outlineThemedClass =
  "border-home-ink bg-transparent text-home-ink hover:bg-home-ink/5 hover:text-home-ink dark:border-white/80 dark:text-white dark:hover:bg-white/10 dark:hover:text-white";

const carouselImageAlts = [
  "Greenalaya Nepal team with butterfly research materials outdoors",
  "Greenalaya Nepal team meeting and collaboration",
  "Nature photographers documenting biodiversity in the field",
  "Greenalaya Nepal field education and conservation outreach",
] as const;

function FooterImageCarousel({ themed, compact = false }: { themed: boolean; compact?: boolean }) {
  const [index, setIndex] = useState(0);
  const count = carouselImages.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;

  return (
    <div className="flex w-full max-w-full items-center justify-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={prev}
        aria-label="Previous image"
        className={cn(arrowBaseClass, themed ? arrowThemedClass : arrowDarkClass)}
      >
        <ChevronLeft className="size-5" />
      </button>

      <div
        className={cn(
          "relative h-[220px] w-full max-w-md sm:h-[260px] lg:h-[280px]",
          // On laptops the photo takes what is left of the screen once the header, the band's
          // padding and the footer (--site-footer-h) are placed, so band and footer fit together.
          themed
            ? "lg:h-[clamp(200px,calc(100svh-4.5rem-var(--site-footer-h,16.75rem)-3.5rem),280px)]"
            : "lg:h-[clamp(200px,calc(100svh-4.5rem-var(--site-footer-h,16.75rem)-5rem),280px)]",
          compact && "lg:h-[clamp(200px,29svh,260px)]",
        )}
      >
        <div
          aria-hidden
          className="absolute left-0 top-3 z-0 h-[88%] w-[18%] overflow-hidden rounded-2xl opacity-50"
        >
          <Image
            src={carouselImages[prevIndex]}
            alt=""
            fill
            className="object-cover"
            sizes="120px"
            quality={75}
            loading="eager"
          />
        </div>
        <div
          aria-hidden
          className="absolute right-0 top-3 z-0 h-[88%] w-[18%] overflow-hidden rounded-2xl opacity-50"
        >
          <Image
            src={carouselImages[nextIndex]}
            alt=""
            fill
            className="object-cover"
            sizes="120px"
            quality={75}
            loading="eager"
          />
        </div>
        <div
          className={cn(
            "relative z-10 mx-auto h-full w-[72%] overflow-hidden rounded-2xl",
            themed
              ? "shadow-lg shadow-black/15 dark:shadow-2xl dark:shadow-black/40 dark:ring-1 dark:ring-white/10"
              : "shadow-2xl shadow-black/40 ring-1 ring-white/10",
          )}
        >
          <Image
            src={carouselImages[index]}
            alt={carouselImageAlts[index]}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 320px, 400px"
            quality={75}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        className={cn(arrowBaseClass, themed ? arrowThemedClass : arrowDarkClass)}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

type FooterStayAheadProps = {
  /**
   * Follow the light/dark theme (pale green with black text in light mode) instead of the
   * always-dark band, and lead with partnership instead of membership. Used by /home-preview
   * and /about.
   */
  themed?: boolean;
  /**
   * On laptops, stretch so this band and the site footer exactly fill the screen under the
   * header, with an up arrow back to `previousHref`. Used by the About page's last screen.
   */
  fillScreenWithFooter?: { previousHref: `#${string}`; previousLabel: string };
};

export function FooterStayAhead({ themed = false, fillScreenWithFooter }: FooterStayAheadProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="get-involved"
      className={cn(
        "relative scroll-mt-24 lg:scroll-mt-[4.5rem]",
        themed
          ? "bg-home-field text-home-ink dark:bg-[#0E110F]"
          : "-mt-[8px] bg-[#0E110F] text-white",
        // On laptops the band stretches so it and the footer exactly fill the last screen under
        // the header, on every page that ends with it; no strip of the previous section shows.
        "lg:flex lg:min-h-[calc(100svh-4.5rem-var(--site-footer-h,16.75rem))] lg:flex-col lg:justify-center",
      )}
    >
      {fillScreenWithFooter ? (
        // Only on taller screens, where the stretched band leaves room above its content.
        <ScrollToPrevious
          href={fillScreenWithFooter.previousHref}
          label={fillScreenWithFooter.previousLabel}
          className="lg:hidden lg:[@media(min-height:50rem)]:flex"
        />
      ) : null}
      {themed ? null : <SectionFadeBridges targetRef={sectionRef} showTop showBottom={false} />}
      <div
        className={cn(
          // Tighter on laptops, so the band and the footer share one screen.
          // w-full: inside the stretched flex column, auto margins would otherwise shrink it.
          "mx-auto w-full max-w-screen-xl px-4 py-14 sm:px-6 lg:px-8 lg:py-10",
          themed && "lg:py-7",
          // Every themed band (About, Home-preview) shares the redesign's 1200px column.
          themed && "w-full max-w-[1200px] px-5 sm:px-8 lg:py-9",
        )}
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <h2 className={sectionTitleClass}>Stay ahead with {siteConfig.name}</h2>
            <p
              className={cn(
                "mx-auto mt-3 max-w-xl text-base leading-relaxed sm:mt-3.5 lg:mx-0 lg:mt-4",
                themed ? "text-home-ink" : "text-white",
              )}
            >
              Join researchers, communities, and organizations
              <br className="sm:hidden" /> who trust {siteConfig.name}
              <br className="sm:hidden" /> for evidence-based conservation and environmental action
              across Nepal.
            </p>

            <div
              className={cn(
                "mt-4 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:mt-5 lg:mt-8 lg:justify-start",
                themed && "lg:mt-5",
              )}
            >
              {(themed ? themedInvolvementTabs : involvementTabs).map((tab) => (
                <Button
                  key={tab.label}
                  asChild
                  variant={themed && tab.variant === "outlineLight" ? "outline" : tab.variant}
                  size="pill"
                  className={cn(
                    "w-full shrink-0 no-underline sm:w-auto",
                    themed && "lg:px-4 lg:py-3 lg:text-sm xl:px-6 xl:py-3.5 xl:text-base",
                    themed && tab.variant === "outlineLight" && outlineThemedClass,
                  )}
                >
                  <Link href={tab.href}>{tab.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          <FooterImageCarousel themed={themed} compact={themed} />
        </div>
      </div>
    </section>
  );
}
