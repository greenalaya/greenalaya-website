import { BlogPageContent } from "@/components/blog-page-content";
import { fetchListWithFallback } from "@/lib/content/fetch-list-with-fallback";
import { seedBlogPosts } from "@/lib/content/seed";
import { pageMetadata } from "@/lib/seo";
import type { BlogPost } from "@/lib/types/blog";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Stories, insights, and reflections from Greenalaya Nepal's conservation and research work.",
  path: "/blog",
});

export const revalidate = 300;
export const dynamic = "force-static";

async function getBlogPosts(): Promise<BlogPost[]> {
  const remotePosts = await fetchListWithFallback<BlogPost>({
    table: "blog_posts",
    columns: "id, title, slug, excerpt, content, featured_image_url, published_at",
    orderColumn: "published_at",
    ascending: false,
    seed: seedBlogPosts,
    label: "blog",
  });

  const postsBySlug = new Map(seedBlogPosts.map((post) => [post.slug, post]));
  remotePosts.forEach((post) => postsBySlug.set(post.slug, post));

  return [...postsBySlug.values()].sort(
    (a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime(),
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogPageContent posts={posts} />;
}
