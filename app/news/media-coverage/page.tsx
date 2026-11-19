import { NewsListPage } from "@/components/news-list-page";
import { getMediaCoverage } from "@/lib/content/media-coverage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Media Coverage",
  description: "What newspapers and news sites have written about Greenalaya Nepal's work.",
  path: "/news/media-coverage",
});

export const dynamic = "force-static";

/** Media Coverage (/news/media-coverage), in the News menu. */
export default function MediaCoveragePage() {
  return (
    <NewsListPage
      heading="Media Coverage"
      intro="What newspapers and news sites have written about our work."
      emptyMessage="No coverage has been added yet."
      entries={getMediaCoverage().map((item) => ({
        id: item.id,
        kicker: item.outlet,
        title: item.headline,
        date: item.publishedOn,
        href: item.url,
        language: item.language,
      }))}
    />
  );
}
