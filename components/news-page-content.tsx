"use client";

import { ListCard } from "@/components/list-card";
import { SearchableListPage } from "@/components/searchable-list-page";
import { formatLongDate } from "@/lib/format";
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
        <ListCard
          href={`/news/${post.slug}`}
          title={post.title}
          date={post.published_at}
          imageSrc={post.featured_image_url}
        />
      )}
    />
  );
}
