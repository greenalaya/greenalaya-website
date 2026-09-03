import { NewsPageContent } from "@/components/news-page-content";
import { fetchListWithFallback } from "@/lib/content/fetch-list-with-fallback";
import { seedNewsPosts } from "@/lib/content/seed";
import { pageMetadata } from "@/lib/seo";
import type { NewsPost } from "@/lib/types/news";

export const metadata = pageMetadata({
  title: "News",
  description: "Updates, publications, and announcements from Greenalaya Nepal.",
  path: "/news",
});

export const revalidate = 300;
export const dynamic = "force-static";

const hiddenNewsSlugs = new Set([
  "butterfly-images-kathmandu-valley-released",
  "greenalaya-nepal-launch",
]);

async function getNews(): Promise<NewsPost[]> {
  const remotePosts = await fetchListWithFallback<NewsPost>({
    table: "news",
    columns: "id, title, slug, excerpt, content, featured_image_url, published_at",
    orderColumn: "published_at",
    ascending: false,
    seed: seedNewsPosts,
    label: "news",
  });

  const postsBySlug = new Map(seedNewsPosts.map((post) => [post.slug, post]));
  remotePosts.forEach((post) => postsBySlug.set(post.slug, post));

  return [...postsBySlug.values()]
    .filter((post) => !hiddenNewsSlugs.has(post.slug))
    .sort(
      (a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime(),
    );
}

export default async function NewsPage() {
  const posts = await getNews();
  return <NewsPageContent posts={posts} />;
}
