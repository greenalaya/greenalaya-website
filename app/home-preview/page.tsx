import { HomeLanding } from "@/components/home-landing";
import { homePreviewPath, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

/** The previous homepage, kept for comparison. Not indexed. */
export const metadata = pageMetadata({
  title: "Homepage preview",
  description: siteConfig.description,
  path: homePreviewPath,
  noIndex: true,
});

export default function HomePreviewPage() {
  return <HomeLanding />;
}
