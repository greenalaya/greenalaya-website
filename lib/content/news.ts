import { fetchListWithFallback } from "@/lib/content/fetch-list-with-fallback";
import { getSeedNewsPost, seedNewsPosts } from "@/lib/content/seed";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types/news";

const newsColumns = "id, title, slug, excerpt, content, featured_image_url, published_at";

/**
 * Retired posts. They are left out of the news list and sitemap, and their
 * URLs redirect elsewhere (see next.config.ts).
 */
export const hiddenNewsSlugs = new Set([
  "butterfly-images-kathmandu-valley-released",
  "greenalaya-nepal-launch",
]);

/** Seed posts stay listed until added to Supabase; a Supabase row with the same slug wins. */
export async function getNewsList(): Promise<NewsPost[]> {
  const remotePosts = await fetchListWithFallback<NewsPost>({
    table: "news",
    columns: newsColumns,
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

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  const seed = getSeedNewsPost(slug);
  if (!isSupabaseConfigured()) return seed;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select(newsColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn(
      `Could not load news post "${slug}" from Supabase. Using seed data.`,
      error.message,
    );
    return seed;
  }

  return data ?? seed;
}
