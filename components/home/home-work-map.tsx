import { SiteMap } from "@/components/field-map/site-map";
import {
  homeContainerClass,
  homeScreenClass,
  homeSectionBodyClass,
  homeSectionHeadingClass,
  homeSectionSpaceClass,
} from "@/components/home/home-styles";
import { fieldMapColours, fieldMapSites } from "@/lib/content/field-map-sites";
import { cn } from "@/lib/utils";

/**
 * "Where We Work": an OpenStreetMap street map of Nepal (Esri's dark street map in the dark
 * theme) with Nepal's official 2020 boundary, a marker for each field event and our office in
 * Hemja. Nearby markers gather into a cluster that opens as you zoom in, and a marker's popup
 * gives the event, the place, the people and what was found, with a link to its story. The
 * map itself is components/field-map/site-map.tsx; its points come from
 * lib/content/field-map-sites.ts.
 *
 * `inScreen` (the homepage (/)): on a laptop the section is one screen, like the screens around
 * it, and the map fills what the screen leaves under the heading.
 */
export function HomeWorkMap({ inScreen = false }: { inScreen?: boolean }) {
  return (
    <section
      id="where-we-work"
      aria-labelledby="where-title"
      className={cn(
        // The screens page alternates green and plain from the hero: the map's screen is green.
        // At least one screen rather than exactly one, so nothing spills into its neighbours.
        inScreen
          ? [
              "bg-home-field dark:bg-home-ground",
              homeScreenClass,
              "lg:h-auto lg:min-h-[calc(100svh-4.5rem)] lg:justify-center",
            ]
          : ["scroll-mt-24 border-t border-home-line", homeSectionSpaceClass],
      )}
    >
      <div className={homeContainerClass}>
        <h2
          id="where-title"
          // Phones and tablets: centred.
          className={`${homeSectionHeadingClass} text-home-ink max-lg:text-center`}
        >
          Where We Work
        </h2>

        <div className={cn(homeSectionBodyClass, inScreen && "lg:mt-8 lg:short:mt-6")}>
          <SiteMap
            sites={fieldMapSites}
            colours={fieldMapColours}
            label="Map of Nepal with the places we have worked."
            // One screen on a laptop: as tall as the screen allows once the header, the
            // padding, the heading and the gap under it are taken off (about 14rem in all).
            mapClassName={
              inScreen ? "h-110 md:h-125 lg:h-[max(24rem,calc(100svh-14rem))]" : "h-110 md:h-145"
            }
          />
        </div>
      </div>
    </section>
  );
}
