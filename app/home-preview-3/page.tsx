import { HomeHeroSplit } from "@/components/home/home-hero-split";
import { HomeHeroSupporters } from "@/components/home/home-hero-supporters";
import { HomeMothLight } from "@/components/home/home-moth-light";
import { HomeNameQuiz } from "@/components/home/home-name-quiz";
import { HomePreviewBody } from "@/components/home/home-preview-body";
import { getNepalTopSpecies } from "@/lib/content/inaturalist";
import { homePreviewQuizPath, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

/**
 * Third homepage test: the same page as /home-preview-2, with the "Can you name this
 * species?" quiz on the right of the hero instead of the moth lamp. The quiz uses live
 * iNaturalist data; if that can't be reached, the moth lamp stands in. Not indexed.
 */
export const metadata = pageMetadata({
  title: "Homepage preview 3",
  description: siteConfig.description,
  path: homePreviewQuizPath,
  noIndex: true,
});

export const revalidate = 300;
export const dynamic = "force-static";

export default async function HomePreviewQuizPage() {
  const species = await getNepalTopSpecies();

  return (
    <HomePreviewBody
      hero={
        <>
          <HomeHeroSplit aside={species ? <HomeNameQuiz species={species} /> : <HomeMothLight />} />
          <HomeHeroSupporters />
        </>
      }
    />
  );
}
