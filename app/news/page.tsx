import { NewsPageContent } from "@/components/news-page-content";
import { getNewsList } from "@/lib/content/news";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "News",
  description: "Updates, publications, and announcements from Greenalaya Nepal.",
  path: "/news",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default async function NewsPage() {
  const posts = await getNewsList();
  return <NewsPageContent posts={posts} />;
}
