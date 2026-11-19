import { PublicationCategoryPage } from "@/components/publication-category-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Reports",
  description: "Reports from Greenalaya Nepal's programs, surveys and events.",
  path: "/publications/reports",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default function ReportsPage() {
  return <PublicationCategoryPage category="reports" />;
}
