import { ListCard } from "@/components/list-card";
import { PublicationCategoryTag } from "@/components/publication-category-tag";
import type { PublicationCard } from "@/lib/content/resources";

type PublicationCardProps = {
  publication: PublicationCard;
};

export function PublicationCardItem({ publication }: PublicationCardProps) {
  return (
    <ListCard
      href={`/publications/${publication.slug}`}
      title={publication.title}
      date={publication.publishedDateIso}
      imageSrc={publication.coverImage}
      tag={(className) => (
        <PublicationCategoryTag category={publication.category} className={className} />
      )}
    />
  );
}
