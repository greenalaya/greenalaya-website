import { PublicationCategoryPage } from "@/components/publication-category-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Scientific Publications",
  description: "Peer-reviewed papers and scientific articles by Greenalaya Nepal's researchers.",
  path: "/publications/scientific",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default function ScientificPublicationsPage() {
  return <PublicationCategoryPage category="scientific" />;
}
