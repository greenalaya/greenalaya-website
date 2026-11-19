import { HomeHeroSplit } from "@/components/home/home-hero-split";
import { HomeMothLight } from "@/components/home/home-moth-light";
import { HomePreviewBody } from "@/components/home/home-preview-body";
import { HomeVisitingInsects } from "@/components/home/home-visiting-insects";

/**
 * The homepage (/): a split hero (wording left; the moth lamp, a butterfly meadow by day,
 * right), then one screen with the impact figures, above "Where We Work", the flagship
 * species and the first redesign's work, publications and news sections. The page scrolls
 * freely, and a mouse wheel glides it smoothly (SmoothWheelScroll, in the root layout).
 */
export function HomeRedesign() {
  return (
    <HomePreviewBody
      showDraftImpact
      oneScreenEach
      // Work, publications and news as in the first redesign.
      originalShowcases
      flagshipSpecies
      // The page ends after the flagship species: projects, publications and news have their
      // own pages, in the header's menus.
      showcases={false}
      hero={
        <>
          {/* Over the sections below the hero: fireflies at night, butterflies by day. (Fixed
              to the window, so where it sits in the page doesn't matter; first keeps the
              sections next to each other.) */}
          <HomeVisitingInsects />
          <HomeHeroSplit aside={<HomeMothLight fill />} fill tree meadow />
        </>
      }
    />
  );
}
