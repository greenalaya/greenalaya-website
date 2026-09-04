import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { getSeedBlogPost } from "@/lib/content/seed";
import { articleJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const revalidate = 300;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function loadBlogPost(slug: string) {
  let post = getSeedBlogPost(slug);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content, featured_image_url, published_at")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      post = data;
    }
  }

  return post;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadBlogPost(slug);

  if (!post) {
    return pageMetadata({
      title: "Blog",
      description: "Blog post from Greenalaya Nepal",
      path: `/blog/${slug}`,
    });
  }

  return pageMetadata({
    title: post.title,
    description: post.excerpt ?? "Blog post from Greenalaya Nepal",
    path: `/blog/${post.slug}`,
    image: post.featured_image_url,
  });
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt ?? "Blog post from Greenalaya Nepal",
          path: `/blog/${post.slug}`,
          datePublished: post.published_at,
        })}
      />
      <PageShell
        title={post.title}
        description={
          post.excerpt ??
          (post.published_at ? (formatDate(post.published_at) ?? "Blog post") : "Blog post")
        }
      >
        <p className="mt-6">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← All blog posts
          </Link>
        </p>

        {post.published_at ? (
          <p className="mt-2 text-sm text-muted-foreground">{formatDate(post.published_at)}</p>
        ) : null}

        {post.content ? (
          <div className="mt-6 whitespace-pre-wrap text-lg leading-relaxed text-foreground">
            {post.content}
          </div>
        ) : post.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-foreground">{post.excerpt}</p>
        ) : (
          <p className="mt-6 text-muted-foreground">Content coming soon.</p>
        )}
      </PageShell>
    </>
  );
}
