import { HomeRedesign } from "@/components/home-preview/home-redesign";
import { homePreviewPath, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

/**
 * A frozen copy of the live homepage as it was on 16 Nov 2026, kept as a fallback while the
 * live homepage (/) is changed. Its components live in components/home-preview (a copy of
 * components/home and components/home-v1), so edits to the live homepage don't reach it.
 * Shared data (lib/site, lib/content) and app/globals.css are still shared. Not indexed.
 */
export const metadata = pageMetadata({
  title: "Homepage preview",
  description: siteConfig.description,
  path: homePreviewPath,
  noIndex: true,
});

// Same data refresh as the homepage.
export const revalidate = 300;
export const dynamic = "force-static";

export default function HomePreviewPage() {
  return <HomeRedesign />;
}
