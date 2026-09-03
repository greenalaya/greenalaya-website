"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, CalendarDays } from "lucide-react";
import type { NewsPost } from "@/lib/types/news";

type NewsPageContentProps = {
  posts: NewsPost[];
};

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function filterPosts(items: NewsPost[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      (item.excerpt?.toLowerCase().includes(q) ?? false) ||
      (item.published_at ? formatDate(item.published_at)?.toLowerCase().includes(q) : false),
  );
}

export function NewsPageContent({ posts }: NewsPageContentProps) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterPosts(posts, query), [posts, query]);

  return (
    <>
      {/* Search bar */}
      <div className="border-b border-border bg-secondary px-5 py-10 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <label htmlFor="news-search" className="sr-only">
            Search news
          </label>
          <div className="relative">
            <input
              id="news-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news by title or date"
              className="w-full rounded-full border border-primary bg-card py-3.5 pr-12 pl-6 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-primary"
            />
          </div>
        </div>
      </div>

      {/* Card grid */}
      <main className="bg-background px-5 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <section className="mt-14 sm:mt-16">
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
              News &amp; Updates
            </h2>

            {filtered.length === 0 ? (
              <p className="mt-8 text-center text-muted-foreground">
                {posts.length === 0
                  ? "No news posts are available yet."
                  : "No posts match your search."}
              </p>
            ) : (
              <ul className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
                {filtered.map((post) => (
                  <li key={post.id}>
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
                            <CalendarDays
                              className="size-4 shrink-0 not-italic text-primary"
                              aria-hidden
                            />
                            {formatDate(post.published_at)}
                          </p>
                        ) : null}
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
