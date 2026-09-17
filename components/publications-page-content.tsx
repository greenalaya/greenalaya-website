"use client";

import { PublicationCardItem } from "@/components/publication-card";
import { formatLongDate, SearchableListPage } from "@/components/searchable-list-page";
import type { PublicationCard } from "@/lib/content/resources";

type PublicationsPageContentProps = {
  publications: PublicationCard[];
};

export function PublicationsPageContent({ publications }: PublicationsPageContentProps) {
  return (
    <SearchableListPage
      items={publications}
      heading="Publications"
      searchLabel="publications"
      emptyMessage="No publications are available yet."
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
