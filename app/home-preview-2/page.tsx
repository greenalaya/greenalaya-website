import { HomeHeroSplit } from "@/components/home/home-hero-split";
import { HomeHeroSupporters } from "@/components/home/home-hero-supporters";
import { HomeMothLight } from "@/components/home/home-moth-light";
import { HomePreviewBody } from "@/components/home/home-preview-body";
import { HomeVisitingInsects } from "@/components/home/home-visiting-insects";
import { homePreviewAltPath, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

/**
 * Second homepage test: a split hero (wording left; the moth lamp, a butterfly meadow by day,
 * right), then one screen with its supporters' logos and the impact figures (shown here for
 * review, though still a draft), above the same sections as /home-preview.
 * Not indexed; for comparing the two.
 */
export const metadata = pageMetadata({
  title: "Homepage preview 2",
  description: siteConfig.description,
  path: homePreviewAltPath,
  noIndex: true,
});

export const revalidate = 300;
export const dynamic = "force-static";

export default function HomePreviewAltPage() {
  return (
    <HomePreviewBody
      showDraftImpact
      workMapInScreen
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
      // The next screen: "Supported by" and "Our impact so far" together.
      supporters={<HomeHeroSupporters inScreen />}
    />
  );
}
