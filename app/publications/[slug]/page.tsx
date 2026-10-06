import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PublicationDetailContent } from "@/components/publication-detail-content";
import { getLocalPdfSizeLabel } from "@/lib/content/pdf-size";
import { getPublicationBySlug, getPublications } from "@/lib/content/resources";
import { articleJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { publicationPageCounts } from "@/lib/site";

export const revalidate = 300;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const publications = await getPublications();
  return publications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    return pageMetadata({
      title: "Publication not found",
      description: "Publication from Greenalaya Nepal",
      noIndex: true,
    });
  }

  return pageMetadata({
    title: publication.title,
    description: publication.abstract ?? "Publication from Greenalaya Nepal",
    path: `/publications/${publication.slug}`,
  });
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const publication = await getPublicationBySlug(slug);

  if (!publication) {
    notFound();
  }

  const pdfSizeLabel = await getLocalPdfSizeLabel(publication.pdfUrl);
  const pageCount = publicationPageCounts[publication.slug];

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: publication.title,
          description: publication.abstract ?? "Publication from Greenalaya Nepal",
          path: `/publications/${publication.slug}`,
          datePublished: publication.publishedDateIso,
        })}
      />
      <PublicationDetailContent
        publication={publication}
        pdfSizeLabel={pdfSizeLabel}
        pageCount={pageCount}
      />
    </>
  );
}
