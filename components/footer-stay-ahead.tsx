"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ScrollToPrevious } from "@/components/scroll-to-next";
import { Button } from "@/components/ui/button";
import { contactHref, contactIntents, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { sectionTitleClass } from "@/lib/typography";

/**
 * Greenalaya Nepal is not a membership organization, so the band leads with partnership and
 * enquiries. The /membership page itself stays available.
 */
const involvementTabs = [
  {
    label: contactIntents.partner.label,
    href: contactHref("partner"),
    variant: "cool" as const,
  },
  {
    label: "Send a query",
    href: "/contact",
    variant: "outline" as const,
  },
  {
    label: contactIntents.internship.label,
    href: contactHref("internship"),
    variant: "outline" as const,
  },
];

const carouselImages = siteConfig.images.footerCarousel;

// The ::after stretches the 36px circle's tap area to 44px without changing how it looks.
const arrowClass =
  "relative flex size-9 shrink-0 items-center justify-center rounded-full border transition after:absolute after:-inset-1 after:content-[''] border-home-ink/30 text-home-ink hover:border-home-ink/60 hover:bg-home-ink/5 dark:border-white/20 dark:text-white/80 dark:hover:border-white/40 dark:hover:bg-white/10 dark:hover:text-white";

/** Outline buttons that read on the pale light-mode band and keep the white outline in dark mode. */
const outlineClass =
  "border-home-ink bg-transparent text-home-ink hover:bg-home-ink/5 hover:text-home-ink dark:border-white/80 dark:text-white dark:hover:bg-white/10 dark:hover:text-white";

const carouselImageAlts = [
  "Greenalaya Nepal team with butterfly research materials outdoors",
  "Greenalaya Nepal team meeting and collaboration",
  "Nature photographers documenting biodiversity in the field",
  "Greenalaya Nepal field education and conservation outreach",
] as const;

function FooterImageCarousel() {
  const [index, setIndex] = useState(0);
  const count = carouselImages.length;

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  const prevIndex = (index - 1 + count) % count;
  const nextIndex = (index + 1) % count;

  return (
    <div className="flex w-full max-w-full items-center justify-center gap-3 sm:gap-4">
      <button type="button" onClick={prev} aria-label="Previous image" className={arrowClass}>
        <ChevronLeft className="size-5" />
      </button>

      {/* On laptops the photo stays short, so the band and the footer fit one screen together. */}
      <div className="relative h-[220px] w-full max-w-md sm:h-[260px] lg:h-[clamp(200px,29svh,260px)]">
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
        <div className="relative z-10 mx-auto h-full w-[72%] overflow-hidden rounded-2xl shadow-lg shadow-black/15 dark:shadow-2xl dark:shadow-black/40 dark:ring-1 dark:ring-white/10">
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

      <button type="button" onClick={next} aria-label="Next image" className={arrowClass}>
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

type FooterStayAheadProps = {
  /**
   * On laptops, stretch so this band and the site footer exactly fill the screen under the
   * header, with an up arrow back to `previousHref`. Used by the About page's last screen.
   */
  fillScreenWithFooter?: { previousHref: `#${string}`; previousLabel: string };
};

/**
 * The "Stay ahead" band before the footer: follows the light/dark theme (pale green with black
 * text in light mode) and leads with partnership. Used by the homepage (/), /about and /labs.
 */
export function FooterStayAhead({ fillScreenWithFooter }: FooterStayAheadProps) {
  return (
    <section
      id="get-involved"
      className={cn(
        "relative snap-start scroll-mt-24 lg:scroll-mt-[4.5rem] bg-home-field text-home-ink dark:bg-black",
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
      {/* w-full: inside the stretched flex column, auto margins would otherwise shrink it.
          Phones: the same 48px the homepage sections end with. */}
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 md:py-14 lg:py-9">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <h2 className={sectionTitleClass}>Stay ahead with {siteConfig.name}</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-home-ink sm:mt-3.5 lg:mx-0 lg:mt-4">
              Join researchers, communities, and organizations
              <br className="sm:hidden" /> who trust {siteConfig.name}
              <br className="sm:hidden" /> for evidence-based conservation and environmental action
              across Nepal.
            </p>

            {/* Phones: side by side while they fit; when crowded, two on top and the third
                centred below. */}
            <div className="mt-4 flex w-full flex-row flex-wrap items-center justify-center gap-2 sm:mt-5 sm:gap-3 lg:justify-start">
              {involvementTabs.map((tab) => (
                <Button
                  key={tab.label}
                  asChild
                  variant={tab.variant}
                  size="pill"
                  className={cn(
                    "shrink-0 no-underline lg:px-4 lg:py-3 lg:text-sm xl:px-6 xl:py-3.5 xl:text-base",
                    // Phones: each at its own width, its label on one line.
                    "max-sm:min-h-11 max-sm:flex-none max-sm:px-4 max-sm:py-2.5 max-sm:whitespace-nowrap",
                    tab.variant === "outline" && outlineClass,
                  )}
                >
                  <Link href={tab.href}>{tab.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          <FooterImageCarousel />
        </div>
      </div>
    </section>
  );
}
