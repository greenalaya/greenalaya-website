import { HomeHeroSplit } from "@/components/home-preview/home-hero-split";
import { HomeHeroSupporters } from "@/components/home-preview/home-hero-supporters";
import { HomeMothLight } from "@/components/home-preview/home-moth-light";
import { HomePreviewBody } from "@/components/home-preview/home-preview-body";
import { HomeVisitingInsects } from "@/components/home-preview/home-visiting-insects";

/**
 * The homepage (/): a split hero (wording left; the moth lamp, a butterfly meadow by day,
 * right), then one screen with the funders' logos and the impact figures, above "Where We
 * Work", the flagship species and the first redesign's work, publications and news sections.
 */
export function HomeRedesign() {
  return (
    <HomePreviewBody
      showDraftImpact
      oneScreenEach
      // Work, publications and news as in the first redesign.
      originalShowcases
      flagshipSpecies
      hero={
        <>
          {/* Over the sections below the hero: fireflies at night, butterflies by day. (Fixed
              to the window, so where it sits in the page doesn't matter; first keeps the
              sections next to each other.) */}
          <HomeVisitingInsects />
          <HomeHeroSplit aside={<HomeMothLight fill />} fill tree meadow />
        </>
      }
      // The next screen: "Funded by" and "Our impact so far" together.
      supporters={<HomeHeroSupporters inScreen />}
    />
  );
}
