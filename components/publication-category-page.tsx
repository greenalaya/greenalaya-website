import { PublicationsPageContent } from "@/components/publications-page-content";
import { getPublications } from "@/lib/content/resources";
import { publicationCategories, type PublicationCategory } from "@/lib/site";

/** One kind of publication on a page of its own (e.g. /publications/reports). */
export async function PublicationCategoryPage({ category }: { category: PublicationCategory }) {
  const publications = (await getPublications()).filter(
    (publication) => publication.category === category,
  );
  const { label } = publicationCategories.find((item) => item.id === category)!;
  return (
    <PublicationsPageContent
      publications={publications}
      heading={label}
      emptyMessage={`No ${label.toLowerCase()} have been published here yet.`}
    />
  );
}
