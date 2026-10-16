import { ArrowLeft, CalendarDays, Clock, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { getSeedBlogPost } from "@/lib/content/seed";
import { formatLongDate } from "@/lib/format";
import { articleJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const revalidate = 300;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const imagePattern = /^!\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)]+)\)$/;

async function loadBlogPost(slug: string) {
  let post = getSeedBlogPost(slug);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, content, featured_image_url, published_at, author, author_url, author_role, source_url",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      post = { ...post, ...data };
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

/**
 * Picks the hero image: the post's featured image, otherwise the first image in
 * the content. When the content opens with that same image it is dropped from
 * the body so it is not shown twice.
 */
function splitHeroImage(post: { content: string | null; featured_image_url: string | null }) {
  const content = post.content ?? "";
  const firstLine = content.trimStart().split("\n", 1)[0]?.trim() ?? "";
  const leading = firstLine.match(imagePattern);
  const firstImage = content.split("\n").find((line) => imagePattern.test(line.trim()));
  const firstMatch = firstImage?.trim().match(imagePattern);

  const src = post.featured_image_url ?? firstMatch?.[2] ?? null;
  const alt = (leading && leading[2] === src ? leading[1] : firstMatch?.[1]) ?? "";
  const body =
    leading && leading[2] === src ? content.trimStart().slice(firstLine.length) : content;

  return { hero: src ? { src, alt } : null, body };
}

function readingMinutes(content: string) {
  const words = content
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .split(/\s+/)
    .filter(Boolean);
  return Math.max(1, Math.round(words.length / 220));
}

function renderInlineMarkdown(text: string, keyPrefix: string) {
  const tokenPattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(tokenPattern);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (link) {
      const [, label, href] = link;
      const isExternal = /^https?:\/\//.test(href);

      return (
        <a
          key={key}
          href={href}
          className="font-medium text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label.replace(/^\*|\*$/g, "")}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function renderArticleContent(content: string): ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;
  let isLead = true;

  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading = trimmed.match(/^##\s+(.+)$/);
    if (heading) {
      blocks.push(
        <h2
          key={index}
          className="pt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {heading[1]}
        </h2>,
      );
      isLead = false;
      index += 1;
      continue;
    }

    const image = trimmed.match(imagePattern);
    if (image) {
      const [, alt, src] = image;
      blocks.push(
        <figure key={index} className="!my-12">
          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-muted">
            {src.startsWith("/") ? (
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover"
              />
            ) : (
              // Remote article artwork is rendered directly to preserve its source URL.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="absolute inset-0 size-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          {alt ? (
            <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">{alt}</figcaption>
          ) : null}
        </figure>,
      );
      isLead = false;
      index += 1;
      continue;
    }

    const ordered = /^\d+\.\s/.test(trimmed);
    if (trimmed.startsWith("- ") || ordered) {
      const listType = ordered ? "ol" : "ul";
      const items: string[] = [];

      while (index < lines.length) {
        const item = lines[index].trim();
        const isOrderedItem = /^\d+\.\s/.test(item);
        const isUnorderedItem = item.startsWith("- ");
        if ((listType === "ol" && !isOrderedItem) || (listType === "ul" && !isUnorderedItem)) {
          break;
        }

        items.push(item.replace(/^(?:-\s|\d+\.\s)/, ""));
        index += 1;
      }

      const List = listType;
      blocks.push(
        <List
          key={index - items.length}
          className={`space-y-3 pl-7 marker:font-semibold marker:text-primary ${ordered ? "list-decimal" : "list-disc"}`}
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-1">
              {renderInlineMarkdown(item, `list-${index - items.length}-${itemIndex}`)}
            </li>
          ))}
        </List>,
      );
      isLead = false;
      continue;
    }

    const paragraph: string[] = [];
    const paragraphStart = index;
    while (index < lines.length) {
      const line = lines[index].trim();
      if (
        !line ||
        /^##\s+/.test(line) ||
        imagePattern.test(line) ||
        line.startsWith("- ") ||
        /^\d+\.\s/.test(line)
      ) {
        break;
      }
      paragraph.push(line);
      index += 1;
    }

    blocks.push(
      <p
        key={paragraphStart}
        className={
          isLead
            ? "pb-3 text-2xl font-medium leading-9 text-foreground sm:text-3xl sm:leading-[1.4]"
            : undefined
        }
      >
        {renderInlineMarkdown(paragraph.join(" "), `paragraph-${paragraphStart}`)}
      </p>,
    );
    isLead = false;
  }

  return blocks;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { hero, body } = splitHeroImage(post);
  const articleUrl = `${siteConfig.url}/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);
  const publishedOn = formatLongDate(post.published_at);

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
      <main className="overflow-hidden pb-20 pt-20 md:pt-24">
        <article>
          <header className="relative bg-[#07150b] text-white">
            {hero ? (
              <div className="absolute inset-0">
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="100vw"
                  className="object-cover object-center opacity-45"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,8,0.96)_0%,rgba(4,18,8,0.76)_48%,rgba(4,18,8,0.2)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07150b]/90 via-transparent to-transparent" />
              </div>
            ) : null}

            <div className="relative mx-auto flex min-h-[480px] max-w-7xl flex-col justify-between px-5 py-10 sm:min-h-[560px] sm:px-8 md:min-h-[680px] md:py-14 lg:px-10">
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/10"
              >
                <ArrowLeft className="size-4" aria-hidden /> All blog posts
              </Link>

              <div className="max-w-4xl pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8bd88f]">Blog</p>
                <h1 className="mt-5 text-[clamp(2.35rem,5.4vw,4.9rem)] font-bold leading-[0.96] tracking-[-0.045em] text-white">
                  {post.title}
                </h1>
                {post.excerpt ? (
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
                    {post.excerpt}
                  </p>
                ) : null}
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/72">
                  {post.author ? (
                    <span className="inline-flex items-center gap-2">
                      <UserRound className="size-4 text-[#8bd88f]" aria-hidden />
                      {post.author}
                    </span>
                  ) : null}
                  {publishedOn ? (
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#8bd88f]" aria-hidden />
                      {publishedOn}
                    </span>
                  ) : null}
                  {body ? (
                    <span className="inline-flex items-center gap-2">
                      <Clock className="size-4 text-[#8bd88f]" aria-hidden />
                      {readingMinutes(body)} min read
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-10">
            <div className="max-w-3xl min-w-0">
              {body.trim() ? (
                <div className="space-y-7 text-[1.075rem] leading-8 text-muted-foreground">
                  {renderArticleContent(body)}
                </div>
              ) : (
                <p className="text-muted-foreground">Content coming soon.</p>
              )}
            </div>

            <aside
              className="h-fit rounded-2xl border border-border bg-card p-5 shadow-[0_14px_40px_rgba(13,55,22,0.06)] lg:sticky lg:top-28"
              aria-label="Article details"
            >
              {post.author ? (
                <div>
                  <p className="text-[0.7rem] font-bold uppercase leading-5 tracking-[0.18em] text-muted-foreground">
                    Written by
                  </p>
                  <p className="mt-4 text-sm font-semibold leading-5 text-foreground">
                    {post.author_url ? (
                      <Link href={post.author_url} className="hover:text-primary hover:underline">
                        {post.author}
                      </Link>
                    ) : (
                      post.author
                    )}
                  </p>
                  {post.author_role ? (
                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {post.author_role}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {post.source_url ? (
                <div className={post.author ? "mt-7 border-t border-border pt-6" : undefined}>
                  <p className="text-[0.7rem] font-bold uppercase leading-5 tracking-[0.18em] text-muted-foreground">
                    Originally published
                  </p>
                  <a
                    href={post.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-accent"
                  >
                    Read on Medium
                  </a>
                </div>
              ) : null}
              <div
                className={
                  post.author || post.source_url ? "mt-7 border-t border-border pt-6" : undefined
                }
              >
                <p className="text-[0.7rem] font-bold uppercase leading-5 tracking-[0.18em] text-muted-foreground">
                  Share this story
                </p>
                <div className="mt-4 grid gap-2 text-sm font-semibold text-primary">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                  >
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:?subject=${shareText}&body=${encodeURIComponent(articleUrl)}`}
                    className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                  >
                    Email
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
