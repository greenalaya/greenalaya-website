import type { MetadataRoute } from "next";
import { getNewsList } from "@/lib/content/news";
import { getProjectList } from "@/lib/content/projects";
import { getPublications } from "@/lib/content/resources";
import { seedBlogPosts } from "@/lib/content/seed";
import { getTeamMembers } from "@/lib/content/team";
import { siteConfig } from "@/lib/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const revalidate = 3600;
export const dynamic = "force-static";

const staticPaths = [
  "",
  "/about",
  "/projects",
  "/publications",
  "/team",
  "/news",
  "/blog",
  "/membership",
  "/contact",
];

function toDate(value: string | null | undefined) {
  return value ? new Date(value) : undefined;
}

async function getBlogSlugs(): Promise<{ slug: string; published_at: string | null }[]> {
  const postsBySlug = new Map(
    seedBlogPosts.map((post) => [post.slug, { slug: post.slug, published_at: post.published_at }]),
  );

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("blog_posts").select("slug, published_at");
    if (error) {
      console.warn("sitemap: could not load blog_posts from Supabase.", error.message);
    }
    (data ?? []).forEach((post) => postsBySlug.set(post.slug, post));
  }

  return [...postsBySlug.values()];
}

/**
 * Built from the same content resolvers as the list and detail pages, so the
 * sitemap only advertises URLs the site actually serves.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const [projects, publications, { members }, news, blogPosts] = await Promise.all([
    getProjectList(),
    getPublications(),
    getTeamMembers(),
    getNewsList(),
    getBlogSlugs(),
  ]);

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  for (const project of projects) {
    entries.push({
      url: `${base}/projects/${project.slug}`,
      lastModified: toDate(project.created_at),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const publication of publications) {
    entries.push({
      url: `${base}/publications/${publication.slug}`,
      lastModified: toDate(publication.publishedDateIso),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Profiles without a bio are noindexed placeholders (see app/team/[slug]).
  for (const member of members.filter((member) => member.bio)) {
    entries.push({
      url: `${base}/team/${member.slug}`,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  for (const post of news) {
    entries.push({
      url: `${base}/news/${post.slug}`,
      lastModified: toDate(post.published_at),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const post of blogPosts) {
    entries.push({
      url: `${base}/blog/${post.slug}`,
      lastModified: toDate(post.published_at),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
