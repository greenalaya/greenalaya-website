"use client";

import { PublicationCardItem } from "@/components/publication-card";
import { SearchableListPage } from "@/components/searchable-list-page";
import { formatLongDate } from "@/lib/format";
import type { PublicationCard } from "@/lib/content/resources";

type PublicationsPageContentProps = {
  publications: PublicationCard[];
  /** The page's title (default "Publications"; each kind's page sets its own). */
  heading?: string;
  emptyMessage?: string;
};

export function PublicationsPageContent({
  publications,
  heading = "Publications",
  emptyMessage = "No publications are available yet.",
}: PublicationsPageContentProps) {
  return (
    <SearchableListPage
      items={publications}
      heading={heading}
      searchLabel="publications"
      emptyMessage={emptyMessage}
      noMatchMessage="No publications match your search."
      getKey={(publication) => publication.id}
      matchesQuery={(publication, q) =>
        publication.title.toLowerCase().includes(q) ||
        (formatLongDate(publication.publishedDateIso)?.toLowerCase().includes(q) ?? false)
      }
      renderItem={(publication) => <PublicationCardItem publication={publication} />}
    />
  );
}
