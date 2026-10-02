import { JsonLd } from "@/components/json-ld";
import { PublicationsPageContent } from "@/components/publications-page-content";
import { getPublications } from "@/lib/content/resources";
import { publicationJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { publicationPageCounts, siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Publications",
  description: "Browse research reports and open publications from Greenalaya Nepal.",
  path: "/publications",
});

export const revalidate = 300;
export const dynamic = "force-static";

export default async function PublicationsPage() {
  const publications = await getPublications();
  const primary = publications[0];

  return (
    <>
      {primary ? (
        <JsonLd
          data={publicationJsonLd({
            title: primary.title,
            description: primary.abstract ?? siteConfig.description,
            path: `/publications/${primary.slug}`,
            datePublished: primary.publishedDateIso,
            numberOfPages: publicationPageCounts[primary.slug],
          })}
        />
      ) : null}

      <PublicationsPageContent publications={publications} />
    </>
  );
}
