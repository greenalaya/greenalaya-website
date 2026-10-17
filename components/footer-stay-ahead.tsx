"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { SectionFadeBridges } from "@/components/section-fade-bridges";
import { Button } from "@/components/ui/button";
import { contactHref, contactIntents, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

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

const carouselImages = siteConfig.images.footerCarousel;

const arrowBaseClass =
  "flex size-9 shrink-0 items-center justify-center rounded-full border transition";
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

function FooterImageCarousel({ themed }: { themed: boolean }) {
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

      <div className="relative h-[220px] w-full max-w-md sm:h-[260px] lg:h-[280px]">
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
   * always-dark band. Used by the redesigned homepage at /home-preview.
   */
  themed?: boolean;
};

export function FooterStayAhead({ themed = false }: FooterStayAheadProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="get-involved"
      className={cn(
        "relative scroll-mt-24",
        themed
          ? "bg-home-field text-home-ink dark:bg-[#0E110F]"
          : "-mt-[8px] bg-[#0E110F] text-white",
      )}
    >
      {themed ? null : <SectionFadeBridges targetRef={sectionRef} showTop showBottom={false} />}
      <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <h2 className="text-balance text-[clamp(1.35rem,6vw,2.4375rem)] font-bold tracking-tight">
              Stay ahead with {siteConfig.name}
            </h2>
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

            <div className="mt-4 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:mt-5 lg:mt-8 lg:justify-start">
              {involvementTabs.map((tab) => (
                <Button
                  key={tab.label}
                  asChild
                  variant={themed && tab.variant === "outlineLight" ? "outline" : tab.variant}
                  size="pill"
                  className={cn(
                    "w-full shrink-0 no-underline sm:w-auto",
                    themed && tab.variant === "outlineLight" && outlineThemedClass,
                  )}
                >
                  <Link href={tab.href}>{tab.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          <FooterImageCarousel themed={themed} />
        </div>
      </div>
    </section>
  );
}
