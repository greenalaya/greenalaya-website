import { HomeHero } from "@/components/home/home-hero";
import { HomePreviewBody } from "@/components/home/home-preview-body";
import { homePreviewPath, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

/** Test version of the redesigned homepage. Not indexed; replaces `/` once approved. */
export const metadata = pageMetadata({
  title: "Homepage preview",
  description: siteConfig.description,
  path: homePreviewPath,
  noIndex: true,
});

// Projects, publications and news come from Supabase (with seed fallback), refreshed like their pages.
export const revalidate = 300;
export const dynamic = "force-static";

export default function HomePreviewPage() {
  return <HomePreviewBody hero={<HomeHero />} />;
}
