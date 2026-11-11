import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { homeContainerClass, homeSectionHeadingClass } from "@/components/home/home-styles";
import { cn } from "@/lib/utils";
import { homeContent } from "@/lib/site";

/**
 * "Supported by", the section straight after the hero: one large logo tile per supporter,
 * each opening the supporter's own website. Light tiles (soft ivory in dark mode, so the
 * logos don't glare). A little smaller on small laptops, so the two stay side by side.
 *
 * `inScreen` (/home-preview-2): it shares one screen with the impact figures (see
 * HomePreviewBody), so the screen sets the spacing and divider, and on short laptop screens
 * the logos shrink a little. To keep that screen uncrowded the heading stands alone, and it
 * says what the two organisations did: they gave the grants the projects ran on.
 */
export function HomeHeroSupporters({ inScreen = false }: { inScreen?: boolean }) {
  const { supporters } = homeContent.heroOriginal;

  return (
    <section
      id="supported-by"
      aria-labelledby="hero-supporters-title"
      className={cn(
        "scroll-mt-24",
        inScreen ? "pb-12 lg:pb-10" : "border-t border-home-line py-16 md:py-20",
      )}
    >
      <div
        className={`${homeContainerClass} flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16`}
      >
        <div className="max-w-md">
          <h2 id="hero-supporters-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {inScreen ? "Funded by" : "Supported by"}
          </h2>
          {inScreen ? null : (
            <p className="mt-3 text-base leading-relaxed text-home-muted">
              The conservation organisations that support our field work. Each logo opens their
              website.
            </p>
          )}
        </div>
        <ul className="flex shrink-0 flex-wrap gap-4">
          {supporters.map((supporter) => (
            <li key={supporter.name}>
              <a
                href={supporter.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${supporter.name} (opens in a new tab)`}
                className={cn(
                  "group/logo relative block size-40 rounded-xl bg-white p-4 transition-transform duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action motion-safe:hover:-translate-y-0.5 sm:size-64 sm:p-5 lg:size-48 lg:p-4 xl:size-64 xl:p-5 dark:bg-[#e9ede6]",
                  inScreen && "lg:short:size-44 lg:short:p-4",
                )}
              >
                <span className="relative block size-full overflow-hidden rounded-lg">
                  <Image
                    src={supporter.logo}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 216px, 128px"
                    className="object-contain"
                  />
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="absolute top-1 right-1 size-3.5 text-[#1f5f23] opacity-50 transition-opacity group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 sm:size-4"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
