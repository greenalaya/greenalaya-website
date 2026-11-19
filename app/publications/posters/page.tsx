import { PublicationCategoryPage } from "@/components/publication-category-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Posters & Brochures",
  description: "Posters and brochures from Greenalaya Nepal.",
  path: "/publications/posters",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default function PostersPage() {
  return <PublicationCategoryPage category="posters" />;
}
