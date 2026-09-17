"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatLongDate, SearchableListPage } from "@/components/searchable-list-page";
import type { NewsPost } from "@/lib/types/news";

type NewsPageContentProps = {
  posts: NewsPost[];
};

export function NewsPageContent({ posts }: NewsPageContentProps) {
  return (
    <SearchableListPage
      items={posts}
      heading="News & Updates"
      searchLabel="news"
      emptyMessage="No news posts are available yet."
      noMatchMessage="No posts match your search."
      getKey={(post) => post.id}
      matchesQuery={(post, q) =>
        post.title.toLowerCase().includes(q) ||
        (post.excerpt?.toLowerCase().includes(q) ?? false) ||
        (formatLongDate(post.published_at)?.toLowerCase().includes(q) ?? false)
      }
      renderItem={(post) => (
        <article className="group">
          <Link href={`/news/${post.slug}`} className="block no-underline">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {post.featured_image_url ? (
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1b5e20] to-[#8bc34a]" />
              )}
            </div>
            <h3 className="mt-4 text-lg font-normal leading-snug text-foreground transition group-hover:text-primary sm:text-xl">
              {post.title}
            </h3>
            {post.published_at ? (
              <p className="mt-2 flex items-center gap-1.5 text-base italic text-muted-foreground">
                <CalendarDays className="size-4 shrink-0 not-italic text-primary" aria-hidden />
                {formatLongDate(post.published_at)}
              </p>
            ) : null}
          </Link>
        </article>
      )}
    />
  );
}
