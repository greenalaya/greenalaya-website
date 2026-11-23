import { homeSectionHeadingClass } from "@/components/home/home-styles";
import { ScrollToNext, ScrollToPrevious, screenSectionClass } from "@/components/scroll-to-next";
import { ThematicAreasExplorer } from "@/components/thematic-areas-explorer";
import { aboutPageContent } from "@/lib/site";

type ThematicAreasSectionProps = {
  /** Where the down arrow goes, so it never points at a section that isn't rendered. */
  nextHref?: { href: `#${string}`; label: string };
};

/**
 * Thematic Areas on the About page, following the light/dark theme: the heading over the tabbed
 * explorer box (pick an area, read it in the panel), filling the screen on laptops with up/down
 * section arrows.
 */
export function ThematicAreasSection({
  nextHref = { href: "#advisors", label: "Scroll to our advisors" },
}: ThematicAreasSectionProps) {
  return (
    <section
      id="thematic"
      aria-labelledby="thematic-title"
      className={`relative scroll-mt-24 bg-home-ground py-16 text-home-ink md:py-20 lg:pt-12 lg:pb-12 ${screenSectionClass}`}
    >
      <ScrollToPrevious href="#pillars" label="Back to our strategic pillars" />
      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12 lg:mb-6">
          <h2 id="thematic-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {aboutPageContent.thematicHeading}
          </h2>
        </div>
        <ThematicAreasExplorer />
      </div>
      <ScrollToNext href={nextHref.href} label={nextHref.label} />
    </section>
  );
}
